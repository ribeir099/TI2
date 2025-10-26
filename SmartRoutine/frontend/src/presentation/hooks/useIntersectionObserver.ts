import { useEffect, useState, RefObject } from 'react';

/**
* Opções do Intersection Observer
*/
export interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    freezeOnceVisible?: boolean;
}

/**
* Hook para Intersection Observer
* Útil para lazy loading, infinite scroll, etc
*/
export function useIntersectionObserver(
    elementRef: RefObject<Element>,
    options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | null {
    const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

    const frozen = entry?.isIntersecting && freezeOnceVisible;

    useEffect(() => {
        const node = elementRef?.current;
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(([entry]) => {
            setEntry(entry);
        }, observerParams);

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [elementRef, threshold, root, rootMargin, frozen]);

    return entry;
}

/**
* Hook simplificado para detectar se elemento está visível
*/
export function useIsVisible(
    elementRef: RefObject<Element>,
    options: UseIntersectionObserverOptions = {}
): boolean {
    const entry = useIntersectionObserver(elementRef, options);
    return entry?.isIntersecting ?? false;
}