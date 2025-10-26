import { useEffect, useRef, useCallback, useState } from 'react';

/**
* Hook para interval
* 
* @param callback - Função a ser executada
* @param delay - Delay em ms (null para pausar)
*/
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();
    const [isRunning, setIsRunning] = useState(delay !== null);

    // Salvar callback mais recente
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Configurar interval
    useEffect(() => {
        if (delay === null) {
            setIsRunning(false);
            return;
        }

        setIsRunning(true);

        function tick() {
            savedCallback.current?.();
        }

        const id = setInterval(tick, delay);

        return () => {
            clearInterval(id);
            setIsRunning(false);
        };
    }, [delay]);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const stop = useCallback(() => {
        setIsRunning(false);
    }, []);

    return {
        isRunning,
        start,
        stop
    };
}