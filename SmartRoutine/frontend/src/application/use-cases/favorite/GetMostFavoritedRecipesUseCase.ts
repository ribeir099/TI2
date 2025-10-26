import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { RecipeWithFavoriteCountDTO, FavoriteRankingDTO } from '@/application/dto/ReceitaFavoritaDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Receitas Mais Favoritadas
* 
* Responsabilidade:
* - Listar receitas mais populares (mais favoritadas)
* - Gerar ranking de receitas
* - Calcular popularidade
*/
export class GetMostFavoritedRecipesUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Lista receitas mais favoritadas
     * 
     * @param limit - Limite de resultados
     * @returns Promise<RecipeWithFavoriteCountDTO[]> - Receitas com contagem
     */
    async execute(limit: number = 10): Promise<RecipeWithFavoriteCountDTO[]> {
        try {
            // Validar limite
            if (limit <= 0) {
                throw AppError.badRequest('Limite deve ser maior que zero');
            }

            if (limit > 100) {
                throw AppError.badRequest('Limite máximo é 100');
            }

            return await this.favoritaRepository.findMostFavorited(limit);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetMostFavoritedRecipesUseCase:', error);
            throw AppError.internal('Erro ao buscar receitas mais favoritadas');
        }
    }

    /**
     * Gera ranking completo de receitas
     * 
     * @param limit - Limite de resultados
     * @returns Promise<FavoriteRankingDTO[]> - Ranking com detalhes
     */
    async executeRanking(limit: number = 10): Promise<FavoriteRankingDTO[]> {
        try {
            const mostFavorited = await this.execute(limit);

            if (mostFavorited.length === 0) {
                return [];
            }

            // Calcular total de favoritos
            const totalFavoritos = mostFavorited.reduce(
                (sum, recipe) => sum + recipe.totalFavoritos,
                0
            );

            // Gerar ranking
            return mostFavorited.map((recipe, index) => ({
                posicao: index + 1,
                receitaId: recipe.receitaId,
                tituloReceita: recipe.tituloReceita,
                totalFavoritos: recipe.totalFavoritos,
                percentual: Math.round((recipe.totalFavoritos / totalFavoritos) * 100),
                tendencia: this.calculateTrend(index, mostFavorited.length)
            }));
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.internal('Erro ao gerar ranking de favoritos');
        }
    }

    /**
     * Busca top N receitas mais favoritadas
     */
    async getTopRecipes(n: number = 5): Promise<RecipeWithFavoriteCountDTO[]> {
        return await this.execute(n);
    }

    /**
     * Obtém receita mais favoritada
     */
    async getMostFavorited(): Promise<RecipeWithFavoriteCountDTO | null> {
        try {
            const recipes = await this.execute(1);
            return recipes.length > 0 ? recipes[0] : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Filtra receitas com mínimo de favoritos
     */
    async executeWithMinimum(minimumFavorites: number, limit: number = 50): Promise<RecipeWithFavoriteCountDTO[]> {
        try {
            if (minimumFavorites < 0) {
                throw AppError.badRequest('Mínimo de favoritos não pode ser negativo');
            }

            const recipes = await this.execute(limit);

            return recipes.filter(recipe => recipe.totalFavoritos >= minimumFavorites);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.internal('Erro ao buscar receitas com mínimo de favoritos');
        }
    }

    /**
     * Obtém percentil de popularidade de uma receita
     */
    async getPopularityPercentile(receitaId: number): Promise<number> {
        try {
            const allRecipes = await this.execute(1000); // Buscar muitas

            const recipe = allRecipes.find(r => r.receitaId === receitaId);
            if (!recipe) return 0;

            const position = allRecipes.findIndex(r => r.receitaId === receitaId);
            const percentile = ((allRecipes.length - position) / allRecipes.length) * 100;

            return Math.round(percentile);
        } catch (error) {
            return 0;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Calcula tendência (simplificado)
     * Em produção, comparar com dados históricos
     */
    private calculateTrend(position: number, total: number): 'subindo' | 'descendo' | 'estavel' {
        // Simulação simples
        const percentile = position / total;

        if (percentile < 0.3) return 'estavel'; // Top 30%
        if (percentile < 0.7) return 'estavel';
        return 'estavel';
    }
}