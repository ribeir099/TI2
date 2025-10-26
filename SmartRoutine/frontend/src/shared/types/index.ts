/**
* Barrel export de todos os tipos compartilhados
* 
* Facilita imports:
* import { 
*   User, 
*   Recipe, 
*   PaginationParams,
*   ApiSuccessResponse 
* } from '@/shared/types';
*/

// Re-export de todos os módulos de tipos
export * from './api.types';
export * from './common.types';
export * from './form.types';
export * from './navigation.types';
export * from './pagination.types';
export * from './filter.types';
export * from './entity.types';
export * from './response.types';
export * from './error.types';
export * from './event.types';
export * from './component.types';
export * from './state.types';
export * from './hook.types';
export * from './data.types';
export * from './notification.types';
export * from './theme.types';
export * from './analytics.types';
export * from './config.types';
export * from './result.types';
export * from './utility.types';
export * from './context.types';

// Re-exports de tipos base do arquivo principal
export type {
 ID,
 UserId,
 RecipeId,
 FoodItemId,
 FavoriteId,
 Status,
 NetworkStatus,
 Page,
 Theme,
 Language,
 SortOrder,
 Density,
 NotificationType,
 AlertType,
 ComponentVariant,
 ComponentSize,
 Position,
 Alignment,
 FileType,
 ExportFormat,
 ImportFormat,
 Nullable,
 Optional,
 Maybe,
 Mutable,
 DeepPartial,
 DeepReadonly,
 ValueOf,
 AsyncReturnType,
 Constructor,
 AnyFunction,
 Callback,
 EventHandler,
 Promisify,
 Dictionary
} from './general.types';