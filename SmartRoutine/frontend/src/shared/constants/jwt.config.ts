/**
* Configuração de JWT
*/

/**
* Tipos de token
*/
export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    TEMPORARY = 'temporary',
    API = 'api'
}

/**
* Configuração JWT
*/
export const JWT_CONFIG = {
    // Secret key - EM PRODUÇÃO DEVE VIR DE VARIÁVEL DE AMBIENTE
    SECRET: import.meta.env.VITE_JWT_SECRET || 'smartroutine-secret-key-change-in-production-min-32-chars',

    // Tempo de expiração do access token
    ACCESS_TOKEN_EXPIRATION: '24h',

    // Tempo de expiração do refresh token
    REFRESH_TOKEN_EXPIRATION: '7d',

    // Tempo de expiração de token temporário
    TEMPORARY_TOKEN_EXPIRATION: '1h',

    // Issuer (emissor do token)
    ISSUER: 'smartroutine-api',

    // Audience (público alvo)
    AUDIENCE: 'smartroutine-frontend',

    // Algoritmo de assinatura
    ALGORITHM: 'HS256' as const,

    // Header name
    HEADER_NAME: 'Authorization',

    // Header prefix
    HEADER_PREFIX: 'Bearer',

    // Storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'smartroutine_access_token',
        REFRESH_TOKEN: 'smartroutine_refresh_token',
        TOKEN_EXPIRY: 'smartroutine_token_expiry'
    },

    // Refresh antes de expirar (em minutos)
    REFRESH_BEFORE_EXPIRY_MINUTES: 5,

    // Validação
    VALIDATE_ISSUER: true,
    VALIDATE_AUDIENCE: true,
    VALIDATE_EXPIRATION: true
} as const;

/**
* Claims do JWT
*/
export const JWT_CLAIMS = {
    SUBJECT: 'sub',           // User ID
    ISSUED_AT: 'iat',         // Timestamp de emissão
    EXPIRATION: 'exp',        // Timestamp de expiração
    ISSUER: 'iss',            // Emissor
    AUDIENCE: 'aud',          // Audiência
    NOT_BEFORE: 'nbf',        // Não usar antes de
    JWT_ID: 'jti',            // ID único do token

    // Custom claims
    EMAIL: 'email',
    NAME: 'nome',
    TYPE: 'type',
    ROLE: 'role',
    PERMISSIONS: 'permissions'
} as const;