import { AppError } from './AppError';
import { ValidationError } from './ValidationError';
import { NetworkError } from './NetworkError';
import { IAError } from './IAError';
import { BusinessError } from './BusinessError';
import { AuthenticationError } from './AuthenticationError';
import { getErrorTitle, getErrorIcon } from './ErrorMessages';
import { HttpStatusCode } from '@/shared/types/api.types';
import { ErrorCode } from '../types';

/**
* Contexto do erro
*/
export interface ErrorContext {
    userId?: string;
    action?: string;
    component?: string;
    additionalInfo?: Record<string, any>;
}

/**
* Erro formatado para UI
*/
export interface FormattedError {
    title: string;
    message: string;
    icon: string;
    color: string;
    statusCode?: number;
    canRetry: boolean;
    actions?: Array<{
        label: string;
        onClick: () => void;
    }>;
}

/**
* Handler Centralizado de Erros
* 
* Responsabilidades:
* - Normalizar erros
* - Formatar para exibição
* - Logging
* - Sugestões de ação
*/
export class ErrorHandler {
    /**
     * Trata erro genérico e converte para AppError
     */
    static handle(error: unknown, context?: ErrorContext): AppError {
        // Já é AppError
        if (error instanceof AppError) {
            this.logError(error, context);
            return error;
        }

        // Error nativo
        if (error instanceof Error) {
            const appError = AppError.fromError(error);
            this.logError(appError, context);
            return appError;
        }

        // Erro desconhecido
        const unknownError = AppError.internal('Erro desconhecido');
        this.logError(unknownError, context);
        return unknownError;
    }

    /**
     * Obtém mensagem amigável para o usuário
     */
    static getUserMessage(error: unknown): string {
        if (error instanceof AppError) {
            return error.message;
        }

        if (error instanceof Error) {
            return error.message;
        }

        return 'Ocorreu um erro inesperado. Tente novamente.';
    }

    /**
     * Formata erro para exibição na UI
     */
    static format(error: unknown, context?: ErrorContext): FormattedError {
        const appError = this.handle(error, context);

        return {
            title: getErrorTitle(appError),
            message: this.getUserMessage(appError),
            icon: getErrorIcon(appError),
            color: this.getErrorColor(appError),
            statusCode: appError.statusCode,
            canRetry: this.canRetry(appError),
            actions: this.getErrorActions(appError)
        };
    }

    /**
     * Verifica se erro permite retry
     */
    static canRetry(error: unknown): boolean {
        if (error instanceof NetworkError) {
            return error.canRetry();
        }

        if (error instanceof AppError) {
            const retryableStatusCodes = [
                HttpStatusCode.TOO_MANY_REQUESTS,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                HttpStatusCode.BAD_GATEWAY,
                HttpStatusCode.SERVICE_UNAVAILABLE,
                HttpStatusCode.GATEWAY_TIMEOUT
            ];

            return retryableStatusCodes.includes(error.statusCode as HttpStatusCode);
        }

        return false;
    }

    /**
     * Obtém ações sugeridas para o erro
     */
    static getErrorActions(error: AppError): FormattedError['actions'] {
        const actions: FormattedError['actions'] = [];

        // Token expirado - sugerir login
        if (error instanceof AuthenticationError) {
            if (error.authErrorType === 'TOKEN_EXPIRED' || error.authErrorType === 'SESSION_EXPIRED') {
                actions.push({
                    label: 'Fazer Login',
                    onClick: () => {
                        window.location.href = '/login';
                    }
                });
            }
        }

        // Rede - sugerir retry
        if (error instanceof NetworkError && error.canRetry()) {
            actions.push({
                label: 'Tentar Novamente',
                onClick: () => {
                    window.location.reload();
                }
            });
        }

        // IA não configurada - sugerir configuração
        if (error instanceof IAError && error.iaErrorType === 'NOT_CONFIGURED') {
            actions.push({
                label: 'Ver Documentação',
                onClick: () => {
                    window.open('https://docs.smartroutine.com/ia-setup', '_blank');
                }
            });
        }

        // Erro 404 - voltar
        if (error.statusCode === HttpStatusCode.NOT_FOUND) {
            actions.push({
                label: 'Voltar',
                onClick: () => {
                    window.history.back();
                }
            });
        }

        return actions.length > 0 ? actions : undefined;
    }

    /**
     * Log de erro
     */
    static logError(error: AppError, context?: ErrorContext): void {
        const logData = {
            error: error.toJSON(),
            context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };

        // Em desenvolvimento, log no console
        if (import.meta.env.DEV) {
            console.group(`🔴 ${error.name}`);
            console.error('Message:', error.message);
            console.error('Status:', error.statusCode);
            console.error('Code:', error.code);
            console.error('Stack:', error.stack);
            if (context) {
                console.error('Context:', context);
            }
            console.groupEnd();
        }

        // Em produção, enviar para serviço de logging
        if (import.meta.env.PROD) {
            this.sendToErrorTracking(logData);
        }
    }

    /**
     * Envia para serviço de error tracking (Sentry, etc)
     */
    private static sendToErrorTracking(logData: any): void {
        // TODO: Implementar integração com Sentry, LogRocket, etc
        // Sentry.captureException(logData.error);
        console.log('📤 Error sent to tracking service:', logData);
    }

    /**
     * Obtém cor do erro
     */
    private static getErrorColor(error: AppError): string {
        if (error.isClientError()) return '#f59e0b'; // amber
        if (error.isServerError()) return '#ef4444'; // red
        return '#6b7280'; // gray
    }

    /**
     * Verifica se é erro crítico
     */
    static isCritical(error: unknown): boolean {
        if (error instanceof AppError) {
            return (
                error.isServerError() ||
                error.code === ErrorCode.INTERNAL_ERROR ||
                error.code === ErrorCode.SERVICE_UNAVAILABLE
            );
        }

        return true;
    }

    /**
     * Verifica se deve notificar o usuário
     */
    static shouldNotifyUser(error: unknown): boolean {
        if (error instanceof AppError) {
            // Não notificar erros esperados (404, 401)
            const silentStatusCodes = [HttpStatusCode.NOT_FOUND];
            return !silentStatusCodes.includes(error.statusCode as HttpStatusCode);
        }

        return true;
    }

    /**
     * Obtém sugestão de ação
     */
    static getSuggestion(error: unknown): string | null {
        if (error instanceof ValidationError) {
            return 'Verifique os campos destacados e corrija os erros.';
        }

        if (error instanceof AuthenticationError) {
            return 'Faça login novamente para continuar.';
        }

        if (error instanceof NetworkError) {
            return 'Verifique sua conexão com a internet e tente novamente.';
        }

        if (error instanceof IAError) {
            return 'O serviço de IA está temporariamente indisponível. Use as opções manuais.';
        }

        if (error instanceof BusinessError) {
            return 'Verifique se todas as condições necessárias foram atendidas.';
        }

        return null;
    }

    /**
     * Cria erro de campo de formulário
     */
    static createFieldError(field: string, message: string): ValidationError {
        return ValidationError.field(field, message);
    }

    /**
     * Cria erro de múltiplos campos
     */
    static createFieldErrors(errors: Record<string, string>): ValidationError {
        const fieldErrors = Object.entries(errors).map(([field, message]) => ({
            field,
            message
        }));

        return ValidationError.fields(fieldErrors);
    }
}