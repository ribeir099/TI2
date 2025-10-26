import { useState, useCallback } from 'react';

/**
* Hook para toggle de valores booleanos
* 
* @param initialValue - Valor inicial (padrão: false)
*/
export function useToggle(initialValue: boolean = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(v => !v);
    }, []);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    return {
        value,
        toggle,
        setTrue,
        setFalse,
        setValue
    };
}

/**
* Alias mais descritivo
*/
export const useBoolean = useToggle;