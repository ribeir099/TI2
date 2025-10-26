/**
* Tipos relacionados a Erros
*/

/**
* Código de erro da aplicação
*/
export enum ErrorCode {
    // Auth
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    UNAUTHORIZED = 'UNAUTHORIZED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',

    // Validation
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',

    // Resources
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',

    // Permissions
    FORBIDDEN = 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

    // Rate limiting
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

    // Server
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

    // Network
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT = 'TIMEOUT',

    // Business logic
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
    OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED'
}

/**
* Severidade do erro
*/
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
* Informações do erro
*/
export interface ErrorInfo {
    code: ErrorCode;
    message: string;
    severity: ErrorSeverity;
    statusCode?: number;
    timestamp: string;
    path?: string;
    method?: string;
    details?: any;
    stack?: string;
}

/**
* Erro de validação de campo
*/
export interface FieldError {
    field: string;
    message: string;
    value?: any;
}

/**
* Contexto do erro
*/
export interface ErrorContext {
    userId?: string;
    action?: string;
    resource?: string;
    additionalInfo?: Record<string, any>;
}

/**
* Log de erro
*/
export interface ErrorLog extends ErrorInfo {
    context?: ErrorContext;
    userAgent?: string;
    url?: string;
}

/**
* Recuperação de erro
*/
export interface ErrorRecovery {
    canRecover: boolean;
    recoveryAction?: () => void | Promise<void>;
    recoveryMessage?: string;
}

/**
* Boundary error (React Error Boundary)
*/
export interface BoundaryError {
    error: Error;
    errorInfo: React.ErrorInfo;
    resetError: () => void;
}