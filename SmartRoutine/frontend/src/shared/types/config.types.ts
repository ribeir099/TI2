/**
* Tipos relacionados a Configuração
*/

import { Theme, Language } from "./general.types";
import { HttpHeaders } from "./api.types";

/**
* Configuração da aplicação
*/
export interface AppConfig {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    apiUrl: string;
    apiTimeout: number;
    features: FeatureFlags;
    limits: AppLimits;
    defaults: AppDefaults;
}

/**
* Feature flags
*/
export interface FeatureFlags {
    enableAI: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableExport: boolean;
    enableImport: boolean;
    enableOfflineMode: boolean;
    enableBetaFeatures: boolean;
}

/**
* Limites da aplicação
*/
export interface AppLimits {
    maxFileSize: number;
    maxFilesPerUpload: number;
    maxItemsPerPage: number;
    maxSearchResults: number;
    maxFavorites: number;
    maxFoodItems: number;
    maxRecipes: number;
}

/**
* Valores padrão
*/
export interface AppDefaults {
    theme: Theme;
    language: Language;
    itemsPerPage: number;
    expirationWarningDays: number;
    cacheExpirationMinutes: number;
    notificationDuration: number;
}

/**
* Configuração de API
*/
export interface ApiConfig {
    baseURL: string;
    timeout: number;
    retries: number;
    retryDelay: number;
    headers: HttpHeaders;
}

/**
* Configuração de autenticação
*/
export interface AuthConfig {
    tokenKey: string;
    refreshTokenKey: string;
    tokenExpiration: string;
    refreshTokenExpiration: string;
    autoRefresh: boolean;
}

/**
* Configuração de cache
*/
export interface CacheConfig {
    enabled: boolean;
    defaultTTL: number;
    maxSize: number;
    storageType: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
* Configuração de logging
*/
export interface LoggingConfig {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    logToConsole: boolean;
    logToServer: boolean;
    serverEndpoint?: string;
}