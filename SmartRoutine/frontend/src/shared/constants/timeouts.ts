/**
* Timeouts e Delays da Aplicação
*/

/**
* Timeouts de requisições
*/
export const REQUEST_TIMEOUTS = {
    DEFAULT: 30000,        // 30 segundos
    SHORT: 10000,          // 10 segundos
    LONG: 60000,           // 60 segundos
    UPLOAD: 120000,        // 2 minutos
    DOWNLOAD: 120000,      // 2 minutos
    IA_GENERATION: 45000   // 45 segundos
} as const;

/**
* Debounce delays
*/
export const DEBOUNCE_DELAYS = {
    SEARCH: 300,           // 300ms
    INPUT: 500,            // 500ms
    RESIZE: 200,           // 200ms
    SCROLL: 100,           // 100ms
    SAVE: 1000             // 1 segundo
} as const;

/**
* Throttle delays
*/
export const THROTTLE_DELAYS = {
    SCROLL: 100,           // 100ms
    RESIZE: 200,           // 200ms
    MOUSE_MOVE: 50,        // 50ms
    API_CALL: 1000         // 1 segundo
} as const;

/**
* Delays de animação
*/
export const ANIMATION_DELAYS = {
    SHORT: 150,            // 150ms
    MEDIUM: 300,           // 300ms
    LONG: 500,             // 500ms
    EXTRA_LONG: 1000       // 1 segundo
} as const;

/**
* Durações de transição (CSS)
*/
export const TRANSITION_DURATIONS = {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
} as const;

/**
* Intervalos de atualização
*/
export const UPDATE_INTERVALS = {
    REAL_TIME: 1000,       // 1 segundo
    FREQUENT: 5000,        // 5 segundos
    NORMAL: 30000,         // 30 segundos
    INFREQUENT: 60000,     // 1 minuto
    RARE: 300000           // 5 minutos
} as const;

/**
* Timeouts de sessão
*/
export const SESSION_TIMEOUTS = {
    IDLE_TIMEOUT: 30 * 60 * 1000,        // 30 minutos
    WARNING_BEFORE_TIMEOUT: 5 * 60 * 1000, // 5 minutos antes
    TOKEN_REFRESH_BEFORE: 5 * 60 * 1000    // 5 minutos antes
} as const;

/**
* Delays de retry
*/
export const RETRY_DELAYS = {
    FIRST: 1000,           // 1 segundo
    SECOND: 2000,          // 2 segundos
    THIRD: 4000,           // 4 segundos
    FOURTH: 8000           // 8 segundos (exponential backoff)
} as const;

/**
* Durações de toast/notification
*/
export const NOTIFICATION_DURATIONS = {
    SHORT: 3000,           // 3 segundos
    NORMAL: 5000,          // 5 segundos
    LONG: 10000,           // 10 segundos
    PERSISTENT: 0          // Não fecha automaticamente
} as const;

/**
* Delays de manutenção
*/
export const MAINTENANCE_INTERVALS = {
    CACHE_CLEANUP: 10 * 60 * 1000,       // 10 minutos
    LOG_CLEANUP: 60 * 60 * 1000,         // 1 hora
    STORAGE_CLEANUP: 24 * 60 * 60 * 1000 // 24 horas
} as const;