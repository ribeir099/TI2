import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import {
 CreateRecipeInputDTO,
 UpdateRecipeInputDTO,
 RecipeOutputDTO,
 RecipeSummaryDTO,
 RecipeCardDTO,
 RecipeDetailsDTO,
 RecipeFiltersDTO,
 RecipeStatisticsDTO,
 RecipeWithMatchDTO,
 AIRecipeSuggestionInputDTO,
 RecipeDTOMapper
} from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Serviço de Receitas
* 
* Responsabilidades:
* - CRUD de receitas
* - Busca e filtros
* - Match de ingredientes
* - Sugestões e recomendações
*/
export class RecipeService {
 constructor(private readonly recipeRepository: IRecipeRepository) {}

 /**
  * Lista todas as receitas
  */
 async getAllRecipes(): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findAll();
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao listar receitas');
   }
 }

 /**
  * Busca receita por ID
  */
 async getRecipeById(id: number): Promise<RecipeOutputDTO> {
   try {
     const recipe = await this.recipeRepository.findById(id);
     
     if (!recipe) {
       throw AppError.notFound('Receita não encontrada');
     }

     return RecipeDTOMapper.toOutputDTO(recipe);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar receita');
   }
 }

 /**
  * Obtém detalhes completos da receita
  */
 async getRecipeDetails(
   id: number,
   ingredientesDisponiveis?: string[]
 ): Promise<RecipeDetailsDTO> {
   try {
     const recipe = await this.recipeRepository.findById(id);
     
     if (!recipe) {
       throw AppError.notFound('Receita não encontrada');
     }

     // TODO: Buscar total de favoritos do repositório de favoritos
     const totalFavoritos = 0;

     return RecipeDTOMapper.toDetailsDTO(recipe, totalFavoritos, ingredientesDisponiveis);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar detalhes da receita');
   }
 }

 /**
  * Busca receitas por título
  */
 async searchRecipes(titulo: string): Promise<RecipeOutputDTO[]> {
   try {
     if (!titulo || titulo.trim().length === 0) {
       return [];
     }

     const recipes = await this.recipeRepository.findByTitle(titulo);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas');
   }
 }

 /**
  * Busca receitas por tag
  */
 async getRecipesByTag(tag: string): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findByTag(tag);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas por tag');
   }
 }

 /**
  * Busca receitas por tempo máximo
  */
 async getRecipesByMaxTime(tempoMaximo: number): Promise<RecipeOutputDTO[]> {
   try {
     if (tempoMaximo <= 0) {
       throw AppError.badRequest('Tempo máximo deve ser maior que zero');
     }

     const recipes = await this.recipeRepository.findByMaxTime(tempoMaximo);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar receitas por tempo');
   }
 }

 /**
  * Busca receitas rápidas (até 30 min)
  */
 async getQuickRecipes(): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findQuickRecipes();
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas rápidas');
   }
 }

 /**
  * Busca receitas por ingrediente
  */
 async getRecipesByIngredient(ingrediente: string): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findByIngredient(ingrediente);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas por ingrediente');
   }
 }

 /**
  * Busca receitas por múltiplos ingredientes
  */
 async getRecipesByIngredients(
   ingredientes: string[],
   matchAll: boolean = false
 ): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findByIngredients(ingredientes, matchAll);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas por ingredientes');
   }
 }

 /**
  * Busca receitas com match de ingredientes
  */
 async getRecipesWithMatch(ingredientesDisponiveis: string[]): Promise<RecipeWithMatchDTO[]> {
   try {
     const recipes = await this.recipeRepository.findAll();
     
     return recipes
       .map(recipe => RecipeDTOMapper.toWithMatchDTO(recipe, ingredientesDisponiveis))
       .sort((a, b) => b.percentualMatch - a.percentualMatch);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas com match');
   }
 }

 /**
  * Busca receitas que podem ser feitas com ingredientes disponíveis
  */
 async getRecipesCanMake(
   ingredientesDisponiveis: string[],
   percentualMinimo: number = 80
 ): Promise<RecipeWithMatchDTO[]> {
   try {
     const recipesWithMatch = await this.getRecipesWithMatch(ingredientesDisponiveis);
     
     return recipesWithMatch.filter(recipe => 
       recipe.percentualMatch >= percentualMinimo
     );
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas disponíveis');
   }
 }

 /**
  * Busca receitas com filtros
  */
 async getRecipesByFilters(filters: RecipeFiltersDTO): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findByFilters(filters);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas com filtros');
   }
 }

 /**
  * Lista cards de receitas (para UI)
  */
 async getRecipeCards(): Promise<RecipeCardDTO[]> {
   try {
     const recipes = await this.recipeRepository.findAll();
     return RecipeDTOMapper.toCardDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao listar cards de receitas');
   }
 }

 /**
  * Lista receitas resumidas
  */
 async getRecipesSummary(): Promise<RecipeSummaryDTO[]> {
   try {
     const recipes = await this.recipeRepository.findAll();
     return RecipeDTOMapper.toSummaryDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao listar resumo de receitas');
   }
 }

 /**
  * Lista receitas populares
  */
 async getPopularRecipes(limit: number = 10): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findPopular(limit);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas populares');
   }
 }

 /**
  * Lista receitas recentes
  */
 async getRecentRecipes(limit: number = 10): Promise<RecipeOutputDTO[]> {
   try {
     const recipes = await this.recipeRepository.findRecent(limit);
     return RecipeDTOMapper.toOutputDTOList(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas recentes');
   }
 }

 /**
  * Obtém estatísticas de receitas
  */
 async getRecipeStatistics(): Promise<RecipeStatisticsDTO> {
   try {
     const recipes = await this.recipeRepository.findAll();
     return RecipeDTOMapper.calculateStatistics(recipes);
   } catch (error) {
     throw AppError.internal('Erro ao calcular estatísticas');
   }
 }

 /**
  * Lista todas as tags disponíveis
  */
 async getAllTags(): Promise<string[]> {
   try {
     return await this.recipeRepository.getAllTags();
   } catch (error) {
     throw AppError.internal('Erro ao listar tags');
   }
 }

 /**
  * Lista todos os tipos de refeição
  */
 async getAllMealTypes(): Promise<string[]> {
   try {
     return await this.recipeRepository.getAllMealTypes();
   } catch (error) {
     throw AppError.internal('Erro ao listar tipos de refeição');
   }
 }

 /**
  * Lista todas as dificuldades
  */
 async getAllDifficulties(): Promise<string[]> {
   try {
     return await this.recipeRepository.getAllDifficulties();
   } catch (error) {
     throw AppError.internal('Erro ao listar dificuldades');
   }
 }

 /**
  * Cria nova receita
  */
 async createRecipe(input: CreateRecipeInputDTO): Promise<RecipeOutputDTO> {
   try {
     // Validar entrada
     const errors = RecipeDTOMapper.validateCreateInput(input);
     if (errors.length > 0) {
       throw AppError.badRequest(errors.join(', '));
     }

     // Criar receita
     const recipe = await this.recipeRepository.create(input);

     return RecipeDTOMapper.toOutputDTO(recipe);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao criar receita');
   }
 }

 /**
  * Gera receita com IA (simulado)
  */
 async generateAIRecipe(input: AIRecipeSuggestionInputDTO): Promise<RecipeOutputDTO> {
   try {
     // Simulação de geração com IA
     let titulo = '';
     let ingredientes: string[] = [];

     switch (input.opcao) {
       case 'pantry-only':
         titulo = 'Receita Criativa com Ingredientes da Despensa';
         ingredientes = input.ingredientesDisponiveis?.slice(0, 4) || [];
         break;
       
       case 'pantry-based':
         titulo = 'Receita Especial Baseada na sua Despensa';
         ingredientes = [
           ...(input.ingredientesDisponiveis?.slice(0, 3) || []),
           'Azeite',
           'Sal',
           'Pimenta'
         ];
         break;
       
       case 'custom':
         titulo = `Receita Personalizada: ${input.promptPersonalizado?.substring(0, 30) || 'IA'}`;
         ingredientes = input.ingredientesDisponiveis?.slice(0, 3) || ['Ingrediente 1', 'Ingrediente 2'];
         break;
     }

     const recipeData: CreateRecipeInputDTO = {
       titulo,
       tempoPreparo: input.preferencias?.tempoMaximo || 30,
       porcao: '2-4 porções',
       imagem: 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752',
       ingredientes,
       modoPreparo: [
         'Prepare todos os ingredientes',
         'Siga as instruções da receita gerada',
         'Tempere a gosto',
         'Sirva quente'
       ],
       dificuldade: input.preferencias?.dificuldadeMaxima || 'Fácil',
       tipoRefeicao: input.preferencias?.tipoRefeicao || 'Almoço/Jantar',
       tags: ['ia-gerada', 'personalizada']
     };

     return await this.createRecipe(recipeData);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao gerar receita com IA');
   }
 }

 /**
  * Atualiza receita
  */
 async updateRecipe(id: number, input: UpdateRecipeInputDTO): Promise<RecipeOutputDTO> {
   try {
     // Validar entrada
     const errors = RecipeDTOMapper.validateUpdateInput(input);
     if (errors.length > 0) {
       throw AppError.badRequest(errors.join(', '));
     }

     // Verificar se receita existe
     const existingRecipe = await this.recipeRepository.findById(id);
     if (!existingRecipe) {
       throw AppError.notFound('Receita não encontrada');
     }

     // Atualizar receita
     const recipe = await this.recipeRepository.update(id, input);

     return RecipeDTOMapper.toOutputDTO(recipe);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar receita');
   }
 }

 /**
  * Deleta receita
  */
 async deleteRecipe(id: number): Promise<void> {
   try {
     // Verificar se receita existe
     const existingRecipe = await this.recipeRepository.findById(id);
     if (!existingRecipe) {
       throw AppError.notFound('Receita não encontrada');
     }

     await this.recipeRepository.delete(id);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao deletar receita');
   }
 }

 /**
  * Conta total de receitas
  */
 async countRecipes(): Promise<number> {
   try {
     return await this.recipeRepository.count();
   } catch (error) {
     throw AppError.internal('Erro ao contar receitas');
   }
 }

 /**
  * Verifica se receita existe
  */
 async recipeExists(id: number): Promise<boolean> {
   try {
     return await this.recipeRepository.existsById(id);
   } catch (error) {
     return false;
   }
 }
}