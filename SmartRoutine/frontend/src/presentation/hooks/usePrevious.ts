import { useEffect, useRef } from 'react';

/**
* Hook para obter valor anterior
* 
* @param value - Valor atual
* @returns Valor anterior (undefined na primeira renderização)
*/
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}