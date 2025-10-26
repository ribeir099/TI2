import { useState, useMemo, useCallback } from 'react';

/**
* Opções de paginação
*/
export interface PaginationOptions {
    initialPage?: number;
    initialLimit?: number;
    totalItems: number;
}

/**
* Resultado do hook de paginação
*/
export interface UsePaginationResult {
    // Estado atual
    page: number;
    limit: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;

    // Ações
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    setLimit: (limit: number) => void;

    // Utilitários
    getPaginatedItems: <T>(items: T[]) => T[];
}

/**
* Hook para paginação
*/
export function usePagination(options: PaginationOptions): UsePaginationResult {
    const { initialPage = 1, initialLimit = 20, totalItems } = options;

    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    // Cálculos
    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / limit);
    }, [totalItems, limit]);

    const startIndex = useMemo(() => {
        return (page - 1) * limit;
    }, [page, limit]);

    const endIndex = useMemo(() => {
        return Math.min(startIndex + limit, totalItems);
    }, [startIndex, limit, totalItems]);

    const hasNext = page < totalPages;
    const hasPrevious = page > 1;
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    // Ações
    const goToPage = useCallback((newPage: number) => {
        const validPage = Math.max(1, Math.min(newPage, totalPages));
        setPage(validPage);
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (hasNext) {
            setPage(p => p + 1);
        }
    }, [hasNext]);

    const previousPage = useCallback(() => {
        if (hasPrevious) {
            setPage(p => p - 1);
        }
    }, [hasPrevious]);

    const goToFirstPage = useCallback(() => {
        setPage(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setPage(totalPages);
    }, [totalPages]);

    const updateLimit = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset para primeira página
    }, []);

    // Utilitário para paginar array
    const getPaginatedItems = useCallback(<T,>(items: T[]): T[] => {
        return items.slice(startIndex, endIndex);
    }, [startIndex, endIndex]);

    // Ajustar página se exceder total de páginas
    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return {
        page,
        limit,
        totalPages,
        startIndex,
        endIndex,
        hasNext,
        hasPrevious,
        isFirstPage,
        isLastPage,
        goToPage,
        nextPage,
        previousPage,
        goToFirstPage,
        goToLastPage,
        setLimit: updateLimit,
        getPaginatedItems
    };
}