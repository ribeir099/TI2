import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { LocalStorage } from '@/infrastructure/storage/LocalStorage';

/**
* Hook para usar localStorage de forma reativa
* 
* @param key - Chave do storage
* @param initialValue - Valor inicial
* @param options - Opções (TTL, etc)
*/
export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    options?: { expiresIn?: number }
): [T, Dispatch<SetStateAction<T>>, () => void] {
    const localStorage = new LocalStorage();

    // State para armazenar valor
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.get<T>(key);
            return item !== null ? item : initialValue;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return initialValue;
        }
    });

    // Função para salvar
    const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
        try {
            // Permitir function como valor (igual useState)
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            localStorage.set(key, valueToStore, options);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }, [key, options, storedValue]);

    // Função para remover
    const removeValue = useCallback(() => {
        try {
            localStorage.remove(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
        }
    }, [key, initialValue]);

    // Sincronizar com mudanças de outras abas
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `smartroutine_${key}` && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setStoredValue(parsed.value);
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

    return [storedValue, setValue, removeValue];
}