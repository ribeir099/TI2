/**
* Feature Flags da Aplicação
*/

/**
* Features principais
*/
export const FEATURES = {
    // IA
    AI_RECIPE_GENERATION: import.meta.env.VITE_FEATURE_AI === 'true',
    AI_RECIPE_ANALYSIS: import.meta.env.VITE_FEATURE_AI_ANALYSIS === 'true',
    AI_SUGGESTIONS: import.meta.env.VITE_FEATURE_AI_SUGGESTIONS === 'true',

    // Notificações
    PUSH_NOTIFICATIONS: import.meta.env.VITE_FEATURE_PUSH === 'true',
    EMAIL_NOTIFICATIONS: import.meta.env.VITE_FEATURE_EMAIL === 'true',
    IN_APP_NOTIFICATIONS: true,

    // Export/Import
    EXPORT_PDF: true,
    EXPORT_CSV: true,
    EXPORT_JSON: true,
    IMPORT_CSV: import.meta.env.VITE_FEATURE_IMPORT === 'true',
    IMPORT_JSON: import.meta.env.VITE_FEATURE_IMPORT === 'true',

    // Social
    SOCIAL_SHARING: import.meta.env.VITE_FEATURE_SOCIAL === 'true',
    PUBLIC_PROFILES: import.meta.env.VITE_FEATURE_PUBLIC_PROFILES === 'true',

    // Analytics
    ANALYTICS: import.meta.env.PROD,
    ERROR_TRACKING: import.meta.env.PROD,
    PERFORMANCE_MONITORING: import.meta.env.PROD,

    // Experimental
    OFFLINE_MODE: import.meta.env.VITE_FEATURE_OFFLINE === 'true',
    VOICE_COMMANDS: import.meta.env.VITE_FEATURE_VOICE === 'true',
    BARCODE_SCANNER: import.meta.env.VITE_FEATURE_BARCODE === 'true',

    // Premium
    PREMIUM_RECIPES: false,
    MEAL_PLANNING: false,
    SHOPPING_LIST_OPTIMIZATION: false,

    // Beta
    BETA_UI: import.meta.env.VITE_BETA_UI === 'true',
    NEW_DASHBOARD: import.meta.env.VITE_NEW_DASHBOARD === 'true'
} as const;

/**
* Helper: Verifica se feature está habilitada
*/
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
    return FEATURES[feature];
};

/**
* Features em beta
*/
export const BETA_FEATURES = Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled && import.meta.env.DEV)
    .map(([feature]) => feature);

/**
* Features experimentais (podem ser instáveis)
*/
export const EXPERIMENTAL_FEATURES = [
    'OFFLINE_MODE',
    'VOICE_COMMANDS',
    'BARCODE_SCANNER'
] as const;