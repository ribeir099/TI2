import { useState, useEffect } from 'react';
import { throttle } from '@/shared/utils/helpers';

/**
* Posição do scroll
*/
export interface ScrollPosition {
    x: number;
    y: number;
}

/**
* Hook para posição do scroll
* 
* @param throttleMs - Throttle em ms (padrão: 100ms)
*/
export function useScrollPosition(throttleMs: number = 100): ScrollPosition {
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
        x: typeof window !== 'undefined' ? window.scrollX : 0,
        y: typeof window !== 'undefined' ? window.scrollY : 0
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = throttle(() => {
            setScrollPosition({
                x: window.scrollX,
                y: window.scrollY
            });
        }, throttleMs);

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [throttleMs]);

    return scrollPosition;
}

/**
* Hook para detectar direção do scroll
*/
export function useScrollDirection() {
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = throttle(() => {
            const currentY = window.scrollY;

            if (currentY > lastY) {
                setDirection('down');
            } else if (currentY < lastY) {
                setDirection('up');
            }

            setLastY(currentY);
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastY]);

    return direction;
}

/**
* Hook para detectar se está no topo
*/
export function useIsAtTop(threshold: number = 0): boolean {
    const { y } = useScrollPosition();
    return y <= threshold;
}

/**
* Hook para detectar se está no fundo
*/
export function useIsAtBottom(threshold: number = 100): boolean {
    const { y } = useScrollPosition();

    if (typeof window === 'undefined') return false;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    return y + windowHeight >= documentHeight - threshold;
}
