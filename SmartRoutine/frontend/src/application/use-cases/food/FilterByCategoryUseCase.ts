import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { FoodCategory, FoodCategoryEnum } from '@/domain/value-objects/FoodCategory';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado de filtro por categoria
*/
export interface CategoryFilterResult {
    categoria: string;
    items: FoodItem[];
    total: number;
    vencidos: number;
    vencendo: number;
    frescos: number;
}

/**
* Use Case: Filtrar Alimentos por Categoria
* 
* Responsabilidade:
* - Filtrar alimentos por categoria
* - Listar categorias disponíveis
* - Estatísticas por categoria
*/
export class FilterByCategoryUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Filtra alimentos por categoria
     * 
     * @param categoria - Nome da categoria
     * @param usuarioId - ID do usuário (opcional)
     * @returns Promise<FoodItem[]> - Alimentos da categoria
     */
    async execute(categoria: string, usuarioId?: string): Promise<FoodItem[]> {
        try {
            // Validar entrada
            if (!categoria || categoria.trim().length === 0) {
                throw AppError.badRequest('Categoria é obrigatória');
            }

            // Normalizar categoria
            const categoryVO = FoodCategory.create(categoria);

            // Buscar alimentos
            let items = await this.foodItemRepository.findByCategory(categoryVO.getValue());

            // Filtrar por usuário se fornecido
            if (usuarioId) {
                items = items.filter(item => item.usuarioId === usuarioId);
            }

            return items;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no FilterByCategoryUseCase:', error);
            throw AppError.internal('Erro ao filtrar por categoria');
        }
    }

    /**
     * Filtra com estatísticas
     * 
     * @param categoria - Nome da categoria
     * @param usuarioId - ID do usuário
     * @returns Promise<CategoryFilterResult> - Resultado com estatísticas
     */
    async executeWithStats(categoria: string, usuarioId: string): Promise<CategoryFilterResult> {
        try {
            const items = await this.execute(categoria, usuarioId);

            const vencidos = items.filter(item => item.isVencido()).length;
            const vencendo = items.filter(item => item.isVencendoEmBreve() && !item.isVencido()).length;
            const frescos = items.filter(item => item.isFresco()).length;

            return {
                categoria,
                items,
                total: items.length,
                vencidos,
                vencendo,
                frescos
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao filtrar com estatísticas');
        }
    }

    /**
     * Lista todas as categorias disponíveis
     * 
     * @returns FoodCategoryEnum[] - Array de categorias
     */
    async executeAllCategories(): Promise<FoodCategoryEnum[]> {
        return FoodCategory.all();
    }

    /**
     * Lista categorias com metadados
     */
    async executeCategoriesWithMetadata(): Promise<Array<{
        value: string;
        label: string;
        icon: string;
        color: string;
        description: string;
    }>> {
        return FoodCategory.allWithMetadata();
    }

    /**
     * Lista categorias que o usuário tem na despensa
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<string[]> - Categorias disponíveis
     */
    async executeUserCategories(usuarioId: string): Promise<string[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.getCategories(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao listar categorias do usuário');
        }
    }

    /**
     * Agrupa todos os alimentos por categoria
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<Map<string, FoodItem[]>> - Map de categoria → items
     */
    async executeGroupAll(usuarioId: string): Promise<Map<string, FoodItem[]>> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            const items = await this.foodItemRepository.findByUserId(usuarioId);

            const grouped = new Map<string, FoodItem[]>();

            items.forEach(item => {
                const categoryItems = grouped.get(item.categoria) || [];
                categoryItems.push(item);
                grouped.set(item.categoria, categoryItems);
            });

            return grouped;
        } catch (error) {
            throw AppError.internal('Erro ao agrupar alimentos');
        }
    }

    /**
     * Conta alimentos por categoria
     */
    async executeCategoryCount(usuarioId: string): Promise<Record<string, number>> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.countByCategory(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao contar por categoria');
        }
    }

    /**
     * Verifica se categoria existe na despensa do usuário
     */
    async hasCategoryInPantry(usuarioId: string, categoria: string): Promise<boolean> {
        try {
            const categories = await this.executeUserCategories(usuarioId);
            return categories.some(cat => cat.toLowerCase() === categoria.toLowerCase());
        } catch (error) {
            return false;
        }
    }
}