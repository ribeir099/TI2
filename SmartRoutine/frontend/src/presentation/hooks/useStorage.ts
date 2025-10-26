import { useState, useEffect, useCallback } from 'react';
import { LocalStorage } from '@/infrastructure/storage/LocalStorage';
import { SessionStorage } from '@/infrastructure/storage';

/**
* Hook para usar localStorage de forma reativa
*/
export function useLocalStorage<T>(
 key: string,
 initialValue: T,
 options?: { expiresIn?: number }
): [T, (value: T) => void, () => void] {
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
 const setValue = useCallback((value: T) => {
   try {
     setStoredValue(value);
     localStorage.set(key, value, options);
   } catch (error) {
     console.error('Erro ao salvar no localStorage:', error);
   }
 }, [key, options]);

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

/**
* Hook para usar sessionStorage
*/
export function useSessionStorage<T>(
 key: string,
 initialValue: T
): [T, (value: T) => void, () => void] {
 const sessionStorage = new SessionStorage();

 const [storedValue, setStoredValue] = useState<T>(() => {
   try {
     const item = sessionStorage.get<T>(key);
     return item !== null ? item : initialValue;
   } catch (error) {
     return initialValue;
   }
 });

 const setValue = useCallback((value: T) => {
   try {
     setStoredValue(value);
     sessionStorage.set(key, value);
   } catch (error) {
     console.error('Erro ao salvar no sessionStorage:', error);
   }
 }, [key]);

 const removeValue = useCallback(() => {
   try {
     sessionStorage.remove(key);
     setStoredValue(initialValue);
   } catch (error) {
     console.error('Erro ao remover do sessionStorage:', error);
   }
 }, [key, initialValue]);

 return [storedValue, setValue, removeValue];
}