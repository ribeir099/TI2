import { useState, useEffect } from 'react';

/**
* Hook para sincronizar state com localStorage entre abas
*/
export function useLocalStorageSync<T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    // Salvar no localStorage quando mudar
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }, [key, value]);

    // Sincronizar com outras abas
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Erro ao sincronizar storage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [value, setValue];
}