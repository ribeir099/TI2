/**
* Valores Padrão da Aplicação
*/

/**
* Valores padrão de alimentos
*/
export const FOOD_DEFAULTS = {
    QUANTITY: 1,
    UNIT: 'unidade' as const,
    CATEGORY: 'Outros' as const,
    EXPIRATION_WARNING_DAYS: 3,
    DEFAULT_SHELF_LIFE_DAYS: 7
} as const;

/**
* Valores padrão de receitas
*/
export const RECIPE_DEFAULTS = {
    PREP_TIME: 30,
    SERVINGS: '2-4 porções',
    DIFFICULTY: 'Média' as const,
    MEAL_TYPE: 'Almoço/Jantar' as const,
    IMAGE_PLACEHOLDER: 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752',
    MIN_INGREDIENTS: 1,
    MIN_INSTRUCTIONS: 1
} as const;

/**
* Valores padrão de paginação
*/
export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 5
} as const;

/**
* Valores padrão de ordenação
*/
export const SORT_DEFAULTS = {
    ORDER: 'asc' as const,
    FIELD: 'name' as const
} as const;

/**
* Valores padrão de filtros
*/
export const FILTER_DEFAULTS = {
    EXPIRATION_DAYS: 3,
    SEARCH_MIN_CHARS: 2,
    DEBOUNCE_MS: 300
} as const;

/**
* Valores padrão de notificações
*/
export const NOTIFICATION_DEFAULTS = {
    DURATION: 5000, // 5 segundos
    POSITION: 'top-right' as const,
    MAX_VISIBLE: 3
} as const;

/**
* Valores padrão de tema
*/
export const THEME_DEFAULTS = {
    MODE: 'auto' as const,
    LANGUAGE: 'pt-BR' as const,
    DENSITY: 'comfortable' as const,
    FONT_SIZE: 'medium' as const
} as const;

/**
* Valores padrão de cache
*/
export const CACHE_DEFAULTS = {
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_ENTRIES: 100,
    ENABLED: true
} as const;

/**
* Valores padrão de timeout
*/
export const TIMEOUT_DEFAULTS = {
    API_REQUEST: 30000, // 30 segundos
    UPLOAD: 60000, // 60 segundos
    DOWNLOAD: 60000, // 60 segundos
    IA_REQUEST: 45000 // 45 segundos
} as const;

/**
* Valores padrão de retry
*/
export const RETRY_DEFAULTS = {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF: 'exponential' as const
} as const;

/**
* Valores padrão de imagem
*/
export const IMAGE_DEFAULTS = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 0.8,
    FORMAT: 'jpeg' as const,
    THUMBNAIL_SIZE: 200
} as const;

/**
* Valores padrão de formulário
*/
export const FORM_DEFAULTS = {
    VALIDATE_ON_CHANGE: false,
    VALIDATE_ON_BLUR: true,
    VALIDATE_ON_SUBMIT: true
} as const;