/**
* Tipos relacionados à API
*/

/**
* Status da requisição
*/
export type RequestStatus = 'idle' | 'pending' | 'success' | 'error';

/**
* Métodos HTTP
*/
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
* Headers HTTP
*/
export type HttpHeaders = Record<string, string>;

/**
* Status codes HTTP comuns
*/
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

/**
* Resposta de sucesso genérica
*/
export interface ApiSuccessResponse<T = any> {
    data: T;
    message?: string;
    timestamp?: string;
    meta?: ApiResponseMeta;
}

/**
* Resposta de erro genérica
*/
export interface ApiErrorResponse {
    error: string;
    message?: string;
    statusCode: number;
    timestamp?: string;
    details?: any;
    path?: string;
}

/**
* Metadados de resposta
*/
export interface ApiResponseMeta {
    requestId?: string;
    version?: string;
    serverTime?: string;
}

/**
* Configuração de requisição
*/
export interface ApiRequestConfig {
    timeout?: number;
    retries?: number;
    cache?: boolean;
    cacheTTL?: number;
    headers?: HttpHeaders;
    params?: Record<string, any>;
}

/**
* Estado de requisição
*/
export interface RequestState<T = any> {
    data: T | null;
    error: Error | null;
    status: RequestStatus;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

/**
* Hook de requisição
*/
export interface UseRequestResult<T = any> extends RequestState<T> {
    refetch: () => Promise<void>;
    reset: () => void;
}

/**
* Opções de retry
*/
export interface RetryOptions {
    maxAttempts: number;
    delayMs: number;
    backoff?: 'linear' | 'exponential';
    retryOn?: HttpStatusCode[];
}

/**
* Timeout options
*/
export interface TimeoutOptions {
    request?: number;
    response?: number;
}