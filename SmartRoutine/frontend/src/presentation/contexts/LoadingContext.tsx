import React, { createContext, useState, useCallback, ReactNode } from 'react';

/**
* Dados do contexto de loading
*/
export interface LoadingContextData {
    isLoading: boolean;
    loadingMessage: string | null;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
    setLoadingMessage: (message: string) => void;
}

/**
* Context de Loading
*/
export const LoadingContext = createContext<LoadingContextData>(
    {} as LoadingContextData
);

/**
* Props do Provider
*/
interface LoadingProviderProps {
    children: ReactNode;
}

/**
* Provider de Loading Global
* 
* Responsabilidades:
* - Gerenciar estado de loading global
* - Overlay de carregamento
* - Mensagens de loading
*/
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [loadingCount, setLoadingCount] = useState(0);

    /**
     * Inicia loading
     */
    const startLoading = useCallback((message?: string) => {
        setLoadingCount(prev => prev + 1);
        setIsLoading(true);
        if (message) {
            setLoadingMessage(message);
        }
    }, []);

    /**
     * Para loading
     */
    const stopLoading = useCallback(() => {
        setLoadingCount(prev => {
            const newCount = Math.max(0, prev - 1);

            if (newCount === 0) {
                setIsLoading(false);
                setLoadingMessage(null);
            }

            return newCount;
        });
    }, []);

    /**
     * Atualiza mensagem de loading
     */
    const updateLoadingMessage = useCallback((message: string) => {
        if (isLoading) {
            setLoadingMessage(message);
        }
    }, [isLoading]);

    const value: LoadingContextData = {
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        setLoadingMessage: updateLoadingMessage
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}

            {/* Overlay de Loading Global */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        {loadingMessage && (
                            <p className="text-sm font-medium text-foreground">
                                {loadingMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};