// src/shared/constants/config.ts

/**
* Configurações Gerais da Aplicação
*/

/**
* URL base da API
*/
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6789';

/**
* Nome da aplicação
*/
export const APP_NAME = 'SmartRoutine';

/**
* Versão da aplicação
*/
export const APP_VERSION = '1.0.0';

/**
* Ambiente
*/
export const ENVIRONMENT = import.meta.env.VITE_ENV || import.meta.env.MODE || 'development';

/**
* Modo de desenvolvimento
*/
export const IS_DEV = ENVIRONMENT === 'development';

/**
* Modo de produção
*/
export const IS_PROD = ENVIRONMENT === 'production';

/**
* URL base da aplicação
*/
export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

/**
* Configuração geral da aplicação
*/
export const APP_CONFIG = {
    name: APP_NAME,
    version: APP_VERSION,
    environment: ENVIRONMENT,
    apiUrl: API_BASE_URL,
    appUrl: APP_URL,

    // Configurações de comportamento
    expirationWarningDays: 3,
    itemsPerPage: 10,
    maxItemsPerPage: 100,
    defaultPageSize: 20,

    // Cache
    cacheExpirationMinutes: 5,

    // Notificações
    notificationDuration: 5000, // 5 segundos

    // Upload
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

    // Sessão
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    sessionWarningTime: 5 * 60 * 1000, // 5 minutos antes de expirar

    // Retry
    maxRetryAttempts: 3,
    retryDelay: 1000, // 1 segundo

    // Timeouts
    apiTimeout: 30000, // 30 segundos
    uploadTimeout: 60000, // 60 segundos

    // Debounce
    searchDebounce: 300, // 300ms
    inputDebounce: 500, // 500ms

    // Features flags
    features: {
        enableAI: !!import.meta.env.VITE_IA_API_KEY,
        enableNotifications: true,
        enableAnalytics: IS_PROD,
        enableExport: true,
        enableImport: true,
        enableOfflineMode: false,
        enableBetaFeatures: IS_DEV
    }
} as const;

/**
* URLs de recursos externos
*/
export const EXTERNAL_URLS = {
    documentation: 'https://docs.smartroutine.com',
    support: 'https://support.smartroutine.com',
    privacyPolicy: 'https://smartroutine.com/privacy',
    termsOfService: 'https://smartroutine.com/terms',
    github: 'https://github.com/smartroutine',
    twitter: 'https://twitter.com/smartroutine',
    instagram: 'https://instagram.com/smartroutine'
} as const;

/**
* Contatos
*/
export const CONTACT = {
    email: 'contato@smartroutine.com',
    supportEmail: 'suporte@smartroutine.com',
    phone: '+55 11 1234-5678'
} as const;

/**
* Meta tags padrão
*/
export const META_DEFAULTS = {
    title: 'SmartRoutine - Gerencie sua Despensa e Receitas',
    description: 'Organize sua despensa, controle validades e descubra receitas incríveis baseadas nos ingredientes que você tem em casa.',
    keywords: 'despensa, receitas, alimentos, validade, cozinha, organização',
    author: 'SmartRoutine Team',
    ogImage: `${APP_URL}/og-image.jpg`,
    twitterCard: 'summary_large_image'
} as const;