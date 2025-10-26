/**
* Constantes de Storage
*/

/**
* Prefixos de chaves de storage
*/
export const STORAGE_PREFIXES = {
    MAIN: 'smartroutine_',
    CACHE: 'smartroutine_cache_',
    SESSION: 'smartroutine_session_',
    SECURE: 'smartroutine_secure_',
    TEMP: 'smartroutine_temp_'
} as const;

/**
* Chaves de storage
*/
export const STORAGE_KEYS = {
    // Auth
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    TOKEN_EXPIRY: 'token_expiry',
    REMEMBER_ME: 'remember_me',

    // Preferences
    THEME: 'theme',
    LANGUAGE: 'language',
    DENSITY: 'density',
    PREFERENCES: 'preferences',

    // Cache
    RECIPES_CACHE: 'recipes',
    FOOD_ITEMS_CACHE: 'food_items',
    CATEGORIES_CACHE: 'categories',

    // UI State
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
    LAST_VISITED_PAGE: 'last_visited_page',

    // Filters
    FOOD_FILTERS: 'food_filters',
    RECIPE_FILTERS: 'recipe_filters',

    // Offline
    OFFLINE_QUEUE: 'offline_queue',
    OFFLINE_DATA: 'offline_data',

    // Logs
    ERROR_LOGS: 'error_logs',
    ANALYTICS_QUEUE: 'analytics_queue',

    // Onboarding
    ONBOARDING_COMPLETED: 'onboarding_completed',
    TOUR_COMPLETED: 'tour_completed',

    // Beta
    BETA_FEATURES_ENABLED: 'beta_features_enabled'
} as const;

/**
* TTL (Time To Live) por tipo de dado
*/
export const STORAGE_TTL = {
    // Cache
    RECIPES: 5 * 60 * 1000,           // 5 minutos
    FOOD_ITEMS: 2 * 60 * 1000,        // 2 minutos
    CATEGORIES: 60 * 60 * 1000,       // 1 hora
    STATISTICS: 10 * 60 * 1000,       // 10 minutos

    // Session
    SESSION_DATA: 24 * 60 * 60 * 1000, // 24 horas
    TEMP_DATA: 60 * 60 * 1000,         // 1 hora

    // Preferences (sem expiração, mas limpeza periódica)
    PREFERENCES: Infinity,

    // Logs
    ERROR_LOGS: 7 * 24 * 60 * 60 * 1000, // 7 dias
    ANALYTICS: 24 * 60 * 60 * 1000       // 24 horas
} as const;

/**
* Quota de storage (estimado)
*/
export const STORAGE_QUOTA = {
    LOCAL_STORAGE: 5 * 1024 * 1024,    // 5MB
    SESSION_STORAGE: 5 * 1024 * 1024,  // 5MB
    INDEXED_DB: 50 * 1024 * 1024,      // 50MB

    // Alertas
    WARNING_THRESHOLD: 0.8,  // 80%
    CRITICAL_THRESHOLD: 0.95 // 95%
} as const;