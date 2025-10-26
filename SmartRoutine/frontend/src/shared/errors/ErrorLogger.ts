import { AppError } from './AppError';
import { ErrorContext } from './ErrorHandler';

/**
* Nível de severidade
*/
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

/**
* Log de erro estruturado
*/
export interface ErrorLog {
    id: string;
    timestamp: Date;
    severity: ErrorSeverity;
    error: {
        name: string;
        message: string;
        stack?: string;
        statusCode?: number;
        code?: string;
    };
    context?: ErrorContext;
    user?: {
        id?: string;
        email?: string;
    };
    browser: {
        userAgent: string;
        platform: string;
        language: string;
    };
    page: {
        url: string;
        path: string;
        referrer: string;
    };
    viewport: {
        width: number;
        height: number;
    };
}

/**
* Logger de Erros
* 
* Responsabilidades:
* - Estruturar logs de erro
* - Enviar para serviços externos
* - Armazenar localmente
* - Análise de erros
*/
export class ErrorLogger {
    private logs: ErrorLog[] = [];
    private readonly MAX_LOGS = 100;

    /**
     * Registra erro
     */
    log(error: Error | AppError, context?: ErrorContext): void {
        const errorLog = this.createErrorLog(error, context);

        // Adicionar ao array de logs
        this.logs.push(errorLog);

        // Manter apenas os últimos MAX_LOGS
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.shift();
        }

        // Salvar em localStorage (para debug)
        this.saveToStorage(errorLog);

        // Enviar para serviço externo em produção
        if (import.meta.env.PROD) {
            this.sendToExternalService(errorLog);
        }

        // Log no console em desenvolvimento
        if (import.meta.env.DEV) {
            this.logToConsole(errorLog);
        }
    }

    /**
     * Cria log estruturado
     */
    private createErrorLog(error: Error | AppError, context?: ErrorContext): ErrorLog {
        const severity = this.determineSeverity(error);

        return {
            id: this.generateId(),
            timestamp: new Date(),
            severity,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                statusCode: error instanceof AppError ? error.statusCode : undefined,
                code: error instanceof AppError ? error.code : undefined
            },
            context,
            user: this.getUserInfo(),
            browser: this.getBrowserInfo(),
            page: this.getPageInfo(),
            viewport: this.getViewportInfo()
        };
    }

    /**
     * Determina severidade do erro
     */
    private determineSeverity(error: Error | AppError): ErrorSeverity {
        if (error instanceof AppError) {
            if (error.statusCode >= 500) return ErrorSeverity.CRITICAL;
            if (error.statusCode === 401 || error.statusCode === 403) return ErrorSeverity.HIGH;
            if (error.statusCode === 422) return ErrorSeverity.LOW;
            return ErrorSeverity.MEDIUM;
        }

        return ErrorSeverity.MEDIUM;
    }

    /**
     * Obtém informações do usuário
     */
    private getUserInfo(): ErrorLog['user'] {
        try {
            const userStr = localStorage.getItem('smartroutine_user_data');
            if (userStr) {
                const user = JSON.parse(userStr);
                return {
                    id: user.id,
                    email: user.email
                };
            }
        } catch (error) {
            // Ignorar
        }

        return undefined;
    }

    /**
     * Obtém informações do navegador
     */
    private getBrowserInfo(): ErrorLog['browser'] {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }

    /**
     * Obtém informações da página
     */
    private getPageInfo(): ErrorLog['page'] {
        return {
            url: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer
        };
    }

    /**
     * Obtém informações da viewport
     */
    private getViewportInfo(): ErrorLog['viewport'] {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * Gera ID único
     */
    private generateId(): string {
        return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Salva em localStorage
     */
    private saveToStorage(errorLog: ErrorLog): void {
        try {
            const key = 'smartroutine_error_logs';
            const stored = localStorage.getItem(key);
            const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];

            logs.push(errorLog);

            // Manter apenas últimos 50
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }

            localStorage.setItem(key, JSON.stringify(logs));
        } catch (error) {
            console.error('Erro ao salvar log:', error);
        }
    }

    /**
     * Envia para serviço externo
     */
    private sendToExternalService(errorLog: ErrorLog): void {
        // TODO: Implementar integração com Sentry, LogRocket, etc
        /*
        Sentry.captureException(errorLog.error, {
          level: this.getSentryLevel(errorLog.severity),
          contexts: {
            user: errorLog.user,
            browser: errorLog.browser,
            page: errorLog.page
          },
          tags: {
            statusCode: errorLog.error.statusCode,
            errorCode: errorLog.error.code
          }
        });
        */
    }

    /**
     * Log no console (desenvolvimento)
     */
    private logToConsole(errorLog: ErrorLog): void {
        const color = this.getConsoleColor(errorLog.severity);

        console.group(`%c[${errorLog.severity.toUpperCase()}] ${errorLog.error.name}`, `color: ${color}; font-weight: bold;`);
        console.error('Message:', errorLog.error.message);
        console.error('Timestamp:', errorLog.timestamp.toISOString());

        if (errorLog.error.statusCode) {
            console.error('Status Code:', errorLog.error.statusCode);
        }

        if (errorLog.error.code) {
            console.error('Error Code:', errorLog.error.code);
        }

        if (errorLog.context) {
            console.error('Context:', errorLog.context);
        }

        if (errorLog.error.stack) {
            console.error('Stack:', errorLog.error.stack);
        }

        console.groupEnd();
    }

    /**
     * Obtém cor do console por severidade
     */
    private getConsoleColor(severity: ErrorSeverity): string {
        const colors = {
            [ErrorSeverity.LOW]: '#3b82f6',       // blue
            [ErrorSeverity.MEDIUM]: '#f59e0b',    // amber
            [ErrorSeverity.HIGH]: '#ef4444',      // red
            [ErrorSeverity.CRITICAL]: '#dc2626'   // dark red
        };

        return colors[severity];
    }

    /**
     * Obtém todos os logs
     */
    getLogs(): ErrorLog[] {
        return [...this.logs];
    }

    /**
     * Obtém logs por severidade
     */
    getLogsBySeverity(severity: ErrorSeverity): ErrorLog[] {
        return this.logs.filter(log => log.severity === severity);
    }

    /**
     * Obtém logs críticos
     */
    getCriticalLogs(): ErrorLog[] {
        return this.getLogsBySeverity(ErrorSeverity.CRITICAL);
    }

    /**
     * Limpa logs
     */
    clearLogs(): void {
        this.logs = [];
    }

    /**
     * Exporta logs
     */
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Obtém estatísticas de erros
     */
    getStatistics(): {
        total: number;
        bySeverity: Record<ErrorSeverity, number>;
        byStatusCode: Record<number, number>;
        mostCommon: string[];
    } {
        const total = this.logs.length;

        const bySeverity = {
            [ErrorSeverity.LOW]: 0,
            [ErrorSeverity.MEDIUM]: 0,
            [ErrorSeverity.HIGH]: 0,
            [ErrorSeverity.CRITICAL]: 0
        };

        const byStatusCode: Record<number, number> = {};
        const errorCounts: Record<string, number> = {};

        this.logs.forEach(log => {
            bySeverity[log.severity]++;

            if (log.error.statusCode) {
                byStatusCode[log.error.statusCode] = (byStatusCode[log.error.statusCode] || 0) + 1;
            }

            errorCounts[log.error.name] = (errorCounts[log.error.name] || 0) + 1;
        });

        const mostCommon = Object.entries(errorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name);

        return {
            total,
            bySeverity,
            byStatusCode,
            mostCommon
        };
    }
}

// Singleton instance
export const errorLogger = new ErrorLogger();