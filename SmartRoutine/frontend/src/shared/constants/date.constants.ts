/**
* Constantes de Data
*/

/**
* Formatos de data
*/
export const DATE_FORMATS = {
    ISO: 'YYYY-MM-DD',
    ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
    BRAZILIAN: 'DD/MM/YYYY',
    BRAZILIAN_DATETIME: 'DD/MM/YYYY HH:mm',
    AMERICAN: 'MM/DD/YYYY',
    EUROPEAN: 'DD.MM.YYYY',
    LONG: 'D [de] MMMM [de] YYYY',
    SHORT: 'DD/MM/YY',
    TIME_24H: 'HH:mm',
    TIME_12H: 'hh:mm A'
} as const;

/**
* Nomes dos dias da semana
*/
export const DAY_NAMES = {
    FULL: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    SHORT: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    MIN: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
} as const;

/**
* Nomes dos meses
*/
export const MONTH_NAMES = {
    FULL: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    SHORT: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
} as const;

/**
* Constantes de tempo
*/
export const TIME_CONSTANTS = {
    MILLISECONDS_PER_SECOND: 1000,
    SECONDS_PER_MINUTE: 60,
    MINUTES_PER_HOUR: 60,
    HOURS_PER_DAY: 24,
    DAYS_PER_WEEK: 7,
    DAYS_PER_MONTH: 30, // Aproximado
    DAYS_PER_YEAR: 365,
    MONTHS_PER_YEAR: 12
} as const;

/**
* Durações comuns em milissegundos
*/
export const DURATIONS = {
    ONE_SECOND: 1000,
    ONE_MINUTE: 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
    TEN_MINUTES: 10 * 60 * 1000,
    THIRTY_MINUTES: 30 * 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
    ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000
} as const;

/**
* Ranges de data comuns
*/
export const DATE_RANGES = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    THIS_WEEK: 'this_week',
    THIS_MONTH: 'this_month',
    THIS_YEAR: 'this_year',
    CUSTOM: 'custom'
} as const;

/**
* Timezone
*/
export const TIMEZONE = {
    DEFAULT: 'America/Sao_Paulo',
    UTC: 'UTC'
} as const;