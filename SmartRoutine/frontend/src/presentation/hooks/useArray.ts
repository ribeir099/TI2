import { useState, useCallback } from 'react';

/**
* Hook para gerenciar arrays
*/
export function useArray<T>(initialValue: T[] = []) {
    const [array, setArray] = useState<T[]>(initialValue);

    const push = useCallback((element: T) => {
        setArray(prev => [...prev, element]);
    }, []);

    const filter = useCallback((callback: (item: T, index: number) => boolean) => {
        setArray(prev => prev.filter(callback));
    }, []);

    const update = useCallback((index: number, element: T) => {
        setArray(prev => [
            ...prev.slice(0, index),
            element,
            ...prev.slice(index + 1)
        ]);
    }, []);

    const remove = useCallback((index: number) => {
        setArray(prev => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1)
        ]);
    }, []);

    const clear = useCallback(() => {
        setArray([]);
    }, []);

    const set = useCallback((newArray: T[]) => {
        setArray(newArray);
    }, []);

    return {
        array,
        set,
        push,
        filter,
        update,
        remove,
        clear,
        isEmpty: array.length === 0,
        length: array.length
    };
}