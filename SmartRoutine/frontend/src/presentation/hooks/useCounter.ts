import { useState, useCallback } from 'react';

/**
* Opções do counter
*/
export interface UseCounterOptions {
    min?: number;
    max?: number;
    step?: number;
}

/**
* Hook para contador
*/
export function useCounter(initialValue: number = 0, options: UseCounterOptions = {}) {
    const { min, max, step = 1 } = options;
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount(c => {
            const newValue = c + step;
            if (max !== undefined && newValue > max) return c;
            return newValue;
        });
    }, [step, max]);

    const decrement = useCallback(() => {
        setCount(c => {
            const newValue = c - step;
            if (min !== undefined && newValue < min) return c;
            return newValue;
        });
    }, [step, min]);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    const set = useCallback((value: number) => {
        setCount(value);
    }, []);

    return {
        count,
        increment,
        decrement,
        reset,
        set
    };
}