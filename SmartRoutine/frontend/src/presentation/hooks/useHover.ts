import { useState, useCallback, RefObject } from 'react';

/**
* Hook para detectar hover
*/
export function useHover<T extends HTMLElement = HTMLElement>(): [
    RefObject<T>,
    boolean
] {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovering(true), []);
    const handleMouseLeave = useCallback(() => setIsHovering(false), []);

    const ref = useCallback((node: T | null) => {
        if (node) {
            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                node.removeEventListener('mouseenter', handleMouseEnter);
                node.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [handleMouseEnter, handleMouseLeave]) as any;

    return [ref, isHovering];
}