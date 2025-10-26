import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de fetch
*/
export interface UseFetchOptions<T> {
    enabled?: boolean;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    initialData?: T;
}

/**
* Resultado do hook useFetch
*/
export interface UseFetchResult<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    refetch: () => Promise<void>;
    reset: () => void;
}

/**
* Hook para fetch de dados
*/
export function useFetch<T>(
    url: string,
    options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
    const {
        enabled = true,
        refetchOnMount = true,
        refetchOnWindowFocus = false,
        onSuccess,
        onError,
        initialData
    } = options;

    const [data, setData] = useState<T | null>(initialData || null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fetch data
     */
    const fetchData = useCallback(async () => {
        if (!enabled) return;

        try {
            setIsLoading(true);
            setError(null);

            const result = await apiClient.get<T>(url);
            setData(result);

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err) {
            const error = err instanceof AppError ? err : new Error('Erro ao buscar dados');
            setError(error);

            if (onError) {
                onError(error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [url, enabled, onSuccess, onError]);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setData(initialData || null);
        setError(null);
        setIsLoading(false);
    }, [initialData]);

    // Fetch inicial
    useEffect(() => {
        if (refetchOnMount) {
            fetchData();
        }
    }, [refetchOnMount, fetchData]);

    // Refetch ao focar janela
    useEffect(() => {
        if (!refetchOnWindowFocus) return;

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [refetchOnWindowFocus, fetchData]);

    return {
        data,
        error,
        isLoading,
        isSuccess: !isLoading && !error && data !== null,
        isError: !isLoading && error !== null,
        refetch: fetchData,
        reset
    };
}