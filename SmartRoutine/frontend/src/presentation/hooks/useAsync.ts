import { useState, useCallback, useEffect } from 'react';
import { AppError } from '@/shared/errors/AppError';

/**
* Status da operação assíncrona
*/
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
* Resultado do hook useAsync
*/
export interface UseAsyncResult<T, E = Error> {
    data: T | null;
    error: E | null;
    status: AsyncStatus;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

/**
* Hook para operações assíncronas
* 
* @param asyncFunction - Função assíncrona a ser executada
* @param immediate - Se deve executar imediatamente (padrão: false)
*/
export function useAsync<T, E = AppError>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate: boolean = false
): UseAsyncResult<T, E> {
    const [status, setStatus] = useState<AsyncStatus>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);

    /**
     * Executa função assíncrona
     */
    const execute = useCallback(async (...args: any[]) => {
        try {
            setStatus('loading');
            setError(null);

            const result = await asyncFunction(...args);

            setData(result);
            setStatus('success');
        } catch (err) {
            setError(err as E);
            setStatus('error');
        }
    }, [asyncFunction]);

    /**
     * Reseta estado
     */
    const reset = useCallback(() => {
        setStatus('idle');
        setData(null);
        setError(null);
    }, []);

    // Executar imediatamente se solicitado
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);

    return {
        data,
        error,
        status,
        isIdle: status === 'idle',
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        execute,
        reset
    };
}