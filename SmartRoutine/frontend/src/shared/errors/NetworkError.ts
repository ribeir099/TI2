import { AppError } from './AppError';
import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';

/**
* Tipo de erro de rede
*/
export type NetworkErrorType =
    | 'CONNECTION_FAILED'
    | 'TIMEOUT'
    | 'NO_INTERNET'
    | 'DNS_ERROR'
    | 'SSL_ERROR'
    | 'CORS_ERROR';

/**
* Erro de Rede
* 
* Responsabilidades:
* - Erros de conectividade
* - Timeouts
* - Problemas de rede
*/
export class NetworkError extends AppError {
    public readonly networkErrorType: NetworkErrorType;
    public readonly url?: string;
    public readonly retryable: boolean;

    constructor(
        message: string,
        networkErrorType: NetworkErrorType,
        url?: string,
        retryable: boolean = true
    ) {
        super(
            message,
            HttpStatusCode.SERVICE_UNAVAILABLE,
            ErrorCode.NETWORK_ERROR,
            { networkErrorType, url, retryable }
        );

        this.networkErrorType = networkErrorType;
        this.url = url;
        this.retryable = retryable;

        Object.setPrototypeOf(this, NetworkError.prototype);
    }

    /**
     * Erro de conexão
     */
    static connectionFailed(url?: string): NetworkError {
        return new NetworkError(
            'Falha ao conectar com o servidor. Verifique sua conexão.',
            'CONNECTION_FAILED',
            url,
            true
        );
    }

    /**
     * Erro de timeout
     */
    static timeout(url?: string): NetworkError {
        return new NetworkError(
            'Tempo de requisição esgotado. Tente novamente.',
            'TIMEOUT',
            url,
            true
        );
    }

    /**
     * Sem internet
     */
    static noInternet(): NetworkError {
        return new NetworkError(
            'Sem conexão com a internet. Verifique sua rede.',
            'NO_INTERNET',
            undefined,
            true
        );
    }

    /**
     * Erro de DNS
     */
    static dnsError(url?: string): NetworkError {
        return new NetworkError(
            'Não foi possível resolver o endereço do servidor.',
            'DNS_ERROR',
            url,
            false
        );
    }

    /**
     * Erro de SSL/TLS
     */
    static sslError(url?: string): NetworkError {
        return new NetworkError(
            'Erro de certificado SSL. Conexão insegura.',
            'SSL_ERROR',
            url,
            false
        );
    }

    /**
     * Erro de CORS
     */
    static corsError(url?: string): NetworkError {
        return new NetworkError(
            'Erro de política CORS. Acesso bloqueado.',
            'CORS_ERROR',
            url,
            false
        );
    }

    /**
     * Verifica se pode fazer retry
     */
    canRetry(): boolean {
        return this.retryable;
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            ...super.toJSON(),
            networkErrorType: this.networkErrorType,
            url: this.url,
            retryable: this.retryable
        };
    }
}