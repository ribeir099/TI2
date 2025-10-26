import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig
} from 'axios';
import { API_BASE_URL } from '@/shared/constants/config';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de configuração do cliente
*/
export interface ApiClientConfig {
    baseURL?: string;
    timeout?: number;
    enableLogging?: boolean;
    retryAttempts?: number;
    retryDelay?: number;
}

/**
* Cliente HTTP para comunicação com a API
* 
* Responsabilidades:
* - Gerenciar requisições HTTP
* - Adicionar headers padrão
* - Tratamento de erros
* - Logging (modo desenvolvimento)
* - Retry logic
*/
export class ApiClient {
    private client: AxiosInstance;
    private enableLogging: boolean;
    private retryAttempts: number;
    private retryDelay: number;

    constructor(config: ApiClientConfig = {}) {
        const {
            baseURL = API_BASE_URL,
            timeout = 30000,
            enableLogging = import.meta.env.DEV,
            retryAttempts = 3,
            retryDelay = 1000
        } = config;

        this.enableLogging = enableLogging;
        this.retryAttempts = retryAttempts;
        this.retryDelay = retryDelay;

        // Criar instância do Axios
        this.client = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Configurar interceptors básicos
        this.setupBasicInterceptors();
    }

    /**
     * Obtém instância do Axios para configurações avançadas
     */
    getClient(): AxiosInstance {
        return this.client;
    }

    /**
     * GET request
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * POST request
     */
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * PUT request
     */
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * PATCH request
     */
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * DELETE request
     */
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Request com retry automático
     */
    async requestWithRetry<T = any>(
        config: AxiosRequestConfig,
        attempts: number = this.retryAttempts
    ): Promise<T> {
        let lastError: any;

        for (let i = 0; i < attempts; i++) {
            try {
                const response: AxiosResponse<T> = await this.client.request(config);
                return response.data;
            } catch (error) {
                lastError = error;

                // Não fazer retry para erros 4xx (exceto 408 e 429)
                if (axios.isAxiosError(error) && error.response) {
                    const status = error.response.status;
                    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
                        throw this.handleError(error);
                    }
                }

                // Se não é a última tentativa, aguardar antes de tentar novamente
                if (i < attempts - 1) {
                    await this.delay(this.retryDelay * (i + 1)); // Exponential backoff

                    if (this.enableLogging) {
                        console.log(`Tentativa ${i + 2} de ${attempts}...`);
                    }
                }
            }
        }

        throw this.handleError(lastError);
    }

    /**
     * Upload de arquivo (multipart/form-data)
     */
    async upload<T = any>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                }
            };

            const response: AxiosResponse<T> = await this.client.post(url, formData, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Download de arquivo
     */
    async download(url: string, filename?: string): Promise<Blob> {
        try {
            const response: AxiosResponse<Blob> = await this.client.get(url, {
                responseType: 'blob'
            });

            // Se filename fornecido, iniciar download automaticamente
            if (filename) {
                this.triggerDownload(response.data, filename);
            }

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Health check da API
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Cancela todas as requisições pendentes
     */
    cancelAllRequests(message: string = 'Requisições canceladas'): void {
        // TODO: Implementar com AbortController se necessário
        console.log(message);
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Configura interceptors básicos
     */
    private setupBasicInterceptors(): void {
        // Request interceptor - Logging
        if (this.enableLogging) {
            this.client.interceptors.request.use(
                (config: InternalAxiosRequestConfig) => {
                    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
                        headers: config.headers,
                        data: config.data
                    });
                    return config;
                },
                (error: AxiosError) => {
                    console.error('❌ Request Error:', error);
                    return Promise.reject(error);
                }
            );
        }

        // Response interceptor - Logging
        if (this.enableLogging) {
            this.client.interceptors.response.use(
                (response: AxiosResponse) => {
                    console.log(`📥 ${response.status} ${response.config.url}`, {
                        data: response.data
                    });
                    return response;
                },
                (error: AxiosError) => {
                    if (error.response) {
                        console.error(`❌ ${error.response.status} ${error.config?.url}`, {
                            error: error.response.data
                        });
                    } else if (error.request) {
                        console.error('❌ No response:', error.message);
                    } else {
                        console.error('❌ Request setup error:', error.message);
                    }
                    return Promise.reject(error);
                }
            );
        }
    }

    /**
     * Trata erros HTTP
     */
    private handleError(error: unknown): AppError {
        if (axios.isAxiosError(error)) {
            // Erro de resposta (4xx, 5xx)
            if (error.response) {
                const { status, data } = error.response;
                const message = data?.error || data?.message || this.getDefaultErrorMessage(status);

                return new AppError(message, status);
            }

            // Erro de requisição (sem resposta)
            if (error.request) {
                if (error.code === 'ECONNABORTED') {
                    return AppError.internal('Tempo de requisição esgotado. Tente novamente.');
                }

                if (error.code === 'ERR_NETWORK') {
                    return AppError.internal('Erro de conexão. Verifique sua internet.');
                }

                return AppError.internal('Erro de conexão com o servidor');
            }

            // Erro na configuração da requisição
            return AppError.internal('Erro ao configurar requisição');
        }

        // Erro desconhecido
        if (error instanceof Error) {
            return AppError.internal(error.message);
        }

        return AppError.internal('Erro desconhecido');
    }

    /**
     * Retorna mensagem de erro padrão por status
     */
    private getDefaultErrorMessage(status: number): string {
        const messages: Record<number, string> = {
            400: 'Requisição inválida. Verifique os dados enviados.',
            401: 'Não autenticado. Faça login novamente.',
            403: 'Sem permissão para acessar este recurso.',
            404: 'Recurso não encontrado.',
            409: 'Conflito. O recurso já existe.',
            422: 'Dados inválidos. Verifique os campos.',
            429: 'Muitas requisições. Aguarde um momento.',
            500: 'Erro interno do servidor.',
            502: 'Servidor indisponível temporariamente.',
            503: 'Serviço em manutenção.',
            504: 'Tempo de resposta do servidor esgotado.'
        };

        return messages[status] || `Erro ${status}`;
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Trigger download do arquivo
     */
    private triggerDownload(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

// Singleton instance
export const apiClient = new ApiClient();