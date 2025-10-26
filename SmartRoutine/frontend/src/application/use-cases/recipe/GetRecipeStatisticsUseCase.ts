import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AIRecipeSuggestionInputDTO, CreateRecipeInputDTO, RecipeStatisticsDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Estatísticas de Receitas
* 
* Responsabilidade:
* - Calcular estatísticas gerais
* - Análise de distribuições
* - Métricas agregadas
*/
export class GetRecipeStatisticsUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Obtém estatísticas completas
     * 
     * @returns Promise<RecipeStatisticsDTO> - Estatísticas
     */
    async execute(): Promise<RecipeStatisticsDTO> {
        try {
            const recipes = await this.recipeRepository.findAll();

            return this.calculateStatistics(recipes);
        } catch (error) {
            console.error('Erro no GetRecipeStatisticsUseCase:', error);
            throw AppError.internal('Erro ao calcular estatísticas');
        }
    }

    /**
     * Obtém estatísticas por filtro
     */
    async executeByTag(tag: string): Promise<RecipeStatisticsDTO> {
        try {
            const recipes = await this.recipeRepository.findByTag(tag);
            return this.calculateStatistics(recipes);
        } catch (error) {
            throw AppError.internal('Erro ao calcular estatísticas por tag');
        }
    }

    /**
     * Obtém estatísticas por tipo de refeição
     */
    async executeByMealType(tipoRefeicao: string): Promise<RecipeStatisticsDTO> {
        try {
            const recipes = await this.recipeRepository.findByMealType(tipoRefeicao);
            return this.calculateStatistics(recipes);
        } catch (error) {
            throw AppError.internal('Erro ao calcular estatísticas por tipo');
        }
    }

    /**
     * Compara estatísticas entre períodos
     */
    async compareWithPrevious(): Promise<{
        atual: RecipeStatisticsDTO;
        crescimento: {
            totalReceitas: number;
            percentual: number;
        };
    }> {
        try {
            const stats = await this.execute();

            // Simulação de crescimento (em produção, comparar com dados históricos)
            return {
                atual: stats,
                crescimento: {
                    totalReceitas: 0,
                    percentual: 0
                }
            };
        } catch (error) {
            throw AppError.internal('Erro ao comparar estatísticas');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Calcula estatísticas
     */
    private calculateStatistics(recipes: Recipe[]): RecipeStatisticsDTO {
        const total = recipes.length;
        const favoritas = recipes.filter(r => r.isFavorita).length;
        const rapidas = recipes.filter(r => r.isRapida).length;
        const medias = recipes.filter(r => r.isMedia).length;
        const demoradas = recipes.filter(r => r.isDemorada).length;

        // Tags populares
        const tagsMap = new Map<string, number>();
        recipes.forEach(recipe => {
            recipe.tags?.forEach(tag => {
                tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
            });
        });

        const tagsPopulares = Array.from(tagsMap.entries())
            .map(([tag, quantidade]) => ({ tag, quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 10);

        // Dificuldades
        const dificuldadesMap = new Map<string, number>();
        recipes.forEach(recipe => {
            if (recipe.dificuldade) {
                dificuldadesMap.set(
                    recipe.dificuldade,
                    (dificuldadesMap.get(recipe.dificuldade) || 0) + 1
                );
            }
        });

        const dificuldadesDistribuicao = Array.from(dificuldadesMap.entries())
            .map(([dificuldade, quantidade]) => ({ dificuldade, quantidade }));

        // Tipos de refeição
        const tiposMap = new Map<string, number>();
        recipes.forEach(recipe => {
            if (recipe.tipoRefeicao) {
                tiposMap.set(
                    recipe.tipoRefeicao,
                    (tiposMap.get(recipe.tipoRefeicao) || 0) + 1
                );
            }
        });

        const tiposRefeicaoDistribuicao = Array.from(tiposMap.entries())
            .map(([tipo, quantidade]) => ({ tipo, quantidade }));

        // Tempo médio
        const somaTempos = recipes.reduce((sum, recipe) => sum + recipe.tempoPreparo, 0);
        const tempoMedioPreparo = total > 0 ? Math.round(somaTempos / total) : 0;

        // Calorias média
        const receitasComCalorias = recipes.filter(r => r.calorias !== undefined);
        const somaCalorias = receitasComCalorias.reduce((sum, r) => sum + (r.calorias || 0), 0);
        const caloriaMedia = receitasComCalorias.length > 0
            ? Math.round(somaCalorias / receitasComCalorias.length)
            : undefined;

        return {
            totalReceitas: total,
            receitasFavoritas: favoritas,
            receitasRapidas: rapidas,
            receitasMedias: medias,
            receitasDemoradas: demoradas,
            tagsPopulares,
            dificuldadesDistribuicao,
            tiposRefeicaoDistribuicao,
            tempoMedioPreparo,
            caloriaMedia
        };
    }

    /**
     * Gera receita baseada na opção
     */
    private async generateRecipeByOption(
        opcao: 'pantry-only' | 'pantry-based' | 'custom',
        ingredientesDisponiveis: string[],
        promptPersonalizado?: string,
        preferencias?: AIRecipeSuggestionInputDTO['preferencias']
    ): Promise<CreateRecipeInputDTO> {
        // Implementação simplificada - em produção chamar API de IA
        let titulo = '';
        let ingredientes: string[] = [];
        let tags: string[] = ['ia-gerada'];

        switch (opcao) {
            case 'pantry-only':
                titulo = 'Receita Criativa com Ingredientes da Despensa';
                ingredientes = ingredientesDisponiveis.slice(0, 5);
                tags.push('despensa-only');
                break;

            case 'pantry-based':
                titulo = 'Receita Especial Baseada na sua Despensa';
                ingredientes = [
                    ...ingredientesDisponiveis.slice(0, 4),
                    'Azeite', 'Sal', 'Pimenta'
                ];
                tags.push('despensa-based');
                break;

            case 'custom':
                titulo = `${promptPersonalizado?.substring(0, 50) || 'Receita Personalizada'}`;
                ingredientes = ingredientesDisponiveis.slice(0, 3);
                tags.push('personalizada');
                break;
        }

        const modoPreparo = [
            'Prepare todos os ingredientes',
            'Siga as instruções geradas',
            'Tempere a gosto',
            'Sirva quente'
        ];

        return {
            titulo,
            tempoPreparo: preferencias?.tempoMaximo || 30,
            porcao: '2-4 porções',
            imagem: 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752',
            ingredientes,
            modoPreparo,
            dificuldade: preferencias?.dificuldadeMaxima || 'Fácil',
            tipoRefeicao: preferencias?.tipoRefeicao || 'Almoço/Jantar',
            tags
        };
    }
}