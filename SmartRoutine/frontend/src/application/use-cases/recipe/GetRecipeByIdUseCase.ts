import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { RecipeDetailsDTO, RecipeDTOMapper } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Receita por ID
* 
* Responsabilidade:
* - Buscar receita específica
* - Enriquecer com dados relacionados
* - Calcular match com despensa
*/
export class GetRecipeByIdUseCase {
    constructor(
        private readonly recipeRepository: IRecipeRepository,
        private readonly favoritaRepository?: IReceitaFavoritaRepository
    ) { }

    /**
     * Busca receita por ID
     * 
     * @param id - ID da receita
     * @returns Promise<Recipe> - Receita encontrada
     * @throws AppError - Se não encontrada
     */
    async execute(id: number): Promise<Recipe> {
        try {
            if (!id || id <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            const recipe = await this.recipeRepository.findById(id);

            if (!recipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            return recipe;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetRecipeByIdUseCase:', error);
            throw AppError.internal('Erro ao buscar receita');
        }
    }

    /**
     * Busca receita com detalhes completos
     * 
     * @param id - ID da receita
     * @param ingredientesDisponiveis - Ingredientes disponíveis (opcional)
     * @returns Promise<RecipeDetailsDTO> - Detalhes completos
     */
    async executeWithDetails(
        id: number,
        ingredientesDisponiveis?: string[]
    ): Promise<RecipeDetailsDTO> {
        try {
            const recipe = await this.execute(id);

            // Buscar total de favoritos se repositório disponível
            let totalFavoritos: number | undefined;
            if (this.favoritaRepository) {
                totalFavoritos = await this.favoritaRepository.countByRecipeId(id);
            }

            return RecipeDTOMapper.toDetailsDTO(recipe, totalFavoritos, ingredientesDisponiveis);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar detalhes da receita');
        }
    }

    /**
     * Busca receita ou retorna null
     */
    async executeOrNull(id: number): Promise<Recipe | null> {
        try {
            return await this.execute(id);
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se receita existe
     */
    async exists(id: number): Promise<boolean> {
        try {
            return await this.recipeRepository.existsById(id);
        } catch (error) {
            return false;
        }
    }

    /**
     * Busca receita com informações de popularidade
     */
    async executeWithPopularity(id: number): Promise<{
        recipe: Recipe;
        totalFavoritos: number;
        ranking: number; // Posição no ranking geral
    }> {
        try {
            const recipe = await this.execute(id);

            let totalFavoritos = 0;
            let ranking = 0;

            if (this.favoritaRepository) {
                totalFavoritos = await this.favoritaRepository.countByRecipeId(id);

                // Calcular ranking (simplificado)
                const mostFavorited = await this.favoritaRepository.findMostFavorited(100);
                ranking = mostFavorited.findIndex(r => r.receitaId === id) + 1;
            }

            return {
                recipe,
                totalFavoritos,
                ranking: ranking || 0
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar com popularidade');
        }
    }
}