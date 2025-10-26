import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Filtrar Receitas por Ingrediente
* 
* Responsabilidade:
* - Buscar receitas por ingrediente
* - Buscar por múltiplos ingredientes
* - Match de ingredientes disponíveis
*/
export class FilterRecipesByIngredientUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Busca receitas por ingrediente
     * 
     * @param ingrediente - Nome do ingrediente
     * @returns Promise<Recipe[]> - Receitas que contêm o ingrediente
     */
    async execute(ingrediente: string): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!ingrediente || ingrediente.trim().length === 0) {
                throw AppError.badRequest('Ingrediente é obrigatório');
            }

            if (ingrediente.trim().length < 2) {
                throw AppError.badRequest('Nome do ingrediente deve ter pelo menos 2 caracteres');
            }

            return await this.recipeRepository.findByIngredient(ingrediente);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no FilterRecipesByIngredientUseCase:', error);
            throw AppError.internal('Erro ao filtrar receitas por ingrediente');
        }
    }

    /**
     * Busca receitas que contêm TODOS os ingredientes (AND)
     * 
     * @param ingredientes - Array de ingredientes
     * @returns Promise<Recipe[]> - Receitas com todos os ingredientes
     */
    async executeByAllIngredients(ingredientes: string[]): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!ingredientes || ingredientes.length === 0) {
                throw AppError.badRequest('Lista de ingredientes é obrigatória');
            }

            const ingredientesNormalizados = ingredientes
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0);

            if (ingredientesNormalizados.length === 0) {
                throw AppError.badRequest('Ingredientes não podem ser vazios');
            }

            return await this.recipeRepository.findByIngredients(ingredientesNormalizados, true);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar por todos os ingredientes');
        }
    }

    /**
     * Busca receitas que contêm ALGUM dos ingredientes (OR)
     * 
     * @param ingredientes - Array de ingredientes
     * @returns Promise<Recipe[]> - Receitas com pelo menos um ingrediente
     */
    async executeByAnyIngredient(ingredientes: string[]): Promise<Recipe[]> {
        try {
            if (!ingredientes || ingredientes.length === 0) {
                throw AppError.badRequest('Lista de ingredientes é obrigatória');
            }

            const ingredientesNormalizados = ingredientes
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0);

            return await this.recipeRepository.findByIngredients(ingredientesNormalizados, false);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar por qualquer ingrediente');
        }
    }

    /**
     * Busca ingredientes mais comuns nas receitas
     */
    async executeMostCommonIngredients(limit: number = 20): Promise<Array<{
        ingrediente: string;
        count: number;
        percentual: number;
    }>> {
        try {
            const allRecipes = await this.recipeRepository.findAll();
            const totalRecipes = allRecipes.length;

            if (totalRecipes === 0) return [];

            const ingredientMap = new Map<string, number>();

            allRecipes.forEach(recipe => {
                recipe.ingredientes.forEach(ing => {
                    const normalized = ing.toLowerCase().trim();
                    ingredientMap.set(normalized, (ingredientMap.get(normalized) || 0) + 1);
                });
            });

            return Array.from(ingredientMap.entries())
                .map(([ingrediente, count]) => ({
                    ingrediente,
                    count,
                    percentual: Math.round((count / totalRecipes) * 100)
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, limit);
        } catch (error) {
            throw AppError.internal('Erro ao buscar ingredientes mais comuns');
        }
    }

    /**
     * Sugere ingredientes baseados em busca parcial
     */
    async suggestIngredients(termo: string, limit: number = 10): Promise<string[]> {
        try {
            if (termo.trim().length < 2) return [];

            const allRecipes = await this.recipeRepository.findAll();
            const ingredientSet = new Set<string>();

            allRecipes.forEach(recipe => {
                recipe.ingredientes.forEach(ing => {
                    if (ing.toLowerCase().includes(termo.toLowerCase())) {
                        ingredientSet.add(ing);
                    }
                });
            });

            return Array.from(ingredientSet).slice(0, limit);
        } catch (error) {
            return [];
        }
    }

    /**
     * Agrupa receitas por ingrediente principal
     */
    async executeGroupedByMainIngredient(): Promise<Map<string, Recipe[]>> {
        try {
            const allRecipes = await this.recipeRepository.findAll();
            const grouped = new Map<string, Recipe[]>();

            allRecipes.forEach(recipe => {
                // Considera o primeiro ingrediente como principal
                if (recipe.ingredientes.length > 0) {
                    const mainIngredient = recipe.ingredientes[0].toLowerCase();
                    const recipes = grouped.get(mainIngredient) || [];
                    recipes.push(recipe);
                    grouped.set(mainIngredient, recipes);
                }
            });

            return grouped;
        } catch (error) {
            throw AppError.internal('Erro ao agrupar por ingrediente principal');
        }
    }
}