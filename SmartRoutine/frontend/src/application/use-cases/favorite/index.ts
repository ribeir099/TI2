/**
* Barrel export de todos os Use Cases de favoritos
* 
* Facilita imports:
* import { 
*   AddFavoriteUseCase, 
*   RemoveFavoriteUseCase, 
*   ToggleFavoriteUseCase 
* } from '@/application/use-cases/favorite';
*/

export * from './AddFavoriteUseCase';
export * from './RemoveFavoriteUseCase';
export * from './ToggleFavoriteUseCase';
export * from './GetUserFavoritesUseCase';
export * from './CheckIsFavoriteUseCase';
export * from './CountFavoritesUseCase';
export * from './GetMostFavoritedRecipesUseCase';
export * from './GetFavoriteStatisticsUseCase';
export * from './GetSimilarRecipesUseCase';
export * from './GetRecipesByFavoriteUserUseCase';
export * from './GetFavoriteByIdUseCase';
export * from './BulkFavoriteOperationsUseCase';
export * from './ExportFavoritesUseCase';
