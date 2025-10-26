import { 
 AxiosInstance, 
 AxiosError, 
 AxiosResponse,
 InternalAxiosRequestConfig 
} from 'axios';
import { tokenStorage } from '@/infrastructure/storage/TokenStorage';
import { AppError } from '@/shared/errors/AppError';

/**
* Configuração de interceptors
*/
export interface InterceptorConfig {
 enableAuth?: boolean;
 enableRefresh?: boolean;
 enableLogging?: boolean;
 onTokenExpired?: () => void;
 onUnauthorized?: () => void;
}

/**
* Request que está sendo retentado
*/
interface RetryableRequest extends InternalAxiosRequestConfig {
 _retry?: boolean;
 _retryCount?: number;
}

/**
* Configura interceptor de requisição
* Adiciona token de autenticação automaticamente
*/
export const setupRequestInterceptor = (
 client: AxiosInstance,
 config: InterceptorConfig = {}
): void => {
 client.interceptors.request.use(
   (requestConfig: InternalAxiosRequestConfig) => {
     // Adicionar token se autenticação habilitada
     if (config.enableAuth !== false) {
       const token = tokenStorage.getToken();
       
       if (token && requestConfig.headers) {
         requestConfig.headers.Authorization = `Bearer ${token}`;
       }
     }

     // Adicionar timestamp para métricas
     (requestConfig as any)._startTime = Date.now();

     return requestConfig;
   },
   (error: AxiosError) => {
     console.error('Erro na configuração da requisição:', error);
     return Promise.reject(error);
   }
 );
};

/**
* Configura interceptor de resposta
* Trata erros e renova token automaticamente
*/
export const setupResponseInterceptor = (
 client: AxiosInstance,
 config: InterceptorConfig = {}
): void => {
 client.interceptors.response.use(
   (response: AxiosResponse) => {
     // Calcular tempo de requisição
     const startTime = (response.config as any)._startTime;
     if (startTime && config.enableLogging) {
       const duration = Date.now() - startTime;
       console.log(`⏱️ Request took ${duration}ms`);
     }

     return response;
   },
   async (error: AxiosError) => {
     const originalRequest = error.config as RetryableRequest;

     if (!originalRequest) {
       return Promise.reject(error);
     }

     // Erro 401 - Não autorizado
     if (error.response?.status === 401) {
       // Se já tentou fazer refresh, não tentar novamente
       if (originalRequest._retry) {
         // Token refresh falhou - fazer logout
         if (config.onTokenExpired) {
           config.onTokenExpired();
         }
         return Promise.reject(error);
       }

       // Marcar que já tentou
       originalRequest._retry = true;

       // Tentar renovar token se habilitado
       if (config.enableRefresh !== false) {
         try {
           const refreshToken = tokenStorage.getRefreshToken();

           if (!refreshToken) {
             throw new Error('Refresh token não encontrado');
           }

           // Fazer requisição de refresh
           // Nota: Este endpoint precisa estar implementado no backend
           const response = await client.post('/auth/refresh', { 
             refreshToken 
           });

           const { accessToken } = response.data;

           // Salvar novo token
           tokenStorage.setToken(accessToken);

           // Atualizar header da requisição original
           if (originalRequest.headers) {
             originalRequest.headers.Authorization = `Bearer ${accessToken}`;
           }

           // Tentar requisição novamente
           return client(originalRequest);
         } catch (refreshError) {
           // Refresh falhou - fazer logout
           tokenStorage.clearAll();
           
           if (config.onTokenExpired) {
             config.onTokenExpired();
           }

           return Promise.reject(refreshError);
         }
       }

       // Se refresh não habilitado, chamar callback
       if (config.onUnauthorized) {
         config.onUnauthorized();
       }
     }

     // Erro 429 - Too Many Requests (Retry com backoff)
     if (error.response?.status === 429) {
       const retryCount = originalRequest._retryCount || 0;
       const maxRetries = 3;

       if (retryCount < maxRetries) {
         originalRequest._retryCount = retryCount + 1;

         // Aguardar com exponential backoff
         const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
         await new Promise(resolve => setTimeout(resolve, delay));

         return client(originalRequest);
       }
     }

     // Erro 503 - Service Unavailable (Retry)
     if (error.response?.status === 503) {
       const retryCount = originalRequest._retryCount || 0;
       const maxRetries = 2;

       if (retryCount < maxRetries) {
         originalRequest._retryCount = retryCount + 1;

         // Aguardar 2 segundos
         await new Promise(resolve => setTimeout(resolve, 2000));

         return client(originalRequest);
       }
     }

     return Promise.reject(error);
   }
 );
};

/**
* Configura interceptor de cache (simples)
*/
export const setupCacheInterceptor = (client: AxiosInstance): void => {
 const cache = new Map<string, { data: any; timestamp: number }>();
 const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

 client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
   // Apenas cachear requisições GET
   if (config.method?.toLowerCase() === 'get' && config.url) {
     const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
     const cached = cache.get(cacheKey);

     if (cached) {
       const age = Date.now() - cached.timestamp;

       if (age < CACHE_DURATION) {
         // Retornar dados do cache
         console.log(`📦 Cache hit: ${config.url}`);
         return Promise.reject({
           isCache: true,
           data: cached.data,
           config
         } as any);
       } else {
         // Cache expirado
         cache.delete(cacheKey);
       }
     }
   }

   return config;
 });

 client.interceptors.response.use(
   (response: AxiosResponse) => {
     // Cachear resposta de GET
     if (response.config.method?.toLowerCase() === 'get' && response.config.url) {
       const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
       cache.set(cacheKey, {
         data: response.data,
         timestamp: Date.now()
       });
     }

     return response;
   },
   (error: any) => {
     // Se é cache hit, retornar dados
     if (error.isCache) {
       return Promise.resolve({
         data: error.data,
         status: 200,
         statusText: 'OK (cached)',
         headers: {},
         config: error.config
       });
     }

     return Promise.reject(error);
   }
 );
};

/**
* Configura interceptor de métricas
*/
export const setupMetricsInterceptor = (client: AxiosInstance): void => {
 const metrics = {
   totalRequests: 0,
   successfulRequests: 0,
   failedRequests: 0,
   averageResponseTime: 0,
   requestsByEndpoint: new Map<string, number>()
 };

 client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
   metrics.totalRequests++;
   
   if (config.url) {
     const count = metrics.requestsByEndpoint.get(config.url) || 0;
     metrics.requestsByEndpoint.set(config.url, count + 1);
   }

   return config;
 });

 client.interceptors.response.use(
   (response: AxiosResponse) => {
     metrics.successfulRequests++;

     const startTime = (response.config as any)._startTime;
     if (startTime) {
       const duration = Date.now() - startTime;
       metrics.averageResponseTime = 
         (metrics.averageResponseTime * (metrics.successfulRequests - 1) + duration) / 
         metrics.successfulRequests;
     }

     return response;
   },
   (error: AxiosError) => {
     metrics.failedRequests++;
     return Promise.reject(error);
   }
 );

 // Expor métricas globalmente (dev mode)
 if (import.meta.env.DEV) {
   (window as any).__API_METRICS__ = metrics;
 }
};

/**
* Configura todos os interceptors
*/
export const setupInterceptors = (
 client: AxiosInstance,
 config: InterceptorConfig = {}
): void => {
 setupRequestInterceptor(client, config);
 setupResponseInterceptor(client, config);

 if (import.meta.env.DEV) {
   setupMetricsInterceptor(client);
 }
};

/**
* Limpa todos os interceptors
*/
export const clearInterceptors = (client: AxiosInstance): void => {
 client.interceptors.request.clear();
 client.interceptors.response.clear();
};

/**
* Cria interceptor de retry customizado
*/
export const createRetryInterceptor = (
 client: AxiosInstance,
 maxRetries: number = 3,
 retryDelay: number = 1000
): void => {
 client.interceptors.response.use(
   (response) => response,
   async (error: AxiosError) => {
     const config = error.config as RetryableRequest;

     if (!config) {
       return Promise.reject(error);
     }

     // Inicializar contador de retry
     config._retryCount = config._retryCount || 0;

     // Verificar se deve fazer retry
     const shouldRetry = 
       config._retryCount < maxRetries &&
       error.code === 'ECONNABORTED' || // Timeout
       error.code === 'ERR_NETWORK' || // Network error
       (error.response?.status && error.response.status >= 500); // Server errors

     if (shouldRetry) {
       config._retryCount++;

       // Calcular delay com exponential backoff
       const delay = retryDelay * Math.pow(2, config._retryCount - 1);

       console.log(`🔄 Retry ${config._retryCount}/${maxRetries} após ${delay}ms`);

       // Aguardar antes de tentar novamente
       await new Promise(resolve => setTimeout(resolve, delay));

       // Tentar novamente
       return client(config);
     }

     return Promise.reject(error);
   }
 );
};

/**
* Cria interceptor de timeout progressivo
*/
export const createProgressiveTimeoutInterceptor = (client: AxiosInstance): void => {
 const timeouts = new Map<string, number>();
 const BASE_TIMEOUT = 10000; // 10 segundos
 const MAX_TIMEOUT = 60000;  // 60 segundos

 client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
   if (!config.url) return config;

   // Obter timeout atual para este endpoint
   const currentTimeout = timeouts.get(config.url) || BASE_TIMEOUT;
   config.timeout = currentTimeout;

   return config;
 });

 client.interceptors.response.use(
   (response: AxiosResponse) => {
     // Reset timeout em caso de sucesso
     if (response.config.url) {
       timeouts.set(response.config.url, BASE_TIMEOUT);
     }
     return response;
   },
   (error: AxiosError) => {
     // Aumentar timeout em caso de timeout error
     if (error.code === 'ECONNABORTED' && error.config?.url) {
       const currentTimeout = timeouts.get(error.config.url) || BASE_TIMEOUT;
       const newTimeout = Math.min(currentTimeout * 1.5, MAX_TIMEOUT);
       timeouts.set(error.config.url, newTimeout);
       
       console.log(`⏱️ Timeout aumentado para ${newTimeout}ms em ${error.config.url}`);
     }

     return Promise.reject(error);
   }
 );
};

/**
* Cria interceptor de rate limiting (client-side)
*/
export const createRateLimitInterceptor = (
 client: AxiosInstance,
 maxRequestsPerSecond: number = 10
): void => {
 const queue: Array<() => void> = [];
 let processing = false;
 let requestsInLastSecond = 0;
 let lastResetTime = Date.now();

 const processQueue = () => {
   if (processing || queue.length === 0) return;

   processing = true;

   const now = Date.now();
   if (now - lastResetTime >= 1000) {
     requestsInLastSecond = 0;
     lastResetTime = now;
   }

   if (requestsInLastSecond < maxRequestsPerSecond) {
     const next = queue.shift();
     if (next) {
       requestsInLastSecond++;
       next();
     }
   }

   processing = false;

   // Processar próximo item
   if (queue.length > 0) {
     setTimeout(processQueue, 100);
   }
 };

 client.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
     return new Promise((resolve) => {
       queue.push(() => resolve(config));
       processQueue();
     });
   }
 );
};