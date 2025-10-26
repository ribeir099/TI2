/**
* Barrel export de todas as interfaces de repositórios do domínio
* 
* Facilita imports:
* import { 
*   IUserRepository, 
*   IFoodItemRepository, 
*   IRecipeRepository 
* } from '@/domain/repositories';
*/

// User Repository
export * from './IUserRepository';

// Food Item Repository
export * from './IFoodItemRepository';

// Recipe Repository
export * from './IRecipeRepository';

// Registra Repository
export * from './IRegistraRepository';

// Receita Favorita Repository
export * from './IReceitaFavoritaRepository';