import { AppError } from './AppError';
import { NetworkError } from './NetworkError';
import { AuthenticationError } from './AuthenticationError';

/**
* Estratégia de recuperação
*/
export interface RecoveryStrategy {
    canRecover: boolean;
    strategy: 'retry' | 'refresh' | 'redirect' | 'fallback' | 'ignore';
    action?: () => void | Promise<void>;
    message: string;
}

/**
* Gerenciador de Recuperação de Erros
* 
* Responsabilidades:
* - Determinar se erro é recuperável
* - Sugerir estratégias de recuperação
* - Executar recuperação automática
*/
export class ErrorRecovery {
    /**
     * Determina estratégia de recuperação
     */
    static getRecoveryStrategy(error: unknown): RecoveryStrategy {
        // Network errors - retry
        if (error instanceof NetworkError) {
            return {
                canRecover: error.canRetry(),
                strategy: 'retry',
                message: 'Tentando reconectar...',
                action: () => {
                    // Retry será feito automaticamente pelos interceptors
                }
            };
        }

        // Authentication errors - redirect to login
        if (error instanceof AuthenticationError) {
            if (
                error.authErrorType === 'TOKEN_EXPIRED' ||
                error.authErrorType === 'SESSION_EXPIRED'
            ) {
                return {
                    canRecover: true,
                    strategy: 'redirect',
                    message: 'Redirecionando para login...',
                    action: () => {
                        window.location.href = '/login';
                    }
                };
            }

            return {
                canRecover: false,
                strategy: 'redirect',
                message: 'Faça login novamente',
                action: () => {
                    window.location.href = '/login';
                }
            };
        }

        // AppError - verificar status
        if (error instanceof AppError) {
            // 404 - redirect to home
            if (error.statusCode === 404) {
                return {
                    canRecover: true,
                    strategy: 'redirect',
                    message: 'Redirecionando...',
                    action: () => {
                        window.history.back();
                    }
                };
            }

            // 5xx - retry
            if (error.isServerError()) {
                return {
                    canRecover: true,
                    strategy: 'retry',
                    message: 'Tentando novamente...'
                };
            }

            // 4xx - não recuperável (erro do cliente)
            if (error.isClientError()) {
                return {
                    canRecover: false,
                    strategy: 'ignore',
                    message: 'Corrija os dados e tente novamente'
                };
            }
        }

        // Erro desconhecido - não recuperável
        return {
            canRecover: false,
            strategy: 'fallback',
            message: 'Ocorreu um erro inesperado'
        };
    }

    /**
     * Tenta recuperar automaticamente
     */
    static async attemptRecovery(error: unknown): Promise<boolean> {
        const strategy = this.getRecoveryStrategy(error);

        if (!strategy.canRecover || !strategy.action) {
            return false;
        }

        try {
            await strategy.action();
            return true;
        } catch (recoveryError) {
            console.error('Falha na recuperação:', recoveryError);
            return false;
        }
    }

    /**
     * Verifica se erro é recuperável
     */
    static isRecoverable(error: unknown): boolean {
        const strategy = this.getRecoveryStrategy(error);
        return strategy.canRecover;
    }

    /**
     * Obtém mensagem de recuperação
     */
    static getRecoveryMessage(error: unknown): string {
        const strategy = this.getRecoveryStrategy(error);
        return strategy.message;
    }

    /**
     * Executa fallback
     */
    static executeFallback<T>(
        primaryFn: () => T | Promise<T>,
        fallbackValue: T
    ): Promise<T> {
        return Promise.resolve(primaryFn()).catch(() => fallbackValue);
    }

    /**
     * Retry com backoff
     */
    static async retryWithBackoff<T>(
        fn: () => Promise<T>,
        maxAttempts: number = 3,
        baseDelay: number = 1000
    ): Promise<T> {
        let lastError: any;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (attempt < maxAttempts) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }
}
