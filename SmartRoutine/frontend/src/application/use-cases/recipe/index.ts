/**
* Barrel export de todos os Use Cases de receitas
* 
* Facilita imports:
* import { 
*   AddRecipeUseCase, 
*   GetRecipesByMatchUseCase,
*   GenerateAIRecipeUseCase 
* } from '@/application/use-cases/recipe';
*/

export * from './AddRecipeUseCase';
export * from './UpdateRecipeUseCase';
export * from './DeleteRecipeUseCase';
export * from './GetRecipesUseCase';
export * from './SearchRecipesUseCase';
export * from './FilterRecipesByTimeUseCase';
export * from './FilterRecipesByTagUseCase';
export * from './FilterRecipesByIngredientUseCase';
export * from './GetRecipesByMatchUseCase';
export * from './GenerateAIRecipeUseCase';
export * from './GetRecipeStatisticsUseCase';
export * from './BulkRecipeOperationsUseCase';
export * from './GetRecipeByIdUseCase';
export * from './FilterRecipesByFiltersUseCase';
export * from './GetRecipeRecommendationsUseCase';