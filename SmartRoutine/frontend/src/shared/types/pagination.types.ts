/**
* Tipos relacionados à Paginação
*/

/**
* Parâmetros de paginação
*/
export interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
}

/**
* Informações de paginação
*/
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

/**
* Resposta paginada
*/
export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
}

/**
* Opções de paginação
*/
export interface PaginationOptions {
    page?: number;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
* Resultado de paginação
*/
export interface PaginationResult<T> extends PaginationInfo {
    data: T[];
}

/**
* Handlers de paginação
*/
export interface PaginationHandlers {
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    setLimit: (limit: number) => void;
}

/**
* Hook de paginação result
*/
export interface UsePaginationResult extends PaginationInfo, PaginationHandlers {
    isFirstPage: boolean;
    isLastPage: boolean;
}

/**
* Cursor pagination (para APIs que usam cursor)
*/
export interface CursorPagination {
    cursor: string | null;
    hasMore: boolean;
    limit: number;
}

/**
* Resposta com cursor
*/
export interface CursorPaginatedResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}