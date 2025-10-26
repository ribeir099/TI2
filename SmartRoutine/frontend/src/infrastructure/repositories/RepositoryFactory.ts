import { ApiClient } from '@/infrastructure/api/ApiClient';
import { UserRepository } from './UserRepository';
import { FoodItemRepository } from './FoodItemRepository';
import { RecipeRepository } from './RecipeRepository';
import { RegistraRepository } from './RegistraRepository';
import { ReceitaFavoritaRepository } from './ReceitaFavoritaRepository';
import { AlimentoRepository } from './AlimentoRepository';

/**
* Factory para criar instâncias de repositórios
* 
* Responsabilidades:
* - Centralizar criação de repositórios
* - Injetar dependências (ApiClient)
* - Singleton pattern
*/
export class RepositoryFactory {
    private static userRepository?: UserRepository;
    private static foodItemRepository?: FoodItemRepository;
    private static recipeRepository?: RecipeRepository;
    private static registraRepository?: RegistraRepository;
    private static favoritaRepository?: ReceitaFavoritaRepository;
    private static alimentoRepository?: AlimentoRepository;

    /**
     * Cria/obtém UserRepository
     */
    static getUserRepository(apiClient: ApiClient): UserRepository {
        if (!this.userRepository) {
            this.userRepository = new UserRepository(apiClient);
        }
        return this.userRepository;
    }

    /**
     * Cria/obtém FoodItemRepository
     */
    static getFoodItemRepository(apiClient: ApiClient): FoodItemRepository {
        if (!this.foodItemRepository) {
            this.foodItemRepository = new FoodItemRepository(apiClient);
        }
        return this.foodItemRepository;
    }

    /**
     * Cria/obtém RecipeRepository
     */
    static getRecipeRepository(apiClient: ApiClient): RecipeRepository {
        if (!this.recipeRepository) {
            this.recipeRepository = new RecipeRepository(apiClient);
        }
        return this.recipeRepository;
    }

    /**
     * Cria/obtém RegistraRepository
     */
    static getRegistraRepository(apiClient: ApiClient): RegistraRepository {
        if (!this.registraRepository) {
            this.registraRepository = new RegistraRepository(apiClient);
        }
        return this.registraRepository;
    }

    /**
     * Cria/obtém ReceitaFavoritaRepository
     */
    static getReceitaFavoritaRepository(apiClient: ApiClient): ReceitaFavoritaRepository {
        if (!this.favoritaRepository) {
            this.favoritaRepository = new ReceitaFavoritaRepository(apiClient);
        }
        return this.favoritaRepository;
    }

    /**
     * Cria/obtém AlimentoRepository
     */
    static getAlimentoRepository(apiClient: ApiClient): AlimentoRepository {
        if (!this.alimentoRepository) {
            this.alimentoRepository = new AlimentoRepository(apiClient);
        }
        return this.alimentoRepository;
    }

    /**
     * Reseta todos os repositórios (útil para testes)
     */
    static reset(): void {
        this.userRepository = undefined;
        this.foodItemRepository = undefined;
        this.recipeRepository = undefined;
        this.registraRepository = undefined;
        this.favoritaRepository = undefined;
        this.alimentoRepository = undefined;
    }

    /**
     * Cria todas as instâncias de uma vez
     */
    static createAll(apiClient: ApiClient): {
        userRepository: UserRepository;
        foodItemRepository: FoodItemRepository;
        recipeRepository: RecipeRepository;
        registraRepository: RegistraRepository;
        favoritaRepository: ReceitaFavoritaRepository;
        alimentoRepository: AlimentoRepository;
    } {
        return {
            userRepository: this.getUserRepository(apiClient),
            foodItemRepository: this.getFoodItemRepository(apiClient),
            recipeRepository: this.getRecipeRepository(apiClient),
            registraRepository: this.getRegistraRepository(apiClient),
            favoritaRepository: this.getReceitaFavoritaRepository(apiClient),
            alimentoRepository: this.getAlimentoRepository(apiClient)
        };
    }
}