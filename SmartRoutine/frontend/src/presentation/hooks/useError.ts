import { useState, useCallback } from 'react';
import { AppError } from '@/shared/errors/AppError';
import { ErrorHandler, FormattedError } from '@/shared/errors/ErrorHandler';
import { errorLogger } from '@/shared/errors/ErrorLogger';
import { useNotification } from '@/presentation/contexts/NotificationContext';

/**
* Hook para gerenciar erros
*/
export const useError = () => {
    const [error, setError] = useState<FormattedError | null>(null);
    const { error: showErrorNotification } = useNotification();

    /**
     * Define erro
     */
    const handleError = useCallback((err: unknown, context?: any) => {
        const appError = ErrorHandler.handle(err, context);
        const formatted = ErrorHandler.format(appError);

        setError(formatted);

        // Mostrar notificação se necessário
        if (ErrorHandler.shouldNotifyUser(appError)) {
            showErrorNotification(formatted.message, formatted.title);
        }

        // Log
        errorLogger.log(appError, context);
    }, [showErrorNotification]);

    /**
     * Limpa erro
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Verifica se tem erro
     */
    const hasError = error !== null;

    return {
        error,
        hasError,
        handleError,
        clearError,
        setError
    };
};