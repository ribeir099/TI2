/**
* Barrel export de todos os repositórios
* 
* Facilita imports:
* import { 
*   UserRepository, 
*   FoodItemRepository,
*   RepositoryFactory 
* } from '@/infrastructure/repositories';
*/

// Repositories
export * from './UserRepository';
export * from './FoodItemRepository';
export * from './RecipeRepository';
export * from './RegistraRepository';
export * from './ReceitaFavoritaRepository';
export * from './AlimentoRepository';

// Factory
export * from './RepositoryFactory';