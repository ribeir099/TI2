/**
* Tipos auxiliares para Entidades
*/

import { ID } from "./general.types";

/**
* Base Entity
*/
export interface BaseEntity {
    id: ID;
    createdAt?: string;
    updatedAt?: string;
}

/**
* Entity com timestamps
*/
export interface TimestampedEntity extends BaseEntity {
    createdAt: string;
    updatedAt: string;
}

/**
* Entity auditável
*/
export interface AuditableEntity extends TimestampedEntity {
    createdBy: string;
    updatedBy: string;
}

/**
* Entity com soft delete
*/
export interface SoftDeletableEntity extends TimestampedEntity {
    deletedAt: string | null;
    deletedBy?: string | null;
}

/**
* Status de validade
*/
export type ExpirationStatus = 'fresh' | 'expiring' | 'expired';

/**
* Categoria de alimento
*/
export type FoodCategory =
    | 'Laticínios'
    | 'Carnes'
    | 'Vegetais'
    | 'Frutas'
    | 'Padaria'
    | 'Grãos'
    | 'Condimentos'
    | 'Temperos'
    | 'Bebidas'
    | 'Proteínas'
    | 'Massas'
    | 'Outros';

/**
* Unidade de medida
*/
export type Unit =
    | 'kg'
    | 'g'
    | 'L'
    | 'ml'
    | 'unidade'
    | 'pacote'
    | 'caixa'
    | 'lata'
    | 'garrafa';

/**
* Dificuldade de receita
*/
export type RecipeDifficulty =
    | 'Muito Fácil'
    | 'Fácil'
    | 'Média'
    | 'Difícil'
    | 'Muito Difícil';

/**
* Tipo de refeição
*/
export type MealType =
    | 'Café da Manhã'
    | 'Brunch'
    | 'Almoço'
    | 'Lanche da Tarde'
    | 'Jantar'
    | 'Ceia'
    | 'Sobremesa'
    | 'Bebida';

/**
* Tempo de preparo
*/
export type PrepTime =
    | 'quick'      // 0-15 min
    | 'medium'     // 16-30 min
    | 'long';      // 30+ min

/**
* Classificação de tempo
*/
export type TimeClassification = 'Rápida' | 'Média' | 'Demorada';

/**
* Tag de receita
*/
export type RecipeTag = string;

/**
* Restrição alimentar
*/
export type DietaryRestriction =
    | 'vegetariano'
    | 'vegano'
    | 'sem glúten'
    | 'sem lactose'
    | 'low-carb'
    | 'keto'
    | 'paleo'
    | 'sem açúcar'
    | 'sem sódio';

/**
* Tipo de usuário
*/
export type UserRole = 'user' | 'admin' | 'moderator';

/**
* Status da conta
*/
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'deleted';