import { useState, useEffect } from 'react';
import { throttle } from '@/shared/utils/helpers';

/**
* Tamanho da janela
*/
export interface WindowSize {
    width: number;
    height: number;
}

/**
* Hook para tamanho da janela
* 
* @param throttleMs - Throttle em ms (padrão: 200ms)
*/
export function useWindowSize(throttleMs: number = 200): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = throttle(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, throttleMs);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [throttleMs]);

    return windowSize;
}

/**
* Hook para largura da janela
*/
export function useWindowWidth(throttleMs: number = 200): number {
    const { width } = useWindowSize(throttleMs);
    return width;
}

/**
* Hook para altura da janela
*/
export function useWindowHeight(throttleMs: number = 200): number {
    const { height } = useWindowSize(throttleMs);
    return height;
}