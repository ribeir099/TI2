import { IRecipeRepository, RecipeFilters } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Filtrar Receitas com Filtros Complexos
* 
* Responsabilidade:
* - Aplicar múltiplos filtros simultaneamente
* - Busca avançada
* - Combinação de critérios
*/
export class FilterRecipesByFiltersUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Filtra receitas com múltiplos critérios
     * 
     * @param filters - Filtros a serem aplicados
     * @returns Promise<Recipe[]> - Receitas filtradas
     */
    async execute(filters: RecipeFilters): Promise<Recipe[]> {
        try {
            // Validar filtros
            this.validateFilters(filters);

            return await this.recipeRepository.findByFilters(filters);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no FilterRecipesByFiltersUseCase:', error);
            throw AppError.internal('Erro ao filtrar receitas');
        }
    }

    /**
     * Conta receitas que atendem aos filtros
     */
    async count(filters: RecipeFilters): Promise<number> {
        try {
            const recipes = await this.execute(filters);
            return recipes.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Verifica se há receitas que atendem aos filtros
     */
    async hasResults(filters: RecipeFilters): Promise<boolean> {
        try {
            const count = await this.count(filters);
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém sugestões de ajuste de filtros (se sem resultados)
     */
    async suggestFilterAdjustments(filters: RecipeFilters): Promise<{
        hasResults: boolean;
        suggestions: string[];
    }> {
        try {
            const hasResults = await this.hasResults(filters);

            if (hasResults) {
                return { hasResults: true, suggestions: [] };
            }

            const suggestions: string[] = [];

            // Sugerir relaxar tempo
            if (filters.tempoPreparoMax && filters.tempoPreparoMax < 30) {
                suggestions.push('Tente aumentar o tempo máximo de preparo');
            }

            // Sugerir relaxar calorias
            if (filters.caloriasMax && filters.caloriasMax < 300) {
                suggestions.push('Tente aumentar o limite de calorias');
            }

            // Sugerir menos tags
            if (filters.tags && filters.tags.length > 3) {
                suggestions.push('Tente usar menos tags para busca mais ampla');
            }

            // Sugerir menos ingredientes
            if (filters.ingredientes && filters.ingredientes.length > 5) {
                suggestions.push('Tente buscar com menos ingredientes');
            }

            if (suggestions.length === 0) {
                suggestions.push('Tente relaxar alguns filtros ou buscar com critérios diferentes');
            }

            return { hasResults: false, suggestions };
        } catch (error) {
            return { hasResults: false, suggestions: ['Erro ao buscar sugestões'] };
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Valida filtros
     */
    private validateFilters(filters: RecipeFilters): void {
        if (!filters || Object.keys(filters).length === 0) {
            throw AppError.badRequest('Pelo menos um filtro deve ser fornecido');
        }

        // Validar tempos
        if (filters.tempoPreparoMin !== undefined && filters.tempoPreparoMin < 0) {
            throw AppError.badRequest('Tempo mínimo não pode ser negativo');
        }

        if (filters.tempoPreparoMax !== undefined && filters.tempoPreparoMax < 0) {
            throw AppError.badRequest('Tempo máximo não pode ser negativo');
        }

        if (
            filters.tempoPreparoMin !== undefined &&
            filters.tempoPreparoMax !== undefined &&
            filters.tempoPreparoMin > filters.tempoPreparoMax
        ) {
            throw AppError.badRequest('Tempo mínimo não pode ser maior que máximo');
        }

        // Validar calorias
        if (filters.caloriasMin !== undefined && filters.caloriasMin < 0) {
            throw AppError.badRequest('Calorias mínimas não podem ser negativas');
        }

        if (filters.caloriasMax !== undefined && filters.caloriasMax < 0) {
            throw AppError.badRequest('Calorias máximas não podem ser negativas');
        }

        if (
            filters.caloriasMin !== undefined &&
            filters.caloriasMax !== undefined &&
            filters.caloriasMin > filters.caloriasMax
        ) {
            throw AppError.badRequest('Calorias mínimas não podem ser maiores que máximas');
        }
    }
}