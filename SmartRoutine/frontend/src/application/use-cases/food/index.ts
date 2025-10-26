/**
* Barrel export de todos os Use Cases de alimentos
* 
* Facilita imports:
* import { 
*   AddFoodItemUseCase, 
*   GetExpiringItemsUseCase,
*   DeleteExpiredItemsUseCase 
* } from '@/application/use-cases/food';
*/

export * from './AddFoodItemUseCase';
export * from './UpdateFoodItemUseCase';
export * from './DeleteFoodItemUseCase';
export * from './GetFoodItemsUseCase';
export * from './GetExpiringItemsUseCase';
export * from './GetExpiredItemsUseCase';
export * from './SearchFoodItemsUseCase';
export * from './FilterByCategoryUseCase';
export * from './ExportPantryPDFUseCase';
export * from './GetFoodStatisticsUseCase';
export * from './DeleteExpiredItemsUseCase';
export * from './BulkFoodOperationsUseCase';
