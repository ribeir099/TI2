import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Filtrar Receitas por Tag
* 
* Responsabilidade:
* - Buscar receitas por tag
* - Buscar por múltiplas tags
* - Listar tags disponíveis
*/
export class FilterRecipesByTagUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Busca receitas por tag
     * 
     * @param tag - Tag da receita
     * @returns Promise<Recipe[]> - Receitas com a tag
     */
    async execute(tag: string): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!tag || tag.trim().length === 0) {
                throw AppError.badRequest('Tag é obrigatória');
            }

            const tagNormalizada = tag.trim().toLowerCase();

            return await this.recipeRepository.findByTag(tagNormalizada);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no FilterRecipesByTagUseCase:', error);
            throw AppError.internal('Erro ao filtrar receitas por tag');
        }
    }

    /**
     * Busca receitas que têm TODAS as tags (AND)
     * 
     * @param tags - Array de tags
     * @returns Promise<Recipe[]> - Receitas com todas as tags
     */
    async executeByMultipleTags(tags: string[]): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!tags || tags.length === 0) {
                throw AppError.badRequest('Lista de tags é obrigatória');
            }

            const tagsNormalizadas = tags.map(tag => tag.trim().toLowerCase());

            return await this.recipeRepository.findByTags(tagsNormalizadas);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar por múltiplas tags');
        }
    }

    /**
     * Busca receitas que têm ALGUMA das tags (OR)
     * 
     * @param tags - Array de tags
     * @returns Promise<Recipe[]> - Receitas com pelo menos uma tag
     */
    async executeByAnyTag(tags: string[]): Promise<Recipe[]> {
        try {
            if (!tags || tags.length === 0) {
                throw AppError.badRequest('Lista de tags é obrigatória');
            }

            const tagsNormalizadas = tags.map(tag => tag.trim().toLowerCase());

            // Buscar por cada tag e consolidar
            const recipesSets = await Promise.all(
                tagsNormalizadas.map(tag => this.recipeRepository.findByTag(tag))
            );

            // Remover duplicatas
            const recipeMap = new Map<number, Recipe>();
            recipesSets.forEach(recipes => {
                recipes.forEach(recipe => {
                    recipeMap.set(recipe.id, recipe);
                });
            });

            return Array.from(recipeMap.values());
        } catch (error) {
            throw AppError.internal('Erro ao buscar por qualquer tag');
        }
    }

    /**
     * Lista todas as tags disponíveis
     * 
     * @returns Promise<string[]> - Array de tags únicas
     */
    async executeAllTags(): Promise<string[]> {
        try {
            return await this.recipeRepository.getAllTags();
        } catch (error) {
            throw AppError.internal('Erro ao listar tags');
        }
    }

    /**
     * Lista tags com contagem de receitas
     */
    async executeTagsWithCount(): Promise<Array<{ tag: string; count: number }>> {
        try {
            const allRecipes = await this.recipeRepository.findAll();

            const tagMap = new Map<string, number>();

            allRecipes.forEach(recipe => {
                recipe.tags?.forEach(tag => {
                    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                });
            });

            return Array.from(tagMap.entries())
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count);
        } catch (error) {
            throw AppError.internal('Erro ao listar tags com contagem');
        }
    }

    /**
     * Busca tags mais populares
     */
    async executeMostPopularTags(limit: number = 10): Promise<string[]> {
        try {
            const tagsWithCount = await this.executeTagsWithCount();
            return tagsWithCount.slice(0, limit).map(t => t.tag);
        } catch (error) {
            return [];
        }
    }

    /**
     * Agrupa receitas por tag
     */
    async executeGroupedByTag(): Promise<Map<string, Recipe[]>> {
        try {
            const allRecipes = await this.recipeRepository.findAll();

            const grouped = new Map<string, Recipe[]>();

            allRecipes.forEach(recipe => {
                recipe.tags?.forEach(tag => {
                    const recipes = grouped.get(tag) || [];
                    recipes.push(recipe);
                    grouped.set(tag, recipes);
                });
            });

            return grouped;
        } catch (error) {
            throw AppError.internal('Erro ao agrupar por tag');
        }
    }

    /**
     * Sugere tags relacionadas
     */
    async suggestRelatedTags(tag: string, limit: number = 5): Promise<string[]> {
        try {
            // Buscar receitas com a tag
            const recipes = await this.execute(tag);

            // Extrair outras tags dessas receitas
            const relatedTags = new Map<string, number>();

            recipes.forEach(recipe => {
                recipe.tags?.forEach(t => {
                    if (t !== tag.toLowerCase()) {
                        relatedTags.set(t, (relatedTags.get(t) || 0) + 1);
                    }
                });
            });

            // Ordenar por frequência
            return Array.from(relatedTags.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([tag]) => tag);
        } catch (error) {
            return [];
        }
    }
}