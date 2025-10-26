import { AppError } from './AppError';
import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';

/**
* Tipo de erro de autenticação
*/
export type AuthErrorType =
    | 'INVALID_CREDENTIALS'
    | 'TOKEN_EXPIRED'
    | 'TOKEN_INVALID'
    | 'SESSION_EXPIRED'
    | 'ACCOUNT_LOCKED'
    | 'ACCOUNT_DISABLED'
    | 'EMAIL_NOT_VERIFIED';

/**
* Erro de Autenticação
* 
* Responsabilidades:
* - Erros de login/autenticação
* - Problemas com token
* - Estado da conta
*/
export class AuthenticationError extends AppError {
    public readonly authErrorType: AuthErrorType;

    constructor(message: string, authErrorType: AuthErrorType) {
        super(
            message,
            HttpStatusCode.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED,
            { authErrorType }
        );

        this.authErrorType = authErrorType;

        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }

    /**
     * Credenciais inválidas
     */
    static invalidCredentials(): AuthenticationError {
        return new AuthenticationError(
            'Email ou senha inválidos.',
            'INVALID_CREDENTIALS'
        );
    }

    /**
     * Token expirado
     */
    static tokenExpired(): AuthenticationError {
        return new AuthenticationError(
            'Sua sessão expirou. Faça login novamente.',
            'TOKEN_EXPIRED'
        );
    }

    /**
     * Token inválido
     */
    static tokenInvalid(): AuthenticationError {
        return new AuthenticationError(
            'Token de autenticação inválido.',
            'TOKEN_INVALID'
        );
    }

    /**
     * Sessão expirada
     */
    static sessionExpired(): AuthenticationError {
        return new AuthenticationError(
            'Sua sessão expirou. Por favor, faça login novamente.',
            'SESSION_EXPIRED'
        );
    }

    /**
     * Conta bloqueada
     */
    static accountLocked(reason?: string): AuthenticationError {
        const message = reason
            ? `Sua conta está bloqueada: ${reason}`
            : 'Sua conta está bloqueada. Entre em contato com o suporte.';

        return new AuthenticationError(message, 'ACCOUNT_LOCKED');
    }

    /**
     * Conta desabilitada
     */
    static accountDisabled(): AuthenticationError {
        return new AuthenticationError(
            'Sua conta está desabilitada.',
            'ACCOUNT_DISABLED'
        );
    }

    /**
     * Email não verificado
     */
    static emailNotVerified(): AuthenticationError {
        return new AuthenticationError(
            'Verifique seu email antes de fazer login.',
            'EMAIL_NOT_VERIFIED'
        );
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            ...super.toJSON(),
            authErrorType: this.authErrorType
        };
    }
}