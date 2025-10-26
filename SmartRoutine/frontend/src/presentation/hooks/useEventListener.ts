import { useEffect, useRef, RefObject, useState } from 'react';

/**
* Hook para adicionar event listener em elemento ou window
* 
* @param eventName - Nome do evento
* @param handler - Handler do evento
* @param element - Elemento alvo (padrão: window)
* @param options - Opções do addEventListener
*/
export function useEventListener<
    K extends keyof WindowEventMap,
    T extends HTMLElement = HTMLDivElement
>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: RefObject<T> | T | Window | null,
    options?: boolean | AddEventListenerOptions
): void {
    // ✅ CORREÇÃO: Passar undefined como valor inicial
    const savedHandler = useRef<(event: WindowEventMap[K]) => void | undefined>(undefined);

    // Atualizar ref quando handler mudar
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // Determinar elemento alvo
        const targetElement = element && 'current' in element
            ? element.current
            : element || window;

        // Verificar se elemento suporta addEventListener
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        // Criar event listener que chama a versão mais recente do handler
        const eventListener: EventListener = (event) => {
            savedHandler.current?.(event as WindowEventMap[K]);
        };

        // Adicionar event listener
        targetElement.addEventListener(eventName, eventListener, options);

        // Cleanup: remover event listener
        return () => {
            targetElement.removeEventListener(eventName, eventListener, options);
        };
    }, [eventName, element, options]);
}

/**
* Hook para event listener em documento
* ✅ CORREÇÃO: Usar DocumentEventMap ao invés de WindowEventMap
*/
export function useDocumentEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
): void {
    // ✅ CORREÇÃO: Passar undefined como valor inicial
    const savedHandler = useRef<(event: DocumentEventMap[K]) => void | undefined>(undefined);

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const eventListener: EventListener = (event) => {
            savedHandler.current?.(event as DocumentEventMap[K]);
        };

        document.addEventListener(eventName, eventListener, options);

        return () => {
            document.removeEventListener(eventName, eventListener, options);
        };
    }, [eventName, options]);
}

/**
* Hook para detectar clique fora de elemento
*/
export function useClickAway<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    callback: (event: MouseEvent | TouchEvent) => void
): void {
    const savedCallback = useRef<((event: MouseEvent | TouchEvent) => void) | undefined>(undefined);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClick = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                savedCallback.current?.(event);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [ref]);
}

/**
* Hook para detectar antes de fechar página
*/
export function useBeforeUnload(
    callback: (event: BeforeUnloadEvent) => void,
    enabled: boolean = true
): void {
    const savedCallback = useRef<((event: BeforeUnloadEvent) => void) | undefined>(undefined);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            savedCallback.current?.(event);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [enabled]);
}

/**
* Hook para detectar mudança de visibilidade da página
* ✅ CORREÇÃO: Usar useDocumentEventListener ao invés de useEventListener
*/
export function useVisibilityChange(callback: () => void): void {
    useDocumentEventListener('visibilitychange', callback);
}

/**
* Hook para detectar quando página fica visível
*/
export function usePageVisible(callback: () => void): void {
    const savedCallback = useRef<(() => void) | undefined>(undefined);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                savedCallback.current?.();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
}

/**
* Hook para detectar quando página fica oculta
*/
export function usePageHidden(callback: () => void): void {
    const savedCallback = useRef<(() => void) | undefined>(undefined);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                savedCallback.current?.();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
}

/**
* Hook para detectar mudança de foco da janela
*/
export function useWindowFocus(
    onFocus?: () => void,
    onBlur?: () => void
): boolean {
    const [isFocused, setIsFocused] = useState(
        typeof document !== 'undefined' ? document.hasFocus() : true
    );

    const onFocusRef = useRef<(() => void) | undefined>(undefined);
    const onBlurRef = useRef<(() => void) | undefined>(undefined);

    useEffect(() => {
        onFocusRef.current = onFocus;
        onBlurRef.current = onBlur;
    }, [onFocus, onBlur]);

    useEffect(() => {
        const handleFocus = () => {
            setIsFocused(true);
            onFocusRef.current?.();
        };

        const handleBlur = () => {
            setIsFocused(false);
            onBlurRef.current?.();
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return isFocused;
}

/**
* Hook para detectar resize de elemento
*/
export function useResizeObserver<T extends HTMLElement = HTMLElement>(
    callback: (entry: ResizeObserverEntry) => void
): RefObject<T> {
    const ref = useRef<T>(null);
    const savedCallback = useRef<((entry: ResizeObserverEntry) => void) | undefined>(undefined);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const element = ref.current;
        if (!element || typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver((entries) => {
            savedCallback.current?.(entries[0]);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return ref;
}

/**
* Hook para detectar quando elemento entra na viewport
*/
export function useOnScreen<T extends HTMLElement = HTMLElement>(
    options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
    const ref = useRef<T>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOnScreen(entry.isIntersecting);
            },
            options
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return [ref, isOnScreen];
}