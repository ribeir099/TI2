/**
* Cores da Aplicação
*/

/**
* Cores principais do tema
*/
export const THEME_COLORS = {
    // Primary
    PRIMARY: {
        DEFAULT: 'rgb(16, 185, 129)',     // #10b981
        LIGHT: 'rgb(52, 211, 153)',       // #34d399
        DARK: 'rgb(5, 150, 105)',         // #059669
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Secondary
    SECONDARY: {
        DEFAULT: 'rgb(99, 102, 241)',     // #6366f1
        LIGHT: 'rgb(129, 140, 248)',      // #818cf8
        DARK: 'rgb(79, 70, 229)',         // #4f46e5
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Accent
    ACCENT: {
        DEFAULT: 'rgb(245, 158, 11)',     // #f59e0b
        LIGHT: 'rgb(251, 191, 36)',       // #fbbf24
        DARK: 'rgb(217, 119, 6)',         // #d97706
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Destructive
    DESTRUCTIVE: {
        DEFAULT: 'rgb(239, 68, 68)',      // #ef4444
        LIGHT: 'rgb(248, 113, 113)',      // #f87171
        DARK: 'rgb(220, 38, 38)',         // #dc2626
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Success
    SUCCESS: {
        DEFAULT: 'rgb(34, 197, 94)',      // #22c55e
        LIGHT: 'rgb(74, 222, 128)',       // #4ade80
        DARK: 'rgb(21, 128, 61)',         // #15803d
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Warning
    WARNING: {
        DEFAULT: 'rgb(251, 146, 60)',     // #fb923c
        LIGHT: 'rgb(253, 186, 116)',      // #fdba74
        DARK: 'rgb(234, 88, 12)',         // #ea580c
        FOREGROUND: 'rgb(255, 255, 255)'
    },

    // Info
    INFO: {
        DEFAULT: 'rgb(59, 130, 246)',     // #3b82f6
        LIGHT: 'rgb(96, 165, 250)',       // #60a5fa
        DARK: 'rgb(37, 99, 235)',         // #2563eb
        FOREGROUND: 'rgb(255, 255, 255)'
    }
} as const;

/**
* Cores neutras
*/
export const NEUTRAL_COLORS = {
    BLACK: 'rgb(0, 0, 0)',
    WHITE: 'rgb(255, 255, 255)',
    TRANSPARENT: 'transparent',

    GRAY_50: 'rgb(249, 250, 251)',
    GRAY_100: 'rgb(243, 244, 246)',
    GRAY_200: 'rgb(229, 231, 235)',
    GRAY_300: 'rgb(209, 213, 219)',
    GRAY_400: 'rgb(156, 163, 175)',
    GRAY_500: 'rgb(107, 114, 128)',
    GRAY_600: 'rgb(75, 85, 99)',
    GRAY_700: 'rgb(55, 65, 81)',
    GRAY_800: 'rgb(31, 41, 55)',
    GRAY_900: 'rgb(17, 24, 39)'
} as const;

/**
* Cores de status de validade
*/
export const EXPIRATION_COLORS = {
    FRESH: THEME_COLORS.SUCCESS.DEFAULT,
    EXPIRING: THEME_COLORS.WARNING.DEFAULT,
    EXPIRED: THEME_COLORS.DESTRUCTIVE.DEFAULT
} as const;

/**
* Cores de categorias
*/
export const CATEGORY_COLORS = {
    'Laticínios': '#3b82f6',
    'Carnes': '#ef4444',
    'Vegetais': '#10b981',
    'Frutas': '#f59e0b',
    'Padaria': '#d97706',
    'Grãos': '#92400e',
    'Condimentos': '#6366f1',
    'Temperos': '#22c55e',
    'Bebidas': '#06b6d4',
    'Proteínas': '#f97316',
    'Massas': '#eab308',
    'Outros': '#6b7280'
} as const;

/**
* Cores de dificuldade
*/
export const DIFFICULTY_COLORS = {
    'Muito Fácil': '#22c55e',
    'Fácil': '#84cc16',
    'Média': '#f59e0b',
    'Difícil': '#f97316',
    'Muito Difícil': '#ef4444'
} as const;

/**
* Cores de gráficos
*/
export const CHART_COLORS = [
    '#10b981', // primary
    '#6366f1', // secondary
    '#f59e0b', // accent
    '#ef4444', // destructive
    '#22c55e', // success
    '#fb923c', // warning
    '#3b82f6', // info
    '#06b6d4', // cyan
    '#8b5cf6', // purple
    '#ec4899'  // pink
] as const;

/**
* Gradientes
*/
export const GRADIENTS = {
    PRIMARY: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    SECONDARY: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    ACCENT: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    SUNSET: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    OCEAN: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    FOREST: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
    PURPLE: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
} as const;

/**
* Opacidades
*/
export const OPACITIES = {
    TRANSPARENT: 0,
    FAINT: 0.1,
    LIGHT: 0.2,
    MEDIUM: 0.5,
    DARK: 0.8,
    OPAQUE: 1
} as const;

/**
* Sombras
*/
export const SHADOWS = {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    INNER: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
} as const;