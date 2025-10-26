import { AppError } from './AppError';
import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';

/**
* Tipo de erro de IA
*/
export type IAErrorType =
    | 'API_KEY_INVALID'
    | 'RATE_LIMIT'
    | 'QUOTA_EXCEEDED'
    | 'INVALID_RESPONSE'
    | 'TIMEOUT'
    | 'MODEL_ERROR'
    | 'NOT_CONFIGURED';

/**
* Erro de IA
* 
* Responsabilidades:
* - Erros específicos de APIs de IA
* - Problemas de quota/rate limit
* - Erros de modelo
*/
export class IAError extends AppError {
    public readonly iaErrorType: IAErrorType;
    public readonly provider?: string;
    public readonly model?: string;
    public readonly tokenUsage?: number;

    constructor(
        message: string,
        statusCode: number,
        iaErrorType: IAErrorType,
        provider?: string,
        tokenUsage?: number
    ) {
        super(
            message,
            statusCode,
            ErrorCode.INTERNAL_ERROR,
            { iaErrorType, provider, tokenUsage }
        );

        this.iaErrorType = iaErrorType;
        this.provider = provider;
        this.tokenUsage = tokenUsage;

        Object.setPrototypeOf(this, IAError.prototype);
    }

    /**
     * API Key inválida
     */
    static apiKeyInvalid(provider?: string): IAError {
        return new IAError(
            'API Key de IA inválida ou expirada. Verifique suas credenciais.',
            HttpStatusCode.UNAUTHORIZED,
            'API_KEY_INVALID',
            provider
        );
    }

    /**
     * Rate limit excedido
     */
    static rateLimitExceeded(provider?: string, resetTime?: number): IAError {
        const message = resetTime
            ? `Limite de requisições excedido. Tente novamente em ${resetTime} segundos.`
            : 'Limite de requisições excedido. Aguarde alguns minutos.';

        return new IAError(
            message,
            HttpStatusCode.TOO_MANY_REQUESTS,
            'RATE_LIMIT',
            provider
        );
    }

    /**
     * Quota excedida
     */
    static quotaExceeded(provider?: string): IAError {
        return new IAError(
            'Quota de uso da IA excedida. Verifique seu plano.',
            HttpStatusCode.TOO_MANY_REQUESTS,
            'QUOTA_EXCEEDED',
            provider
        );
    }

    /**
     * Resposta inválida
     */
    static invalidResponse(provider?: string): IAError {
        return new IAError(
            'A IA retornou uma resposta inválida. Tente novamente.',
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            'INVALID_RESPONSE',
            provider
        );
    }

    /**
     * Timeout
     */
    static timeout(provider?: string): IAError {
        return new IAError(
            'Tempo de resposta da IA esgotado. Tente novamente.',
            HttpStatusCode.GATEWAY_TIMEOUT,
            'TIMEOUT',
            provider
        );
    }

    /**
     * Erro de modelo
     */
    static modelError(modelName: string, provider?: string): IAError {
        return new IAError(
            `Erro no modelo de IA: ${modelName}. Tente outro modelo.`,
            HttpStatusCode.BAD_REQUEST,
            'MODEL_ERROR',
            provider
        );
    }

    /**
     * IA não configurada
     */
    static notConfigured(): IAError {
        return new IAError(
            'Serviço de IA não está configurado. Configure as credenciais.',
            HttpStatusCode.SERVICE_UNAVAILABLE,
            'NOT_CONFIGURED'
        );
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            ...super.toJSON(),
            iaErrorType: this.iaErrorType,
            provider: this.provider,
            tokenUsage: this.tokenUsage
        };
    }
}