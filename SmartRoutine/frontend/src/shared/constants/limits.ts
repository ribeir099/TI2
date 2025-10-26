/**
* Limites da Aplicação
*/

/**
* Limites de usuário
*/
export const USER_LIMITS = {
    MAX_NAME_LENGTH: 100,
    MIN_NAME_LENGTH: 3,
    MIN_AGE: 13,
    MAX_AGE: 120,
    MAX_SESSIONS: 5
} as const;

/**
* Limites de despensa
*/
export const PANTRY_LIMITS = {
    MAX_ITEMS_PER_USER: 1000,
    MAX_ITEMS_PER_CATEGORY: 200,
    MAX_CATEGORIES: 20,
    MIN_QUANTITY: 0.01,
    MAX_QUANTITY: 999999
} as const;

/**
* Limites de receitas
*/
export const RECIPE_LIMITS = {
    MAX_RECIPES_PER_USER: 500,
    MAX_FAVORITES_PER_USER: 100,
    MAX_INGREDIENTS: 50,
    MIN_INGREDIENTS: 1,
    MAX_INSTRUCTIONS: 50,
    MIN_INSTRUCTIONS: 1,
    MAX_TAGS: 20,
    MAX_TITLE_LENGTH: 200,
    MIN_TITLE_LENGTH: 3,
    MAX_PREP_TIME: 1440, // 24 horas em minutos
    MIN_PREP_TIME: 1
} as const;

/**
* Limites de busca
*/
export const SEARCH_LIMITS = {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    MAX_RESULTS: 100,
    MAX_SUGGESTIONS: 10
} as const;

/**
* Limites de upload
*/
export const UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES_PER_UPLOAD: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/json']
} as const;

/**
* Limites de operações em lote
*/
export const BATCH_LIMITS = {
    MAX_ITEMS_PER_BATCH: 100,
    MAX_CONCURRENT_REQUESTS: 5,
    BATCH_SIZE: 10
} as const;

/**
* Limites de texto
*/
export const TEXT_LIMITS = {
    SHORT_TEXT: 100,
    MEDIUM_TEXT: 500,
    LONG_TEXT: 2000,
    TITLE: 200,
    DESCRIPTION: 1000,
    COMMENT: 500
} as const;

/**
* Limites de API
*/
export const API_LIMITS = {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
    REQUESTS_PER_DAY: 10000,
    MAX_PAYLOAD_SIZE: 1 * 1024 * 1024 // 1MB
} as const;

/**
* Limites de storage
*/
export const STORAGE_LIMITS = {
    LOCAL_STORAGE_QUOTA: 5 * 1024 * 1024, // 5MB
    SESSION_STORAGE_QUOTA: 5 * 1024 * 1024, // 5MB
    CACHE_MAX_ENTRIES: 100,
    MAX_LOGS: 50
} as const;

/**
* Limites de notificações
*/
export const NOTIFICATION_LIMITS = {
    MAX_VISIBLE: 3,
    MAX_STORED: 50,
    MIN_DURATION: 1000, // 1 segundo
    MAX_DURATION: 10000 // 10 segundos
} as const;