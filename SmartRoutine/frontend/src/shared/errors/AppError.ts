import { HttpStatusCode } from '@/shared/types/api.types';
import { ErrorCode } from '@/shared/types/error.types';

/**
* Classe base de erro da aplicação
* 
* Responsabilidades:
* - Erro customizado com statusCode
* - Mensagens amigáveis
* - Rastreabilidade
* - Factory methods
*/
export class AppError extends Error {
    public readonly name: string;
    public readonly statusCode: number;
    public readonly code?: ErrorCode;
    public readonly timestamp: Date;
    public readonly path?: string;
    public readonly method?: string;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
        code?: ErrorCode,
        details?: any
    ) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.timestamp = new Date();
        this.details = details;

        // Mantém stack trace correto
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // Define prototype explicitamente (necessário para extends Error)
        Object.setPrototypeOf(this, AppError.prototype);
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            timestamp: this.timestamp.toISOString(),
            path: this.path,
            method: this.method,
            details: this.details
        };
    }

    /**
     * Retorna mensagem formatada
     */
    toString(): string {
        return `[${this.statusCode}] ${this.name}: ${this.message}`;
    }

    /**
     * Verifica se é erro de cliente (4xx)
     */
    isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    /**
     * Verifica se é erro de servidor (5xx)
     */
    isServerError(): boolean {
        return this.statusCode >= 500;
    }

    // ==================== FACTORY METHODS ====================

    /**
     * 400 - Bad Request
     */
    static badRequest(message: string, details?: any): AppError {
        return new AppError(
            message,
            HttpStatusCode.BAD_REQUEST,
            ErrorCode.INVALID_INPUT,
            details
        );
    }

    /**
     * 401 - Unauthorized
     */
    static unauthorized(message: string = 'Não autorizado'): AppError {
        return new AppError(
            message,
            HttpStatusCode.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED
        );
    }

    /**
     * 403 - Forbidden
     */
    static forbidden(message: string = 'Acesso negado'): AppError {
        return new AppError(
            message,
            HttpStatusCode.FORBIDDEN,
            ErrorCode.FORBIDDEN
        );
    }

    /**
     * 404 - Not Found
     */
    static notFound(message: string): AppError {
        return new AppError(
            message,
            HttpStatusCode.NOT_FOUND,
            ErrorCode.NOT_FOUND
        );
    }

    /**
     * 409 - Conflict
     */
    static conflict(message: string): AppError {
        return new AppError(
            message,
            HttpStatusCode.CONFLICT,
            ErrorCode.ALREADY_EXISTS
        );
    }

    /**
     * 422 - Unprocessable Entity
     */
    static unprocessableEntity(message: string, details?: any): AppError {
        return new AppError(
            message,
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            ErrorCode.VALIDATION_ERROR,
            details
        );
    }

    /**
     * 429 - Too Many Requests
     */
    static tooManyRequests(message: string = 'Muitas requisições. Tente novamente mais tarde.'): AppError {
        return new AppError(
            message,
            HttpStatusCode.TOO_MANY_REQUESTS,
            ErrorCode.RATE_LIMIT_EXCEEDED
        );
    }

    /**
     * 500 - Internal Server Error
     */
    static internal(message: string = 'Erro interno do servidor'): AppError {
        return new AppError(
            message,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            ErrorCode.INTERNAL_ERROR
        );
    }

    /**
     * 503 - Service Unavailable
     */
    static serviceUnavailable(message: string = 'Serviço temporariamente indisponível'): AppError {
        return new AppError(
            message,
            HttpStatusCode.SERVICE_UNAVAILABLE,
            ErrorCode.SERVICE_UNAVAILABLE
        );
    }

    /**
     * Cria AppError de Error nativo
     */
    static fromError(error: Error, statusCode?: number): AppError {
        if (error instanceof AppError) {
            return error;
        }

        return new AppError(
            error.message,
            statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
            ErrorCode.INTERNAL_ERROR
        );
    }
}