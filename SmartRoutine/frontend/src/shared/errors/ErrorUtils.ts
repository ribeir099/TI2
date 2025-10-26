import { AppError } from './AppError';
import axios from 'axios';

/**
* Utilitários de Erro
*/
export class ErrorUtils {
    /**
     * Verifica se é erro de rede
     */
    static isNetworkError(error: unknown): boolean {
        if (axios.isAxiosError(error)) {
            return (
                error.code === 'ERR_NETWORK' ||
                error.code === 'ECONNREFUSED' ||
                error.code === 'ENOTFOUND' ||
                error.message === 'Network Error'
            );
        }

        return false;
    }

    /**
     * Verifica se é erro de timeout
     */
    static isTimeoutError(error: unknown): boolean {
        if (axios.isAxiosError(error)) {
            return (
                error.code === 'ECONNABORTED' ||
                error.code === 'ETIMEDOUT' ||
                error.message.includes('timeout')
            );
        }

        return false;
    }

    /**
     * Verifica se é erro de cancelamento
     */
    static isCancelError(error: unknown): boolean {
        return axios.isCancel?.(error) || (error as any)?.code === 'ERR_CANCELED';
    }

    /**
     * Verifica se é erro HTTP
     */
    static isHttpError(error: unknown): error is AppError {
        return error instanceof AppError;
    }

    /**
     * Extrai mensagem de erro
     */
    static extractMessage(error: unknown): string {
        if (error instanceof AppError) {
            return error.message;
        }

        if (error instanceof Error) {
            return error.message;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (axios.isAxiosError(error)) {
            return (
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message
            );
        }

        return 'Erro desconhecido';
    }

    /**
     * Extrai stack trace
     */
    static extractStack(error: unknown): string | undefined {
        if (error instanceof Error) {
            return error.stack;
        }

        return undefined;
    }

    /**
     * Verifica se deve fazer retry
     */
    static shouldRetry(error: unknown, attempt: number, maxAttempts: number): boolean {
        if (attempt >= maxAttempts) {
            return false;
        }

        // Retry em erros de rede
        if (this.isNetworkError(error)) {
            return true;
        }

        // Retry em timeouts
        if (this.isTimeoutError(error)) {
            return true;
        }

        // Retry em 5xx
        if (error instanceof AppError) {
            return error.isServerError();
        }

        return false;
    }

    /**
     * Normaliza erro para AppError
     */
    static normalize(error: unknown): AppError {
        if (error instanceof AppError) {
            return error;
        }

        if (error instanceof Error) {
            return AppError.fromError(error);
        }

        if (typeof error === 'string') {
            return AppError.internal(error);
        }

        return AppError.internal('Erro desconhecido');
    }

    /**
     * Cria erro de múltiplas falhas
     */
    static aggregate(errors: Error[]): AppError {
        if (errors.length === 0) {
            return AppError.internal('Nenhum erro para agregar');
        }

        if (errors.length === 1) {
            return this.normalize(errors[0]);
        }

        const messages = errors.map(e => this.extractMessage(e));
        const message = `Múltiplos erros ocorreram:\n${messages.join('\n')}`;

        return AppError.internal(message);
    }

    /**
     * Wrap erro com contexto
     */
    static wrap(error: unknown, context: string): AppError {
        const appError = this.normalize(error);
        return new AppError(
            `${context}: ${appError.message}`,
            appError.statusCode,
            appError.code
        );
    }

    /**
     * Serializa erro para log
     */
    static serialize(error: unknown): object {
        if (error instanceof AppError) {
            return error.toJSON();
        }

        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }

        return {
            error: String(error)
        };
    }

    /**
     * Compara erros
     */
    static areEqual(error1: unknown, error2: unknown): boolean {
        const msg1 = this.extractMessage(error1);
        const msg2 = this.extractMessage(error2);

        return msg1 === msg2;
    }

    /**
     * Verifica se é erro crítico
     */
    static isCritical(error: unknown): boolean {
        if (error instanceof AppError) {
            return error.isServerError();
        }

        return true;
    }
}