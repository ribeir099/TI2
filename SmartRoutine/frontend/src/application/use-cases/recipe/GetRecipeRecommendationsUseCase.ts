import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Tipo de recomendação
*/
export type RecommendationType =
    | 'pantry-based'      // Baseado na despensa
    | 'favorites-based'   // Baseado em favoritos
    | 'popular'           // Receitas populares
    | 'quick'             // Receitas rápidas
    | 'seasonal';         // Receitas sazonais

/**
* Receita recomendada com razão
*/
export interface RecommendedRecipe {
    recipe: Recipe;
    score: number;
    reason: string;
    type: RecommendationType;
}

/**
* Use Case: Obter Recomendações de Receitas
* 
* Responsabilidade:
* - Gerar recomendações personalizadas
* - Combinar múltiplos algoritmos
* - Diversificar sugestões
*/
export class GetRecipeRecommendationsUseCase {
    constructor(
        private readonly recipeRepository: IRecipeRepository,
        private readonly foodItemRepository: IFoodItemRepository,
        private readonly favoritaRepository?: IReceitaFavoritaRepository
    ) { }

    /**
     * Gera recomendações personalizadas
     * 
     * @param usuarioId - ID do usuário
     * @param limit - Limite de recomendações
     * @returns Promise<RecommendedRecipe[]> - Receitas recomendadas
     */
    async execute(usuarioId: string, limit: number = 10): Promise<RecommendedRecipe[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            if (limit <= 0 || limit > 50) {
                throw AppError.badRequest('Limite deve estar entre 1 e 50');
            }

            const recommendations: RecommendedRecipe[] = [];

            // 1. Receitas baseadas na despensa (40% do limite)
            const pantryBased = await this.getPantryBasedRecommendations(
                usuarioId,
                Math.ceil(limit * 0.4)
            );
            recommendations.push(...pantryBased);

            // 2. Receitas baseadas em favoritos (30% do limite)
            if (this.favoritaRepository) {
                const favoritesBased = await this.getFavoritesBasedRecommendations(
                    usuarioId,
                    Math.ceil(limit * 0.3)
                );
                recommendations.push(...favoritesBased);
            }

            // 3. Receitas populares (20% do limite)
            const popular = await this.getPopularRecommendations(
                Math.ceil(limit * 0.2)
            );
            recommendations.push(...popular);

            // 4. Receitas rápidas (10% do limite)
            const quick = await this.getQuickRecommendations(
                Math.ceil(limit * 0.1)
            );
            recommendations.push(...quick);

            // Remover duplicatas
            const uniqueRecommendations = this.removeDuplicates(recommendations);

            // Ordenar por score e limitar
            return uniqueRecommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao gerar recomendações');
        }
    }

    /**
     * Recomendações baseadas na despensa
     */
    private async getPantryBasedRecommendations(
        usuarioId: string,
        limit: number
    ): Promise<RecommendedRecipe[]> {
        try {
            const foodItems = await this.foodItemRepository.findByUserId(usuarioId);
            const ingredientesDisponiveis = foodItems
                .filter(item => !item.isVencido())
                .map(item => item.nome);

            if (ingredientesDisponiveis.length === 0) {
                return [];
            }

            const allRecipes = await this.recipeRepository.findAll();

            return allRecipes
                .map(recipe => {
                    const percentualMatch = recipe.calcularMatchIngredientes(ingredientesDisponiveis);

                    return {
                        recipe,
                        score: percentualMatch,
                        reason: `Você tem ${percentualMatch}% dos ingredientes necessários`,
                        type: 'pantry-based' as RecommendationType
                    };
                })
                .filter(r => r.score >= 50)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        } catch (error) {
            return [];
        }
    }

    /**
     * Recomendações baseadas em favoritos
     */
    private async getFavoritesBasedRecommendations(
        usuarioId: string,
        limit: number
    ): Promise<RecommendedRecipe[]> {
        try {
            if (!this.favoritaRepository) return [];

            const similarIds = await this.favoritaRepository.findSimilarRecipes(usuarioId, limit);

            const recipes = await Promise.all(
                similarIds.map(id => this.recipeRepository.findById(id))
            );

            return recipes
                .filter((r): r is Recipe => r !== null)
                .map((recipe, index) => ({
                    recipe,
                    score: 100 - (index * 5), // Score decrescente
                    reason: 'Similar às suas receitas favoritas',
                    type: 'favorites-based' as RecommendationType
                }));
        } catch (error) {
            return [];
        }
    }

    /**
     * Recomendações populares
     */
    private async getPopularRecommendations(limit: number): Promise<RecommendedRecipe[]> {
        try {
            const popularRecipes = await this.recipeRepository.findPopular(limit);

            return popularRecipes.map((recipe, index) => ({
                recipe,
                score: 80 - (index * 3),
                reason: 'Receita popular entre usuários',
                type: 'popular' as RecommendationType
            }));
        } catch (error) {
            return [];
        }
    }

    /**
     * Recomendações rápidas
     */
    private async getQuickRecommendations(limit: number): Promise<RecommendedRecipe[]> {
        try {
            const quickRecipes = await this.recipeRepository.findQuickRecipes();

            return quickRecipes
                .slice(0, limit)
                .map((recipe, index) => ({
                    recipe,
                    score: 70 - (index * 2),
                    reason: `Pronta em apenas ${recipe.tempoFormatado}`,
                    type: 'quick' as RecommendationType
                }));
        } catch (error) {
            return [];
        }
    }

    /**
     * Remove receitas duplicadas
     */
    private removeDuplicates(recommendations: RecommendedRecipe[]): RecommendedRecipe[] {
        const seen = new Set<number>();
        const unique: RecommendedRecipe[] = [];

        recommendations.forEach(rec => {
            if (!seen.has(rec.recipe.id)) {
                seen.add(rec.recipe.id);
                unique.push(rec);
            }
        });

        return unique;
    }
}