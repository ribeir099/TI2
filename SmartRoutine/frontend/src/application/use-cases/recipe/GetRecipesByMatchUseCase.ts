import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { RecipeWithMatchDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de match
*/
export interface MatchOptions {
    percentualMinimo?: number;        // Percentual mínimo de match (0-100)
    ordenarPorMatch?: boolean;        // Ordenar por percentual de match
    apenasQuePodemFazer?: boolean;   // Apenas receitas que podem fazer
    incluirIngredientesComuns?: boolean; // Incluir ingredientes comuns na análise
}

/**
* Use Case: Obter Receitas por Match de Ingredientes
* 
* Responsabilidade:
* - Calcular match de ingredientes disponíveis
* - Recomendar receitas baseadas na despensa
* - Ordenar por viabilidade
*/
export class GetRecipesByMatchUseCase {
    constructor(
        private readonly recipeRepository: IRecipeRepository,
        private readonly foodItemRepository: IFoodItemRepository
    ) { }

    /**
     * Busca receitas com match de ingredientes
     * 
     * @param usuarioId - ID do usuário
     * @param options - Opções de match
     * @returns Promise<RecipeWithMatchDTO[]> - Receitas com percentual de match
     */
    async execute(
        usuarioId: string,
        options: MatchOptions = {}
    ): Promise<RecipeWithMatchDTO[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar ingredientes disponíveis na despensa
            const foodItems = await this.foodItemRepository.findByUserId(usuarioId);
            const ingredientesDisponiveis = foodItems
                .filter(item => !item.isVencido()) // Apenas não vencidos
                .map(item => item.nome);

            // Adicionar ingredientes comuns se solicitado
            if (options.incluirIngredientesComuns) {
                ingredientesDisponiveis.push(
                    'sal', 'pimenta', 'azeite', 'óleo', 'água', 'açúcar'
                );
            }

            // Buscar todas as receitas
            const allRecipes = await this.recipeRepository.findAll();

            // Calcular match para cada receita
            let recipesWithMatch = allRecipes.map(recipe => {
                const percentualMatch = recipe.calcularMatchIngredientes(ingredientesDisponiveis);
                const ingredientesDisp = recipe.ingredientesDisponiveis(ingredientesDisponiveis);
                const ingredientesFalt = recipe.ingredientesFaltando(ingredientesDisponiveis);
                const podeFazer = recipe.podeFazerCom(
                    ingredientesDisponiveis,
                    options.percentualMinimo || 80
                );

                return {
                    id: recipe.id,
                    titulo: recipe.titulo,
                    tempoPreparo: recipe.tempoPreparo,
                    tempoFormatado: recipe.tempoFormatado,
                    imagem: recipe.imagem,
                    quantidadeIngredientes: recipe.quantidadeIngredientes,
                    isFavorita: recipe.isFavorita,
                    tags: recipe.tags,
                    classificacaoTempo: recipe.classificacaoTempo,
                    percentualMatch,
                    ingredientesDisponiveis: ingredientesDisp,
                    ingredientesFaltando: ingredientesFalt,
                    podeFazer
                };
            });

            // Filtrar por percentual mínimo se especificado
            if (options.percentualMinimo !== undefined) {
                recipesWithMatch = recipesWithMatch.filter(
                    r => r.percentualMatch >= options.percentualMinimo!
                );
            }

            // Filtrar apenas que podem fazer se solicitado
            if (options.apenasQuePodemFazer) {
                recipesWithMatch = recipesWithMatch.filter(r => r.podeFazer);
            }

            // Ordenar por match se solicitado
            if (options.ordenarPorMatch !== false) { // Default é true
                recipesWithMatch.sort((a, b) => b.percentualMatch - a.percentualMatch);
            }

            return recipesWithMatch;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetRecipesByMatchUseCase:', error);
            throw AppError.internal('Erro ao calcular match de receitas');
        }
    }

    /**
     * Busca receitas que podem ser feitas completamente
     * 
     * @param usuarioId - ID do usuário
     * @param percentualMinimo - Percentual mínimo de match (default: 100)
     * @returns Promise<RecipeWithMatchDTO[]> - Receitas viáveis
     */
    async executeCanMake(
        usuarioId: string,
        percentualMinimo: number = 100
    ): Promise<RecipeWithMatchDTO[]> {
        return await this.execute(usuarioId, {
            percentualMinimo,
            ordenarPorMatch: true,
            apenasQuePodemFazer: false
        });
    }

    /**
     * Busca receitas quase viáveis (faltam poucos ingredientes)
     * 
     * @param usuarioId - ID do usuário
     * @param maxFaltando - Máximo de ingredientes faltando (default: 2)
     * @returns Promise<RecipeWithMatchDTO[]> - Receitas quase viáveis
     */
    async executeAlmostCanMake(
        usuarioId: string,
        maxFaltando: number = 2
    ): Promise<RecipeWithMatchDTO[]> {
        try {
            const recipesWithMatch = await this.execute(usuarioId, {
                ordenarPorMatch: true
            });

            return recipesWithMatch.filter(
                r => r.ingredientesFaltando.length <= maxFaltando && r.ingredientesFaltando.length > 0
            );
        } catch (error) {
            throw AppError.internal('Erro ao buscar receitas quase viáveis');
        }
    }

    /**
     * Busca melhor receita para fazer agora
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<RecipeWithMatchDTO | null> - Melhor receita ou null
     */
    async executeBestMatch(usuarioId: string): Promise<RecipeWithMatchDTO | null> {
        try {
            const recipes = await this.execute(usuarioId, {
                ordenarPorMatch: true
            });

            if (recipes.length === 0) return null;

            // Retornar receita com maior match
            return recipes[0];
        } catch (error) {
            return null;
        }
    }

    /**
     * Analisa cobertura da despensa para receitas
     */
    async analyzePantryCoverage(usuarioId: string): Promise<{
        receitasTotais: number;
        receitasPodemFazer: number;
        receitasQuaseFazer: number;
        percentualCobertura: number;
        ingredientesMaisFaltantes: Array<{ ingrediente: string; count: number }>;
    }> {
        try {
            const recipesWithMatch = await this.execute(usuarioId);

            const total = recipesWithMatch.length;
            const podemFazer = recipesWithMatch.filter(r => r.podeFazer).length;
            const quaseFazer = recipesWithMatch.filter(
                r => !r.podeFazer && r.percentualMatch >= 75
            ).length;

            const percentualCobertura = total > 0
                ? Math.round((podemFazer / total) * 100)
                : 0;

            // Ingredientes mais faltantes
            const faltantesMap = new Map<string, number>();
            recipesWithMatch.forEach(recipe => {
                recipe.ingredientesFaltando.forEach(ing => {
                    faltantesMap.set(ing, (faltantesMap.get(ing) || 0) + 1);
                });
            });

            const ingredientesMaisFaltantes = Array.from(faltantesMap.entries())
                .map(([ingrediente, count]) => ({ ingrediente, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            return {
                receitasTotais: total,
                receitasPodemFazer: podemFazer,
                receitasQuaseFazer: quaseFazer,
                percentualCobertura,
                ingredientesMaisFaltantes
            };
        } catch (error) {
            throw AppError.internal('Erro ao analisar cobertura da despensa');
        }
    }

    /**
     * Sugere ingredientes para comprar (aumentar cobertura)
     */
    async suggestIngredientsToBuy(usuarioId: string, limit: number = 10): Promise<Array<{
        ingrediente: string;
        receitasQueDesbloqueia: number;
        prioridade: number;
    }>> {
        try {
            const recipesWithMatch = await this.execute(usuarioId);

            // Contar quantas receitas cada ingrediente desbloquearia
            const ingredienteImpact = new Map<string, Set<number>>();

            recipesWithMatch
                .filter(r => !r.podeFazer && r.percentualMatch >= 50)
                .forEach(recipe => {
                    recipe.ingredientesFaltando.forEach(ing => {
                        if (!ingredienteImpact.has(ing)) {
                            ingredienteImpact.set(ing, new Set());
                        }
                        ingredienteImpact.get(ing)!.add(recipe.id);
                    });
                });

            return Array.from(ingredienteImpact.entries())
                .map(([ingrediente, receitaIds]) => ({
                    ingrediente,
                    receitasQueDesbloqueia: receitaIds.size,
                    prioridade: receitaIds.size * 10 // Score simples
                }))
                .sort((a, b) => b.prioridade - a.prioridade)
                .slice(0, limit);
        } catch (error) {
            return [];
        }
    }
}