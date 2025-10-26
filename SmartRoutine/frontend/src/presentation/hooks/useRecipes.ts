import { useState, useEffect, useCallback } from 'react';
import { RecipeService } from '@/application/services/RecipeService';
import {
    RecipeOutputDTO,
    CreateRecipeInputDTO,
    UpdateRecipeInputDTO,
    RecipeWithMatchDTO
} from '@/application/dto/RecipeDTO';
import { RecipeRepository } from '@/infrastructure/repositories/RecipeRepository';
import { FoodItemRepository } from '@/infrastructure/repositories/FoodItemRepository';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import { AppError } from '@/shared/errors/AppError';

/**
* Hook para gerenciar receitas
*/
export const useRecipes = () => {
    const { user } = useAuth();
    const { success, error: showError } = useNotification();

    const [recipes, setRecipes] = useState<RecipeOutputDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Inicializar service
    const recipeService = new RecipeService(
        new RecipeRepository(apiClient)
    );

    /**
     * Carrega receitas
     */
    const loadRecipes = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao carregar receitas';
            setError(message);
            showError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Adiciona receita
     */
    const addRecipe = async (data: CreateRecipeInputDTO): Promise<void> => {
        try {
            setIsLoading(true);
            await recipeService.createRecipe(data);
            await loadRecipes();
            success('Receita adicionada com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao adicionar receita';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Atualiza receita
     */
    const updateRecipe = async (id: number, data: UpdateRecipeInputDTO): Promise<void> => {
        try {
            setIsLoading(true);
            await recipeService.updateRecipe(id, data);
            await loadRecipes();
            success('Receita atualizada com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao atualizar receita';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deleta receita
     */
    const deleteRecipe = async (id: number): Promise<void> => {
        try {
            setIsLoading(true);
            await recipeService.deleteRecipe(id);
            await loadRecipes();
            success('Receita removida com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao remover receita';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Busca receitas por match
     */
    const getRecipesWithMatch = useCallback(async (): Promise<RecipeWithMatchDTO[]> => {
        if (!user) return [];

        try {
            return await recipeService.getRecipesWithMatch(user.id);
        } catch (err) {
            return [];
        }
    }, [user]);

    /**
     * Busca receitas por título
     */
    const searchRecipes = async (query: string): Promise<RecipeOutputDTO[]> => {
        try {
            return await recipeService.searchRecipes(query);
        } catch (err) {
            return [];
        }
    };

    // Carregar receitas ao montar
    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const favoriteRecipes = recipes.filter(recipe => recipe.isFavorita);

    return {
        recipes,
        favoriteRecipes,
        isLoading,
        error,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        searchRecipes,
        getRecipesWithMatch,
        refreshRecipes: loadRecipes
    };
};