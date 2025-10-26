import { useMemo } from 'react';
import { apiClient } from '@/infrastructure/api';
import { RepositoryFactory } from '@/infrastructure/repositories';

/**
* Hook para obter instâncias de repositórios
*/
export const useRepositories = () => {
    const repositories = useMemo(() => {
        return RepositoryFactory.createAll(apiClient);
    }, []);

    return repositories;
};

/**
* Hook para repositório específico
*/
export const useUserRepository = () => {
    return useMemo(() => {
        return RepositoryFactory.getUserRepository(apiClient);
    }, []);
};

export const useFoodItemRepository = () => {
    return useMemo(() => {
        return RepositoryFactory.getFoodItemRepository(apiClient);
    }, []);
};

export const useRecipeRepository = () => {
    return useMemo(() => {
        return RepositoryFactory.getRecipeRepository(apiClient);
    }, []);
};

export const useReceitaFavoritaRepository = () => {
    return useMemo(() => {
        return RepositoryFactory.getReceitaFavoritaRepository(apiClient);
    }, []);
};