import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
* Níveis de log
*/
export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}

/**
* Configuração do logger
*/
export interface LoggerConfig {
    enabled: boolean;
    level: LogLevel;
    logRequests: boolean;
    logResponses: boolean;
    logErrors: boolean;
    logTiming: boolean;
}

/**
* Logger para requisições de API
*/
export class ApiLogger {
    private config: LoggerConfig;

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            enabled: import.meta.env.DEV,
            level: LogLevel.DEBUG,
            logRequests: true,
            logResponses: true,
            logErrors: true,
            logTiming: true,
            ...config
        };
    }

    /**
     * Log de requisição
     */
    logRequest(config: AxiosRequestConfig): void {
        if (!this.config.enabled || !this.config.logRequests) return;

        const { method, url, headers, data } = config;

        console.group(`📤 ${method?.toUpperCase()} ${url}`);

        if (this.config.level === LogLevel.DEBUG) {
            console.log('Headers:', this.sanitizeHeaders(headers));
            if (data) {
                console.log('Body:', data);
            }
        }

        console.groupEnd();
    }

    /**
     * Log de resposta
     */
    logResponse(response: AxiosResponse, duration?: number): void {
        if (!this.config.enabled || !this.config.logResponses) return;

        const { status, statusText, config, data } = response;

        const emoji = status >= 200 && status < 300 ? '✅' : '⚠️';

        console.group(`${emoji} ${status} ${statusText} - ${config.method?.toUpperCase()} ${config.url}`);

        if (this.config.logTiming && duration) {
            console.log(`⏱️ Duration: ${duration}ms`);
        }

        if (this.config.level === LogLevel.DEBUG) {
            console.log('Data:', data);
        }

        console.groupEnd();
    }

    /**
     * Log de erro
     */
    logError(error: AxiosError): void {
        if (!this.config.enabled || !this.config.logErrors) return;

        const { config, response, message, code } = error;

        console.group(`❌ Error - ${config?.method?.toUpperCase()} ${config?.url}`);

        console.error('Message:', message);
        console.error('Code:', code);

        if (response) {
            console.error('Status:', response.status);
            console.error('Data:', response.data);
        }

        if (this.config.level === LogLevel.DEBUG) {
            console.error('Full error:', error);
        }

        console.groupEnd();
    }

    /**
     * Log personalizado
     */
    log(level: LogLevel, message: string, data?: any): void {
        if (!this.config.enabled) return;

        const levelPriority: Record<LogLevel, number> = {
            [LogLevel.ERROR]: 0,
            [LogLevel.WARN]: 1,
            [LogLevel.INFO]: 2,
            [LogLevel.DEBUG]: 3
        };

        if (levelPriority[level] > levelPriority[this.config.level]) {
            return;
        }

        const emoji = {
            [LogLevel.ERROR]: '❌',
            [LogLevel.WARN]: '⚠️',
            [LogLevel.INFO]: 'ℹ️',
            [LogLevel.DEBUG]: '🔍'
        };

        console.log(`${emoji[level]} ${message}`, data || '');
    }

    /**
     * Sanitiza headers (remove dados sensíveis)
     */
    private sanitizeHeaders(headers: any): any {
        if (!headers) return {};

        const sanitized = { ...headers };
        const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'api-key'];

        Object.keys(sanitized).forEach(key => {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                sanitized[key] = '***';
            }
        });

        return sanitized;
    }

    /**
     * Habilita/desabilita logging
     */
    setEnabled(enabled: boolean): void {
        this.config.enabled = enabled;
    }

    /**
     * Atualiza nível de log
     */
    setLevel(level: LogLevel): void {
        this.config.level = level;
    }
}

// Instância singleton
export const apiLogger = new ApiLogger();
