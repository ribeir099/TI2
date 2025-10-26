/**
* Tipos relacionados à API
*/

/**
* Resposta padrão de sucesso da API
*/
export interface ApiSuccessResponse<T = any> {
    data: T;
    message?: string;
    timestamp?: string;
}

/**
* Resposta padrão de erro da API
*/
export interface ApiErrorResponse {
    error: string;
    message?: string;
    statusCode: number;
    timestamp?: string;
    details?: any;
}

/**
* Resposta paginada
*/
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

/**
* Parâmetros de paginação
*/
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}

/**
* Parâmetros de ordenação
*/
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
* Parâmetros de busca
*/
export interface SearchParams {
    q?: string;
    query?: string;
    search?: string;
}

/**
* Parâmetros de filtro genérico
*/
export interface FilterParams {
    [key: string]: any;
}

/**
* Parâmetros de requisição completos
*/
export interface RequestParams extends PaginationParams, SortParams, SearchParams, FilterParams { }

/**
* Metadados de requisição
*/
export interface RequestMetadata {
    requestId?: string;
    userId?: string;
    timestamp: number;
    userAgent?: string;
}

/**
* Status da API
*/
export interface ApiHealthStatus {
    status: 'online' | 'offline' | 'degraded';
    version?: string;
    timestamp: string;
    services?: {
        database: boolean;
        cache: boolean;
        external: boolean;
    };
}

/**
* Configuração de requisição estendida
*/
export interface ExtendedRequestConfig extends RequestMetadata {
    cache?: boolean;
    cacheTTL?: number;
    retry?: boolean;
    maxRetries?: number;
    silent?: boolean; // Não mostrar erros ao usuário
}