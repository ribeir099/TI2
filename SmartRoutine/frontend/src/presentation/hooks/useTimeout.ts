import { useEffect, useRef, useCallback, useState } from 'react';

/**
* Hook para timeout
* 
* @param callback - Função a ser executada
* @param delay - Delay em ms (null para cancelar)
*/
export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();
    const [isActive, setIsActive] = useState(delay !== null);

    // Salvar callback mais recente
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Configurar timeout
    useEffect(() => {
        if (delay === null) {
            setIsActive(false);
            return;
        }

        setIsActive(true);

        const id = setTimeout(() => {
            savedCallback.current?.();
            setIsActive(false);
        }, delay);

        return () => {
            clearTimeout(id);
            setIsActive(false);
        };
    }, [delay]);

    const start = useCallback(() => {
        setIsActive(true);
    }, []);

    const cancel = useCallback(() => {
        setIsActive(false);
    }, []);

    return {
        isActive,
        start,
        cancel
    };
}