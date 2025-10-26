import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de busca
*/
export interface SearchRecipeOptions {
    termo: string;
    incluirIngredientes?: boolean;
    incluirTags?: boolean;
    ordenarPor?: 'relevancia' | 'titulo' | 'tempo' | 'calorias';
}

/**
* Resultado com score de relevância
*/
export interface RecipeSearchResult {
    recipe: Recipe;
    relevanceScore: number;
    matchedIn: Array<'titulo' | 'ingredientes' | 'tags'>;
}

/**
* Use Case: Buscar Receitas
* 
* Responsabilidade:
* - Buscar receitas por título
* - Busca em múltiplos campos
* - Ordenar por relevância
*/
export class SearchRecipesUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Busca receitas por título
     * 
     * @param titulo - Título ou parte do título
     * @returns Promise<Recipe[]> - Receitas encontradas
     */
    async execute(titulo: string): Promise<Recipe[]> {
        try {
            // Validar entrada
            if (!titulo || titulo.trim().length === 0) {
                return [];
            }

            if (titulo.trim().length < 2) {
                throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
            }

            return await this.recipeRepository.findByTitle(titulo);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no SearchRecipesUseCase:', error);
            throw AppError.internal('Erro ao buscar receitas');
        }
    }

    /**
     * Busca avançada com múltiplos campos
     * 
     * @param options - Opções de busca
     * @returns Promise<Recipe[]> - Receitas encontradas
     */
    async executeAdvanced(options: SearchRecipeOptions): Promise<Recipe[]> {
        try {
            if (!options.termo || options.termo.trim().length < 2) {
                throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
            }

            const termo = options.termo.toLowerCase();

            // Buscar todas as receitas
            const allRecipes = await this.recipeRepository.findAll();

            // Filtrar por termo
            let results = allRecipes.filter(recipe => {
                // Buscar no título (sempre)
                if (recipe.titulo.toLowerCase().includes(termo)) {
                    return true;
                }

                // Buscar em ingredientes se solicitado
                if (options.incluirIngredientes) {
                    const hasIngredient = recipe.ingredientes.some(ing =>
                        ing.toLowerCase().includes(termo)
                    );
                    if (hasIngredient) return true;
                }

                // Buscar em tags se solicitado
                if (options.incluirTags && recipe.tags) {
                    const hasTag = recipe.tags.some(tag =>
                        tag.toLowerCase().includes(termo)
                    );
                    if (hasTag) return true;
                }

                return false;
            });

            // Ordenar resultados
            results = this.sortResults(results, options.ordenarPor || 'relevancia', termo);

            return results;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro na busca avançada');
        }
    }

    /**
     * Busca com score de relevância
     * 
     * @param options - Opções de busca
     * @returns Promise<RecipeSearchResult[]> - Resultados com score
     */
    async executeWithRelevance(options: SearchRecipeOptions): Promise<RecipeSearchResult[]> {
        try {
            const termo = options.termo.toLowerCase();
            const allRecipes = await this.recipeRepository.findAll();

            const results: RecipeSearchResult[] = [];

            allRecipes.forEach(recipe => {
                const matchedIn: Array<'titulo' | 'ingredientes' | 'tags'> = [];
                let score = 0;

                // Check título
                const tituloMatch = recipe.titulo.toLowerCase().includes(termo);
                if (tituloMatch) {
                    matchedIn.push('titulo');
                    // Título exato tem score maior
                    if (recipe.titulo.toLowerCase() === termo) {
                        score += 100;
                    } else if (recipe.titulo.toLowerCase().startsWith(termo)) {
                        score += 75;
                    } else {
                        score += 50;
                    }
                }

                // Check ingredientes
                if (options.incluirIngredientes) {
                    const hasIngredient = recipe.ingredientes.some(ing =>
                        ing.toLowerCase().includes(termo)
                    );
                    if (hasIngredient) {
                        matchedIn.push('ingredientes');
                        score += 25;
                    }
                }

                // Check tags
                if (options.incluirTags && recipe.tags) {
                    const hasTag = recipe.tags.some(tag =>
                        tag.toLowerCase().includes(termo)
                    );
                    if (hasTag) {
                        matchedIn.push('tags');
                        score += 15;
                    }
                }

                if (matchedIn.length > 0) {
                    results.push({
                        recipe,
                        relevanceScore: score,
                        matchedIn
                    });
                }
            });

            // Ordenar por score
            return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } catch (error) {
            throw AppError.internal('Erro na busca com relevância');
        }
    }

    /**
     * Busca com sugestões (autocomplete)
     */
    async executeWithSuggestions(termo: string): Promise<{
        results: Recipe[];
        suggestions: string[];
    }> {
        try {
            if (termo.trim().length < 2) {
                return { results: [], suggestions: [] };
            }

            const results = await this.execute(termo);

            // Gerar sugestões únicas
            const suggestions = results
                .map(r => r.titulo)
                .filter((titulo, index, self) => self.indexOf(titulo) === index)
                .slice(0, 5);

            return {
                results,
                suggestions
            };
        } catch (error) {
            return { results: [], suggestions: [] };
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Ordena resultados
     */
    private sortResults(
        recipes: Recipe[],
        ordenacao: 'relevancia' | 'titulo' | 'tempo' | 'calorias',
        termo: string
    ): Recipe[] {
        switch (ordenacao) {
            case 'relevancia':
                return this.sortByRelevance(recipes, termo);

            case 'titulo':
                return recipes.sort((a, b) => a.titulo.localeCompare(b.titulo));

            case 'tempo':
                return recipes.sort((a, b) => a.tempoPreparo - b.tempoPreparo);

            case 'calorias':
                return recipes.sort((a, b) => {
                    const calA = a.calorias || 0;
                    const calB = b.calorias || 0;
                    return calA - calB;
                });

            default:
                return recipes;
        }
    }

    /**
     * Ordena por relevância
     */
    private sortByRelevance(recipes: Recipe[], termo: string): Recipe[] {
        const termoNormalizado = termo.toLowerCase();

        return recipes.sort((a, b) => {
            const tituloA = a.titulo.toLowerCase();
            const tituloB = b.titulo.toLowerCase();

            // Match exato
            const aExato = tituloA === termoNormalizado;
            const bExato = tituloB === termoNormalizado;
            if (aExato && !bExato) return -1;
            if (!aExato && bExato) return 1;

            // Começa com
            const aComeca = tituloA.startsWith(termoNormalizado);
            const bComeca = tituloB.startsWith(termoNormalizado);
            if (aComeca && !bComeca) return -1;
            if (!aComeca && bComeca) return 1;

            // Alfabético
            return tituloA.localeCompare(tituloB);
        });
    }
}