import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Receita similar com score
*/
export interface SimilarRecipeResult {
    recipe: Recipe;
    similarityScore: number;
    matchingTags: string[];
    matchingIngredients: string[];
    reason: string;
}

/**
* Use Case: Obter Receitas Similares
* 
* Responsabilidade:
* - Recomendar receitas baseadas nos favoritos do usuário
* - Calcular similaridade entre receitas
* - Análise de tags e ingredientes
*/
export class GetSimilarRecipesUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly recipeRepository: IRecipeRepository
    ) { }

    /**
     * Busca receitas similares aos favoritos do usuário
     * 
     * @param usuarioId - ID do usuário
     * @param limit - Limite de resultados
     * @returns Promise<number[]> - IDs de receitas similares
     */
    async execute(usuarioId: string, limit: number = 10): Promise<number[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            if (limit <= 0) {
                throw AppError.badRequest('Limite deve ser maior que zero');
            }

            return await this.favoritaRepository.findSimilarRecipes(usuarioId, limit);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetSimilarRecipesUseCase:', error);
            throw AppError.internal('Erro ao buscar receitas similares');
        }
    }

    /**
     * Busca receitas similares com detalhes e score
     * 
     * @param usuarioId - ID do usuário
     * @param limit - Limite de resultados
     * @returns Promise<SimilarRecipeResult[]> - Receitas com score de similaridade
     */
    async executeWithDetails(usuarioId: string, limit: number = 10): Promise<SimilarRecipeResult[]> {
        try {
            // Buscar favoritos do usuário
            const favoritas = await this.favoritaRepository.findByUserId(usuarioId);

            if (favoritas.length === 0) {
                return [];
            }

            // Buscar receitas favoritas completas
            const favoritasIds = favoritas.map(f => f.receitaId);
            const receitasFavoritas = await Promise.all(
                favoritasIds.map(id => this.recipeRepository.findById(id))
            );

            const receitasFavoritasValidas = receitasFavoritas.filter(r => r !== null) as Recipe[];

            // Extrair tags e ingredientes dos favoritos
            const allTags = new Set<string>();
            const allIngredients = new Set<string>();

            receitasFavoritasValidas.forEach(recipe => {
                recipe.tags?.forEach(tag => allTags.add(tag.toLowerCase()));
                recipe.ingredientes.forEach(ing => allIngredients.add(ing.toLowerCase()));
            });

            // Buscar todas as receitas (exceto favoritas)
            const todasReceitas = await this.recipeRepository.findAll();
            const receitasNaoFavoritas = todasReceitas.filter(
                recipe => !favoritasIds.includes(recipe.id)
            );

            // Calcular score de similaridade para cada receita
            const recipesWithScore: SimilarRecipeResult[] = receitasNaoFavoritas.map(recipe => {
                const score = this.calculateSimilarityScore(
                    recipe,
                    allTags,
                    allIngredients
                );

                const matchingTags = recipe.tags?.filter(tag =>
                    allTags.has(tag.toLowerCase())
                ) || [];

                const matchingIngredients = recipe.ingredientes.filter(ing =>
                    Array.from(allIngredients).some(favIng =>
                        ing.toLowerCase().includes(favIng) || favIng.includes(ing.toLowerCase())
                    )
                );

                let reason = '';
                if (matchingTags.length > 0 && matchingIngredients.length > 0) {
                    reason = `Combina tags e ingredientes dos seus favoritos`;
                } else if (matchingTags.length > 0) {
                    reason = `Tem tags similares: ${matchingTags.slice(0, 2).join(', ')}`;
                } else if (matchingIngredients.length > 0) {
                    reason = `Usa ingredientes que você gosta`;
                } else {
                    reason = 'Receita popular entre usuários similares';
                }

                return {
                    recipe,
                    similarityScore: score,
                    matchingTags,
                    matchingIngredients,
                    reason
                };
            });

            // Ordenar por score e retornar top N
            return recipesWithScore
                .sort((a, b) => b.similarityScore - a.similarityScore)
                .slice(0, limit);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetSimilarRecipesUseCase (with details):', error);
            throw AppError.internal('Erro ao buscar receitas similares detalhadas');
        }
    }

    /**
     * Busca receitas que outros usuários com gostos similares favoritaram
     */
    async getCollaborativeRecommendations(
        usuarioId: string,
        limit: number = 10
    ): Promise<number[]> {
        try {
            // Buscar favoritos do usuário
            const meusFavoritos = await this.favoritaRepository.findRecipeIdsByUserId(usuarioId);

            if (meusFavoritos.length === 0) {
                // Se não tem favoritos, retornar mais populares
                const popular = await this.favoritaRepository.findMostFavorited(limit);
                return popular.map(p => p.receitaId);
            }

            // Buscar usuários que favoritaram as mesmas receitas
            const usuariosSimilares = new Map<string, number>();

            for (const receitaId of meusFavoritos) {
                const usuariosQueFavoritaram = await this.favoritaRepository.findByRecipeId(receitaId);

                usuariosQueFavoritaram.forEach(fav => {
                    if (fav.usuarioId !== usuarioId) {
                        const count = usuariosSimilares.get(fav.usuarioId) || 0;
                        usuariosSimilares.set(fav.usuarioId, count + 1);
                    }
                });
            }

            // Ordenar usuários por similaridade
            const usuariosOrdenados = Array.from(usuariosSimilares.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10) // Top 10 usuários mais similares
                .map(([userId]) => userId);

            // Buscar receitas que esses usuários favoritaram
            const receitasRecomendadas = new Map<number, number>();

            for (const userId of usuariosOrdenados) {
                const favoritosDoUsuario = await this.favoritaRepository.findRecipeIdsByUserId(userId);

                favoritosDoUsuario.forEach(receitaId => {
                    // Não recomendar receitas que já são favoritas
                    if (!meusFavoritos.includes(receitaId)) {
                        const count = receitasRecomendadas.get(receitaId) || 0;
                        receitasRecomendadas.set(receitaId, count + 1);
                    }
                });
            }

            // Ordenar por frequência e retornar top N
            return Array.from(receitasRecomendadas.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([receitaId]) => receitaId);
        } catch (error) {
            console.error('Erro no GetSimilarRecipesUseCase (collaborative):', error);
            return [];
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Calcula score de similaridade (0-100)
     */
    private calculateSimilarityScore(
        recipe: Recipe,
        favoriteTags: Set<string>,
        favoriteIngredients: Set<string>
    ): number {
        let score = 0;
        let maxScore = 0;

        // Score baseado em tags (peso 40)
        if (recipe.tags && recipe.tags.length > 0) {
            const matchingTags = recipe.tags.filter(tag =>
                favoriteTags.has(tag.toLowerCase())
            ).length;

            const tagScore = (matchingTags / recipe.tags.length) * 40;
            score += tagScore;
            maxScore += 40;
        }

        // Score baseado em ingredientes (peso 40)
        if (recipe.ingredientes.length > 0) {
            const matchingIngredients = recipe.ingredientes.filter(ing =>
                Array.from(favoriteIngredients).some(favIng =>
                    ing.toLowerCase().includes(favIng) || favIng.includes(ing.toLowerCase())
                )
            ).length;

            const ingredientScore = (matchingIngredients / recipe.ingredientes.length) * 40;
            score += ingredientScore;
            maxScore += 40;
        }

        // Score baseado em tempo de preparo similar (peso 20)
        // Assumir que usuário gosta de receitas com tempo similar
        maxScore += 20;
        score += 10; // Score neutro

        return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    }
}