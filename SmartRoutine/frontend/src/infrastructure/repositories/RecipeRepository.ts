import {
    IRecipeRepository,
    CreateRecipeData,
    UpdateRecipeData,
    RecipeFilters,
    RecipeSortOptions
} from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Implementação do Repositório de Receitas
* 
* Responsabilidades:
* - Comunicação com API de receitas
* - Conversão de DTOs para Entities
* - Formatação de informações JSONB
*/
export class RecipeRepository implements IRecipeRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todas as receitas
     */
    async findAll(): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.RECEITA.BASE);
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar receitas');
        }
    }

    /**
     * Busca receita por ID
     */
    async findById(id: number): Promise<Recipe | null> {
        try {
            const data = await this.apiClient.get(ENDPOINTS.RECEITA.BY_ID(id));
            return Recipe.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar receita');
        }
    }

    /**
     * Busca receitas por título
     */
    async findByTitle(titulo: string): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.RECEITA.SEARCH(titulo));
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por título');
        }
    }

    /**
     * Busca receitas por tag
     */
    async findByTag(tag: string): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.RECEITA.BY_TAG(tag));
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por tag');
        }
    }

    /**
     * Busca receitas por múltiplas tags
     */
    async findByTags(tags: string[]): Promise<Recipe[]> {
        try {
            // Se API não suportar múltiplas tags, buscar por cada uma e fazer interseção
            const recipesSets = await Promise.all(
                tags.map(tag => this.findByTag(tag))
            );

            // Interseção: receitas que aparecem em todos os sets
            if (recipesSets.length === 0) return [];
            if (recipesSets.length === 1) return recipesSets[0];

            const firstSet = recipesSets[0];
            return firstSet.filter(recipe =>
                recipesSets.every(set => set.some(r => r.id === recipe.id))
            );
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por tags');
        }
    }

    /**
     * Busca receitas por tempo máximo
     */
    async findByMaxTime(tempoMaximo: number): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.RECEITA.BY_TIME(tempoMaximo)
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por tempo');
        }
    }

    /**
     * Busca receitas por faixa de tempo
     */
    async findByTimeRange(tempoMinimo: number, tempoMaximo: number): Promise<Recipe[]> {
        try {
            const allRecipes = await this.findByMaxTime(tempoMaximo);
            return allRecipes.filter(recipe => recipe.tempoPreparo >= tempoMinimo);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por faixa de tempo');
        }
    }

    /**
     * Busca receitas por dificuldade
     */
    async findByDifficulty(dificuldade: string): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.RECEITA.BY_DIFFICULTY(dificuldade)
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback: buscar todas e filtrar
            try {
                const allRecipes = await this.findAll();
                return allRecipes.filter(
                    recipe => recipe.dificuldade?.toLowerCase() === dificuldade.toLowerCase()
                );
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar por dificuldade');
            }
        }
    }

    /**
     * Busca receitas por tipo de refeição
     */
    async findByMealType(tipoRefeicao: string): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.RECEITA.BY_MEAL_TYPE(tipoRefeicao)
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback
            try {
                const allRecipes = await this.findAll();
                return allRecipes.filter(
                    recipe => recipe.tipoRefeicao?.toLowerCase() === tipoRefeicao.toLowerCase()
                );
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar por tipo de refeição');
            }
        }
    }

    /**
     * Busca receitas por ingrediente
     */
    async findByIngredient(ingrediente: string): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.RECEITA.BY_INGREDIENT(ingrediente)
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback
            try {
                const allRecipes = await this.findAll();
                return allRecipes.filter(recipe => recipe.hasIngrediente(ingrediente));
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar por ingrediente');
            }
        }
    }

    /**
     * Busca receitas por ingredientes
     */
    async findByIngredients(ingredientes: string[], matchAll?: boolean): Promise<Recipe[]> {
        try {
            const allRecipes = await this.findAll();

            if (matchAll) {
                return allRecipes.filter(recipe => recipe.hasIngredientes(ingredientes));
            } else {
                return allRecipes.filter(recipe => recipe.hasAlgumIngrediente(ingredientes));
            }
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por ingredientes');
        }
    }

    /**
     * Busca com filtros
     */
    async findByFilters(filters: RecipeFilters): Promise<Recipe[]> {
        try {
            const allRecipes = await this.findAll();
            return this.filterRecipesClientSide(allRecipes, filters);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar com filtros');
        }
    }

    /**
     * Busca com ordenação
     */
    async findWithSort(sortOptions: RecipeSortOptions): Promise<Recipe[]> {
        try {
            const recipes = await this.findAll();
            return this.sortRecipes(recipes, sortOptions);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar com ordenação');
        }
    }

    /**
     * Busca receitas rápidas
     */
    async findQuickRecipes(): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.RECEITA.QUICK);
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback
            try {
                const allRecipes = await this.findAll();
                return allRecipes.filter(recipe => recipe.isRapida);
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar receitas rápidas');
            }
        }
    }

    /**
     * Busca por faixa de calorias
     */
    async findByCaloriesRange(caloriasMin: number, caloriasMax: number): Promise<Recipe[]> {
        try {
            const allRecipes = await this.findAll();
            return allRecipes.filter(recipe => {
                if (!recipe.calorias) return false;
                return recipe.calorias >= caloriasMin && recipe.calorias <= caloriasMax;
            });
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por calorias');
        }
    }

    /**
     * Cria receita
     */
    async create(recipeData: CreateRecipeData): Promise<Recipe> {
        try {
            const payload = {
                titulo: recipeData.titulo,
                porcao: recipeData.porcao,
                tempoPreparo: recipeData.tempoPreparo,
                informacoes: {
                    ingredientes: recipeData.ingredientes,
                    modo_preparo: recipeData.modoPreparo,
                    dificuldade: recipeData.dificuldade || 'Fácil',
                    tipo_refeicao: recipeData.tipoRefeicao || 'Almoço/Jantar',
                    calorias: recipeData.calorias || 0,
                    tags: recipeData.tags || [],
                    imagem: recipeData.imagem
                }
            };

            const data = await this.apiClient.post(ENDPOINTS.RECEITA.CREATE, payload);

            // Se API retorna apenas mensagem, buscar a receita criada
            if (data.message && !data.id) {
                const recipes = await this.findAll();
                const newRecipe = recipes.find(r => r.titulo === recipeData.titulo);
                if (!newRecipe) {
                    throw new Error('Receita criada mas não encontrada');
                }
                return newRecipe;
            }

            return Recipe.fromDTO(data);
        } catch (error) {
            throw this.handleError(error, 'Erro ao criar receita');
        }
    }

    /**
     * Atualiza receita
     */
    async update(id: number, recipeData: UpdateRecipeData): Promise<Recipe> {
        try {
            const payload: any = {};

            if (recipeData.titulo) payload.titulo = recipeData.titulo;
            if (recipeData.porcao) payload.porcao = recipeData.porcao;
            if (recipeData.tempoPreparo) payload.tempoPreparo = recipeData.tempoPreparo;

            // Construir objeto informacoes apenas com campos fornecidos
            const informacoes: any = {};
            if (recipeData.ingredientes) informacoes.ingredientes = recipeData.ingredientes;
            if (recipeData.modoPreparo) informacoes.modo_preparo = recipeData.modoPreparo;
            if (recipeData.dificuldade) informacoes.dificuldade = recipeData.dificuldade;
            if (recipeData.tipoRefeicao) informacoes.tipo_refeicao = recipeData.tipoRefeicao;
            if (recipeData.calorias !== undefined) informacoes.calorias = recipeData.calorias;
            if (recipeData.tags) informacoes.tags = recipeData.tags;
            if (recipeData.imagem) informacoes.imagem = recipeData.imagem;

            if (Object.keys(informacoes).length > 0) {
                payload.informacoes = informacoes;
            }

            await this.apiClient.put(ENDPOINTS.RECEITA.UPDATE(id), payload);

            // Buscar receita atualizada
            const updatedRecipe = await this.findById(id);
            if (!updatedRecipe) {
                throw AppError.notFound('Receita não encontrada após atualização');
            }

            return updatedRecipe;
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Receita não encontrada');
            }
            throw this.handleError(error, 'Erro ao atualizar receita');
        }
    }

    /**
     * Deleta receita
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.RECEITA.DELETE(id));
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Receita não encontrada');
            }
            throw this.handleError(error, 'Erro ao deletar receita');
        }
    }

    /**
     * Conta total de receitas
     */
    async count(): Promise<number> {
        try {
            const recipes = await this.findAll();
            return recipes.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Lista todas as tags
     */
    async getAllTags(): Promise<string[]> {
        try {
            const data = await this.apiClient.get<string[]>(ENDPOINTS.RECEITA.TAGS);
            return data;
        } catch (error) {
            // Fallback: extrair de todas as receitas
            try {
                const recipes = await this.findAll();
                const tagsSet = new Set<string>();

                recipes.forEach(recipe => {
                    recipe.tags?.forEach(tag => tagsSet.add(tag));
                });

                return Array.from(tagsSet).sort();
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Lista todos os tipos de refeição
     */
    async getAllMealTypes(): Promise<string[]> {
        try {
            const data = await this.apiClient.get<string[]>(ENDPOINTS.RECEITA.MEAL_TYPES);
            return data;
        } catch (error) {
            // Fallback
            try {
                const recipes = await this.findAll();
                const typesSet = new Set<string>();

                recipes.forEach(recipe => {
                    if (recipe.tipoRefeicao) {
                        typesSet.add(recipe.tipoRefeicao);
                    }
                });

                return Array.from(typesSet).sort();
            } catch (fallbackError) {
                return ['Café da Manhã', 'Almoço', 'Jantar', 'Lanche'];
            }
        }
    }

    /**
     * Lista todas as dificuldades
     */
    async getAllDifficulties(): Promise<string[]> {
        try {
            const data = await this.apiClient.get<string[]>(ENDPOINTS.RECEITA.DIFFICULTIES);
            return data;
        } catch (error) {
            // Fallback
            try {
                const recipes = await this.findAll();
                const difficultiesSet = new Set<string>();

                recipes.forEach(recipe => {
                    if (recipe.dificuldade) {
                        difficultiesSet.add(recipe.dificuldade);
                    }
                });

                return Array.from(difficultiesSet).sort();
            } catch (fallbackError) {
                return ['Muito Fácil', 'Fácil', 'Média', 'Difícil', 'Muito Difícil'];
            }
        }
    }

    /**
     * Busca receitas populares
     */
    async findPopular(limit: number = 10): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                `${ENDPOINTS.RECEITA.POPULAR}?limit=${limit}`
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback: retornar as primeiras
            try {
                const recipes = await this.findAll();
                return recipes.slice(0, limit);
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Busca receitas recentes
     */
    async findRecent(limit: number = 10): Promise<Recipe[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                `${ENDPOINTS.RECEITA.RECENT}?limit=${limit}`
            );
            return data.map(dto => Recipe.fromDTO(dto));
        } catch (error) {
            // Fallback: retornar as últimas
            try {
                const recipes = await this.findAll();
                return recipes.slice(-limit).reverse();
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Verifica se receita existe
     */
    async existsById(id: number): Promise<boolean> {
        try {
            const recipe = await this.findById(id);
            return recipe !== null;
        } catch (error) {
            return false;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Filtra receitas client-side
     */
    private filterRecipesClientSide(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
        return recipes.filter(recipe => {
            // Filtro de título
            if (filters.titulo && !recipe.contemTitulo(filters.titulo)) {
                return false;
            }

            // Filtro de tempo
            if (filters.tempoPreparoMax !== undefined && recipe.tempoPreparo > filters.tempoPreparoMax) {
                return false;
            }

            if (filters.tempoPreparoMin !== undefined && recipe.tempoPreparo < filters.tempoPreparoMin) {
                return false;
            }

            // Filtro de dificuldade
            if (filters.dificuldade && recipe.dificuldade !== filters.dificuldade) {
                return false;
            }

            // Filtro de tipo de refeição
            if (filters.tipoRefeicao && recipe.tipoRefeicao !== filters.tipoRefeicao) {
                return false;
            }

            // Filtro de calorias
            if (filters.caloriasMax !== undefined && recipe.calorias && recipe.calorias > filters.caloriasMax) {
                return false;
            }

            if (filters.caloriasMin !== undefined && recipe.calorias && recipe.calorias < filters.caloriasMin) {
                return false;
            }

            // Filtro de tags
            if (filters.tags && filters.tags.length > 0) {
                if (!recipe.hasTags(filters.tags)) {
                    return false;
                }
            }

            // Filtro de ingredientes
            if (filters.ingredientes && filters.ingredientes.length > 0) {
                if (!recipe.hasIngredientes(filters.ingredientes)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Ordena receitas
     */
    private sortRecipes(recipes: Recipe[], options: RecipeSortOptions): Recipe[] {
        return [...recipes].sort((a, b) => {
            let comparison = 0;

            switch (options.campo) {
                case 'titulo':
                    comparison = a.titulo.localeCompare(b.titulo);
                    break;
                case 'tempoPreparo':
                    comparison = a.tempoPreparo - b.tempoPreparo;
                    break;
                case 'calorias':
                    const calA = a.calorias || 0;
                    const calB = b.calorias || 0;
                    comparison = calA - calB;
                    break;
            }

            return options.ordem === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Trata erros
     */
    private handleError(error: any, defaultMessage: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        console.error(defaultMessage, error);
        return AppError.internal(defaultMessage);
    }
}