/**
* Constantes de API
*/

/**
* Versão da API
*/
export const API_VERSION = 'v1';

/**
* Headers padrão
*/
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': 'v1',
    'X-Client-Platform': 'web'
} as const;

/**
* Códigos de status HTTP (complemento)
*/
export const HTTP_STATUS = {
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // Redirect
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,

    // Client Error
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // Server Error
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
} as const;

/**
* Métodos HTTP permitidos
*/
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS'
} as const;

/**
* Content types
*/
export const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
    TEXT: 'text/plain',
    HTML: 'text/html',
    XML: 'application/xml',
    CSV: 'text/csv',
    PDF: 'application/pdf'
} as const;

/**
* Query params reservados
*/
export const RESERVED_QUERY_PARAMS = [
    'page',
    'limit',
    'offset',
    'sort',
    'order',
    'search',
    'q',
    'filter'
] as const;

/**
* Configuração de retry por tipo de erro
*/
export const RETRY_CONFIG = {
    NETWORK_ERROR: { maxAttempts: 3, delay: 1000 },
    TIMEOUT: { maxAttempts: 2, delay: 2000 },
    RATE_LIMIT: { maxAttempts: 1, delay: 5000 },
    SERVER_ERROR: { maxAttempts: 2, delay: 3000 },
    NO_RETRY: { maxAttempts: 0, delay: 0 }
} as const;