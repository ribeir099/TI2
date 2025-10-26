import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Filtrar Receitas por Tempo
* 
* Responsabilidade:
* - Filtrar receitas por tempo de preparo
* - Categorizar por velocidade
*/
export class FilterRecipesByTimeUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Busca receitas com tempo máximo
     * 
     * @param tempoMaximo - Tempo máximo em minutos
     * @returns Promise<Recipe[]> - Receitas que levam até o tempo especificado
     */
    async execute(tempoMaximo: number): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!tempoMaximo || tempoMaximo <= 0) {
                throw AppError.badRequest('Tempo máximo deve ser maior que zero');
            }

            if (tempoMaximo > 1440) { // 24 horas
                throw AppError.badRequest('Tempo máximo muito longo (máximo 24 horas)');
            }

            return await this.recipeRepository.findByMaxTime(tempoMaximo);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no FilterRecipesByTimeUseCase:', error);
            throw AppError.internal('Erro ao filtrar receitas por tempo');
        }
    }

    /**
     * Busca receitas por faixa de tempo
     * 
     * @param tempoMinimo - Tempo mínimo em minutos
     * @param tempoMaximo - Tempo máximo em minutos
     * @returns Promise<Recipe[]> - Receitas na faixa
     */
    async executeByRange(tempoMinimo: number, tempoMaximo: number): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (tempoMinimo < 0 || tempoMaximo < 0) {
                throw AppError.badRequest('Tempos não podem ser negativos');
            }

            if (tempoMinimo > tempoMaximo) {
                throw AppError.badRequest('Tempo mínimo não pode ser maior que máximo');
            }

            return await this.recipeRepository.findByTimeRange(tempoMinimo, tempoMaximo);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar por faixa de tempo');
        }
    }

    /**
     * Busca receitas rápidas (até 15 minutos)
     */
    async executeVeryQuick(): Promise<Recipe[]> {
        return await this.execute(15);
    }

    /**
     * Busca receitas rápidas (16-30 minutos)
     */
    async executeQuick(): Promise<Recipe[]> {
        return await this.executeByRange(16, 30);
    }

    /**
     * Busca receitas médias (31-60 minutos)
     */
    async executeMedium(): Promise<Recipe[]> {
        return await this.executeByRange(31, 60);
    }

    /**
     * Busca receitas demoradas (mais de 60 minutos)
     */
    async executeSlow(): Promise<Recipe[]> {
        try {
            const allRecipes = await this.recipeRepository.findAll();
            return allRecipes.filter(recipe => recipe.tempoPreparo > 60);
        } catch (error) {
            throw AppError.internal('Erro ao buscar receitas demoradas');
        }
    }

    /**
     * Agrupa receitas por classificação de tempo
     */
    async executeGroupedByTime(): Promise<{
        rapidas: Recipe[];
        medias: Recipe[];
        demoradas: Recipe[];
    }> {
        try {
            const allRecipes = await this.recipeRepository.findAll();

            return {
                rapidas: allRecipes.filter(r => r.isRapida),
                medias: allRecipes.filter(r => r.isMedia),
                demoradas: allRecipes.filter(r => r.isDemorada)
            };
        } catch (error) {
            throw AppError.internal('Erro ao agrupar por tempo');
        }
    }

    /**
     * Calcula tempo médio de preparo
     */
    async calculateAverageTime(): Promise<number> {
        try {
            const allRecipes = await this.recipeRepository.findAll();

            if (allRecipes.length === 0) return 0;

            const soma = allRecipes.reduce((sum, recipe) => sum + recipe.tempoPreparo, 0);
            return Math.round(soma / allRecipes.length);
        } catch (error) {
            return 0;
        }
    }
}