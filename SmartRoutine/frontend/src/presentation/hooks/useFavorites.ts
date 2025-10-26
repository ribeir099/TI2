import { useState, useEffect, useCallback } from 'react';
import { FavoriteService } from '@/application/services/FavoriteService';
import { ReceitaFavoritaOutputDTO } from '@/application/dto/ReceitaFavoritaDTO';
import { ReceitaFavoritaRepository } from '@/infrastructure/repositories/ReceitaFavoritaRepository';
import { RecipeRepository } from '@/infrastructure/repositories/RecipeRepository';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import { AppError } from '@/shared/errors/AppError';

/**
* Hook para gerenciar receitas favoritas
*/
export const useFavorites = () => {
    const { user } = useAuth();
    const { success, error: showError } = useNotification();

    const [favorites, setFavorites] = useState<ReceitaFavoritaOutputDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Inicializar service
    const favoriteService = new FavoriteService(
        new ReceitaFavoritaRepository(apiClient),
        new RecipeRepository(apiClient)
    );

    /**
     * Carrega favoritos
     */
    const loadFavorites = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await favoriteService.getFavoritesByUserId(user.id);
            setFavorites(data);
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao carregar favoritos';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    /**
     * Adiciona aos favoritos
     */
    const addFavorite = async (receitaId: number): Promise<void> => {
        if (!user) return;

        try {
            setIsLoading(true);
            await favoriteService.addFavorite(user.id, receitaId);
            await loadFavorites();
            success('Receita adicionada aos favoritos!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao adicionar favorito';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Remove dos favoritos
     */
    const removeFavorite = async (receitaId: number): Promise<void> => {
        if (!user) return;

        try {
            setIsLoading(true);
            await favoriteService.removeFavoriteByUserAndRecipe(user.id, receitaId);
            await loadFavorites();
            success('Receita removida dos favoritos!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao remover favorito';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Toggle favorito
     */
    const toggleFavorite = async (receitaId: number): Promise<void> => {
        if (!user) return;

        try {
            setIsLoading(true);
            const result = await favoriteService.toggleFavorite(user.id, receitaId);
            await loadFavorites();
            success(result.message);
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao alternar favorito';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Verifica se é favorita
     */
    const isFavorite = useCallback((receitaId: number): boolean => {
        return favorites.some(fav => fav.receitaId === receitaId);
    }, [favorites]);

    /**
     * Conta favoritos
     */
    const favoriteCount = favorites.length;

    // Carregar favoritos ao montar
    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    return {
        favorites,
        favoriteCount,
        isLoading,
        error,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        refreshFavorites: loadFavorites
    };
};