import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { useDebounce } from '@/presentation/hooks/useDebounce';

/**
* Dados do contexto de busca
*/
export interface SearchContextData {
    query: string;
    debouncedQuery: string;
    isSearching: boolean;
    results: any[];
    recentSearches: string[];
    setQuery: (query: string) => void;
    setResults: (results: any[]) => void;
    clearSearch: () => void;
    addToRecent: (query: string) => void;
    clearRecent: () => void;
}

/**
* Context de Busca
*/
export const SearchContext = createContext<SearchContextData>(
    {} as SearchContextData
);

/**
* Props do Provider
*/
interface SearchProviderProps {
    children: ReactNode;
    debounceDelay?: number;
    maxRecentSearches?: number;
}

/**
* Provider de Busca Global
* 
* Responsabilidades:
* - Gerenciar estado de busca global
* - Debounce de queries
* - Histórico de buscas
*/
export const SearchProvider: React.FC<SearchProviderProps> = ({
    children,
    debounceDelay = 300,
    maxRecentSearches = 10
}) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem('recent_searches');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    });

    // Debounce da query
    const debouncedQuery = useDebounce(query, debounceDelay);

    /**
     * Atualiza query
     */
    const updateQuery = useCallback((newQuery: string) => {
        setQuery(newQuery);
        if (newQuery) {
            setIsSearching(true);
        }
    }, []);

    /**
     * Atualiza resultados
     */
    const updateResults = useCallback((newResults: any[]) => {
        setResults(newResults);
        setIsSearching(false);
    }, []);

    /**
     * Limpa busca
     */
    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        setIsSearching(false);
    }, []);

    /**
     * Adiciona ao histórico
     */
    const addToRecent = useCallback((searchQuery: string) => {
        if (!searchQuery || searchQuery.trim().length === 0) return;

        setRecentSearches(prev => {
            // Remove duplicatas e adiciona no início
            const filtered = prev.filter(q => q !== searchQuery);
            const updated = [searchQuery, ...filtered];

            // Limitar quantidade
            const limited = updated.slice(0, maxRecentSearches);

            // Salvar no localStorage
            try {
                localStorage.setItem('recent_searches', JSON.stringify(limited));
            } catch (error) {
                console.error('Erro ao salvar buscas recentes:', error);
            }

            return limited;
        });
    }, [maxRecentSearches]);

    /**
     * Limpa histórico
     */
    const clearRecent = useCallback(() => {
        setRecentSearches([]);
        try {
            localStorage.removeItem('recent_searches');
        } catch (error) {
            console.error('Erro ao limpar buscas recentes:', error);
        }
    }, []);

    const value: SearchContextData = {
        query,
        debouncedQuery,
        isSearching,
        results,
        recentSearches,
        setQuery: updateQuery,
        setResults: updateResults,
        clearSearch,
        addToRecent,
        clearRecent
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};