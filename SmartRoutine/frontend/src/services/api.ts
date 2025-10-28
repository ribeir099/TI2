import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

import { storageService } from './storageService';

// ============================================
// CONFIGURAÇÃO BASEADA NO .ENV
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6789';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const LOG_REQUESTS = import.meta.env.VITE_LOG_REQUESTS === 'true';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_DELAY = parseInt(import.meta.env.VITE_MOCK_DELAY || '500');

const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
const IS_DEVELOPMENT = APP_ENV === 'development';
const IS_PRODUCTION = APP_ENV === 'production';
const IS_STAGING = APP_ENV === 'staging';

// ============================================
// CONFIGURAÇÃO DA INSTÂNCIA AXIOS
// ============================================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================
// INTERCEPTOR DE REQUISIÇÃO
// ============================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adicionar token de autenticação (se existir)
    const token = storageService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar timestamp para tracking
    if (config.headers) {
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      config.headers['X-App-Env'] = APP_ENV; // ✅ Adicionar ambiente no header
    }

    // Log de requisições (apenas em development e staging)
    if (LOG_REQUESTS && (IS_DEVELOPMENT || IS_STAGING)) {
      console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
      console.log('📦 Dados:', config.data);
      console.log('🔧 Headers:', config.headers);
      console.log('⚙️ Params:', config.params);
      console.log('🌍 Ambiente:', APP_ENV);
      console.groupEnd();
    }

    // Simular delay em modo mock
    if (USE_MOCK_DATA && MOCK_DELAY > 0) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(config), MOCK_DELAY);
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (LOG_REQUESTS && !IS_PRODUCTION) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPOSTA
// ============================================

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de respostas bem-sucedidas (exceto em produção)
    if (LOG_REQUESTS && !IS_PRODUCTION) {
      console.group(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      console.log('📥 Dados:', response.data);
      console.log('⏱️ Tempo:', response.headers['x-response-time'] || 'N/A');
      console.log('🌍 Ambiente:', APP_ENV);
      console.groupEnd();
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Log de erros (configurável por ambiente)
    if (LOG_REQUESTS || IS_DEVELOPMENT) {
      const logLevel = IS_PRODUCTION ? 'warn' : 'error';
      console.group(`❌ Response Error [${APP_ENV.toUpperCase()}]`);
      console[logLevel]('Status:', error.response?.status);
      console[logLevel]('Message:', error.message);
      console[logLevel]('Data:', error.response?.data);
      console[logLevel]('URL:', error.config?.url);
      console.groupEnd();
    }

    // Tratamento de erros específicos
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
      case 400:
        // Bad Request
        if (!IS_PRODUCTION) {
          console.warn('⚠️ Bad Request:', data?.error || data?.message);
        }
        break;

      case 401:
        // Não autorizado - Limpar token e redirecionar
        if (!IS_PRODUCTION) {
          console.warn('🔒 Não autorizado - Token inválido ou expirado');
        }
        storageService.removeToken();
        storageService.removeUser();

        // Evitar loop infinito
        if (window.location.pathname !== '/' && !window.location.pathname.includes('login')) {
          window.location.href = '/';
        }
        break;

      case 403:
        // Acesso negado
        if (!IS_PRODUCTION) {
          console.error('🚫 Acesso negado');
        }
        break;

      case 404:
        // Não encontrado
        if (!IS_PRODUCTION) {
          console.warn('🔍 Recurso não encontrado:', error.config?.url);
        }
        break;

      case 409:
        // Conflito (ex: email duplicado)
        if (!IS_PRODUCTION) {
          console.warn('⚠️ Conflito:', data?.error || 'Recurso já existe');
        }
        break;

      case 422:
        // Validação falhou
        if (!IS_PRODUCTION) {
          console.warn('⚠️ Erro de validação:', data?.errors || data?.error);
        }
        break;

      case 429:
        // Too Many Requests - Retry após delay
        if (!IS_PRODUCTION) {
          console.warn('⏳ Muitas requisições - aguardando...');
        }
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          const retryAfter = parseInt(error.response.headers['retry-after'] || '2') * 1000;
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          return api(originalRequest);
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Erros de servidor - Retry uma vez (exceto em produção onde já temos retry)
        console.error(`🔥 Erro no servidor (${status})`);
        if (!originalRequest._retry && IS_DEVELOPMENT) {
          originalRequest._retry = true;
          await new Promise(resolve => setTimeout(resolve, 1000));
          return api(originalRequest);
        }
        break;

      default:
        console.error(`❌ Erro ${status}:`, error.response.statusText);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('📡 Servidor não respondeu. Verifique sua conexão.');

      // Retry em caso de timeout (apenas em development)
      if (error.code === 'ECONNABORTED' && !originalRequest._retry && IS_DEVELOPMENT) {
        originalRequest._retry = true;
        return api(originalRequest);
      }
    } else {
      // Erro ao configurar a requisição
      console.error('⚙️ Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
* Verifica se a API está online
*/
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    if (!IS_PRODUCTION) {
      console.error('API Health Check Failed:', error);
    }
    return false;
  }
}

/**
* Obtém informações da API
*/
export async function getApiInfo(): Promise<{
  message: string;
  version: string;
  entities: string[];
} | null> {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    if (!IS_PRODUCTION) {
      console.error('Failed to get API info:', error);
    }
    return null;
  }
}

/**
* Configura token de autenticação
*/
export function setAuthToken(token: string): void {
  storageService.setToken(token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  if (!IS_PRODUCTION) {
    console.log('🔑 Token configurado');
  }
}

/**
* Remove token de autenticação
*/
export function removeAuthToken(): void {
  storageService.removeToken();
  delete api.defaults.headers.common['Authorization'];

  if (!IS_PRODUCTION) {
    console.log('🔓 Token removido');
  }
}

/**
* Faz requisição com retry automático
*/
export async function requestWithRetry<T>(
  config: AxiosRequestConfig,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        if (!IS_PRODUCTION) {
          console.warn(`Tentativa ${i + 1}/${maxRetries} falhou. Tentando novamente em ${retryDelay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}

/**
* Cancela todas as requisições pendentes
*/
const pendingRequests = new Map<string, AbortController>();

export function cancelPendingRequests(): void {
  pendingRequests.forEach((controller) => {
    controller.abort();
  });
  pendingRequests.clear();

  if (!IS_PRODUCTION) {
    console.log('🛑 Todas as requisições pendentes foram canceladas');
  }
}

/**
* Faz requisição cancelável
*/
export async function cancelableRequest<T>(
  config: AxiosRequestConfig,
  requestId: string
): Promise<T> {
  // Cancelar requisição anterior com mesmo ID
  if (pendingRequests.has(requestId)) {
    if (!IS_PRODUCTION) {
      console.log(`🛑 Cancelando requisição anterior: ${requestId}`);
    }
    pendingRequests.get(requestId)?.abort();
  }

  // Criar novo AbortController
  const controller = new AbortController();
  pendingRequests.set(requestId, controller);

  try {
    const response = await api({
      ...config,
      signal: controller.signal,
    });
    pendingRequests.delete(requestId);
    return response.data;
  } catch (error) {
    pendingRequests.delete(requestId);
    throw error;
  }
}

// ============================================
// HELPERS PARA DESENVOLVIMENTO
// ============================================

/**
* Mock de resposta para testes
*/
export function mockResponse<T>(data: T, delay: number = MOCK_DELAY): Promise<T> {
  if (IS_PRODUCTION) {
    console.warn('⚠️ Mock responses não devem ser usados em produção!');
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
* Simula erro de API
*/
export function mockError(message: string, status: number = 500): Promise<never> {
  if (IS_PRODUCTION) {
    console.warn('⚠️ Mock errors não devem ser usados em produção!');
  }

  return Promise.reject({
    response: {
      status,
      data: { error: message },
    },
  });
}

// ============================================
// INFORMAÇÕES DE DEBUG
// ============================================

if (!IS_PRODUCTION && LOG_REQUESTS) {
  console.group(`🔧 SmartRoutine API Configuration [${APP_ENV.toUpperCase()}]`);
  console.log('📡 Base URL:', API_BASE_URL);
  console.log('⏱️ Timeout:', `${API_TIMEOUT}ms`);
  console.log('🧪 Mock Data:', USE_MOCK_DATA);
  console.log('📊 Log Requests:', LOG_REQUESTS);
  console.log('🌍 Environment:', APP_ENV);
  console.log('🔧 Mode:', import.meta.env.MODE);
  console.groupEnd();
}

// ============================================
// WARNING EM PRODUÇÃO
// ============================================

if (IS_PRODUCTION) {
  // Desabilitar logs em produção
  if (LOG_REQUESTS) {
    console.warn('⚠️ Logs de requisição estão ativos em PRODUÇÃO. Considere desabilitar.');
  }

  // Avisar se usando mock data em produção
  if (USE_MOCK_DATA) {
    console.error('🚨 ERRO: Mock data está ativo em PRODUÇÃO! Desabilite imediatamente.');
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default api;

// ============================================
// EXPORT DE CONSTANTES DE AMBIENTE
// ============================================

export const ENV = {
  APP_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_STAGING,
  API_BASE_URL,
} as const;