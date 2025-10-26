import { IRecipeRepository, RecipeSortOptions } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Receitas
* 
* Responsabilidade:
* - Listar receitas
* - Ordenar resultados
* - Paginação
*/
export class GetRecipesUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Lista todas as receitas
     * 
     * @returns Promise<Recipe[]> - Lista de receitas
     */
    async execute(): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.findAll();
        } catch (error) {
            console.error('Erro no GetRecipesUseCase:', error);
            throw AppError.internal('Erro ao listar receitas');
        }
    }

    /**
     * Busca receita por ID
     * 
     * @param id - ID da receita
     * @returns Promise<Recipe> - Receita encontrada
     * @throws AppError - Se não encontrada
     */
    async executeById(id: number): Promise<Recipe> {
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
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar receita');
        }
    }

    /**
     * Busca receita por ID ou null
     */
    async executeByIdOrNull(id: number): Promise<Recipe | null> {
        try {
            return await this.executeById(id);
        } catch (error) {
            return null;
        }
    }

    /**
     * Lista receitas com ordenação
     * 
     * @param sortOptions - Opções de ordenação
     * @returns Promise<Recipe[]> - Receitas ordenadas
     */
    async executeWithSort(sortOptions: RecipeSortOptions): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.findWithSort(sortOptions);
        } catch (error) {
            throw AppError.internal('Erro ao listar receitas ordenadas');
        }
    }

    /**
     * Lista receitas rápidas (tempo <= 30 minutos)
     * 
     * @returns Promise<Recipe[]> - Receitas rápidas
     */
    async executeQuickRecipes(): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.findQuickRecipes();
        } catch (error) {
            throw AppError.internal('Erro ao buscar receitas rápidas');
        }
    }

    /**
     * Lista receitas populares
     * 
     * @param limit - Limite de resultados
     * @returns Promise<Recipe[]> - Receitas populares
     */
    async executePopular(limit: number = 10): Promise<Recipe[]> {
        try {
            if (limit <= 0) {
                throw AppError.badRequest('Limite deve ser maior que zero');
            }

            return await this.recipeRepository.findPopular(limit);
        } catch (error) {
            throw AppError.internal('Erro ao buscar receitas populares');
        }
    }

    /**
     * Lista receitas recentes
     * 
     * @param limit - Limite de resultados
     * @returns Promise<Recipe[]> - Receitas recentes
     */
    async executeRecent(limit: number = 10): Promise<Recipe[]> {
        try {
            if (limit <= 0) {
                throw AppError.badRequest('Limite deve ser maior que zero');
            }

            return await this.recipeRepository.findRecent(limit);
        } catch (error) {
            throw AppError.internal('Erro ao buscar receitas recentes');
        }
    }

    /**
     * Conta total de receitas
     */
    async count(): Promise<number> {
        try {
            return await this.recipeRepository.count();
        } catch (error) {
            return 0;
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
     * Lista receitas por dificuldade
     */
    async executeByDifficulty(dificuldade: string): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.findByDifficulty(dificuldade);
        } catch (error) {
            throw AppError.internal('Erro ao buscar por dificuldade');
        }
    }

    /**
     * Lista receitas por tipo de refeição
     */
    async executeByMealType(tipoRefeicao: string): Promise<Recipe[]> {
        try {
            return await this.recipeRepository.findByMealType(tipoRefeicao);
        } catch (error) {
            throw AppError.internal('Erro ao buscar por tipo de refeição');
        }
    }

    /**
     * Lista receitas por faixa de calorias
     */
    async executeByCaloriesRange(min: number, max: number): Promise<Recipe[]> {
        try {
            if (min < 0 || max < 0) {
                throw AppError.badRequest('Calorias não podem ser negativas');
            }

            if (min > max) {
                throw AppError.badRequest('Mínimo não pode ser maior que máximo');
            }

            return await this.recipeRepository.findByCaloriesRange(min, max);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar por calorias');
        }
    }
}