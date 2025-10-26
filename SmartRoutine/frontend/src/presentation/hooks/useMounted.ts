import { useEffect, useRef, useCallback } from 'react';

/**
* Hook para verificar se componente está montado
* Útil para evitar setState em componente desmontado
*/
export function useMounted(): () => boolean {
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    return useCallback(() => mountedRef.current, []);
}