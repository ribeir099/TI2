import { useState, useEffect, useCallback } from 'react';
import { FoodItem } from '@/domain/entities/FoodItem';
import { FoodService } from '@/application/services/FoodService';
import {
    FoodItemOutputDTO,
    FoodItemStatisticsDTO,
    CreateFoodItemInputDTO,
    UpdateFoodItemInputDTO
} from '@/application/dto/FoodItemDTO';
import { FoodItemRepository } from '@/infrastructure/repositories/FoodItemRepository';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import { AppError } from '@/shared/errors/AppError';

/**
* Hook para gerenciar itens de alimentos
*/
export const useFoodItems = () => {
    const { user } = useAuth();
    const { success, error: showError } = useNotification();

    const [foodItems, setFoodItems] = useState<FoodItemOutputDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Inicializar service
    const foodService = new FoodService(
        new FoodItemRepository(apiClient)
    );

    /**
     * Carrega itens de alimentos
     */
    const loadFoodItems = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            setError(null);
            const items = await foodService.getFoodItemsByUserId(user.id);
            setFoodItems(items);
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao carregar alimentos';
            setError(message);
            showError(message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    /**
     * Adiciona item
     */
    const addFoodItem = async (data: CreateFoodItemInputDTO): Promise<void> => {
        try {
            setIsLoading(true);
            await foodService.addFoodItem({ ...data, usuarioId: user!.id });
            await loadFoodItems();
            success('Alimento adicionado com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao adicionar alimento';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Atualiza item
     */
    const updateFoodItem = async (id: number, data: UpdateFoodItemInputDTO): Promise<void> => {
        try {
            setIsLoading(true);
            await foodService.updateFoodItem(id, data);
            await loadFoodItems();
            success('Alimento atualizado com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao atualizar alimento';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deleta item
     */
    const deleteFoodItem = async (id: number): Promise<void> => {
        try {
            setIsLoading(true);
            await foodService.deleteFoodItem(id);
            await loadFoodItems();
            success('Alimento removido com sucesso!');
        } catch (err) {
            const message = err instanceof AppError ? err.message : 'Erro ao remover alimento';
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Obtém itens vencendo
     */
    const getExpiringItems = useCallback(async (dias: number = 3) => {
        if (!user) return [];

        try {
            return await foodService.getExpiringItems(user.id, dias);
        } catch (err) {
            return [];
        }
    }, [user]);

    /**
     * Obtém itens vencidos
     */
    const getExpiredItems = useCallback(async () => {
        if (!user) return [];

        try {
            return await foodService.getExpiredItems(user.id);
        } catch (err) {
            return [];
        }
    }, [user]);

    /**
     * Obtém estatísticas
     */
    const getStatistics = useCallback(async (): Promise<FoodItemStatisticsDTO | null> => {
        if (!user) return null;

        try {
            return await foodService.getFoodStatistics(user.id);
        } catch (err) {
            return null;
        }
    }, [user]);

    // Carregar itens ao montar
    useEffect(() => {
        loadFoodItems();
    }, [loadFoodItems]);

    // Filtrar itens
    const filteredFoodItems = foodService.searchByName(
        foodService.filterByCategory(foodItems, filterCategory),
        searchTerm
    );

    const expiringItems = foodItems.filter(item => item.isVencendoEmBreve);
    const expiredItems = foodItems.filter(item => item.isVencido);

    return {
        foodItems,
        filteredFoodItems,
        expiringItems,
        expiredItems,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        filterCategory,
        setFilterCategory,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        getExpiringItems,
        getExpiredItems,
        getStatistics,
        refreshFoodItems: loadFoodItems
    };
};