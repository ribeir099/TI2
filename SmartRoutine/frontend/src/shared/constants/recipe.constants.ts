/**
* Constantes de Receitas
*/

import { DIFFICULTY_COLORS } from "./colors";

/**
* Dificuldades de receita
*/
export const RECIPE_DIFFICULTIES = [
    'Muito Fácil',
    'Fácil',
    'Média',
    'Difícil',
    'Muito Difícil'
] as const;

export type RecipeDifficulty = typeof RECIPE_DIFFICULTIES[number];

/**
* Tipos de refeição
*/
export const MEAL_TYPES = [
    'Café da Manhã',
    'Brunch',
    'Almoço',
    'Lanche da Tarde',
    'Jantar',
    'Ceia',
    'Sobremesa',
    'Bebida',
    'Aperitivo'
] as const;

export type MealType = typeof MEAL_TYPES[number];

/**
* Tags comuns de receitas
*/
export const COMMON_RECIPE_TAGS = [
    'rápida',
    'fácil',
    'saudável',
    'vegetariano',
    'vegano',
    'sem glúten',
    'sem lactose',
    'low-carb',
    'fitness',
    'proteico',
    'diet',
    'comfort-food',
    'gourmet',
    'econômica',
    'festiva',
    'infantil'
] as const;

/**
* Estilos de cozinha
*/
export const CUISINE_STYLES = [
    'Brasileira',
    'Italiana',
    'Japonesa',
    'Chinesa',
    'Mexicana',
    'Indiana',
    'Tailandesa',
    'Francesa',
    'Americana',
    'Mediterrânea',
    'Árabe',
    'Coreana',
    'Peruana',
    'Portuguesa',
    'Espanhola'
] as const;

/**
* Classificações de tempo
*/
export const TIME_CLASSIFICATIONS = {
    VERY_QUICK: { max: 15, label: 'Muito Rápida' },
    QUICK: { min: 16, max: 30, label: 'Rápida' },
    MEDIUM: { min: 31, max: 60, label: 'Média' },
    LONG: { min: 61, max: 120, label: 'Demorada' },
    VERY_LONG: { min: 121, label: 'Muito Demorada' }
} as const;

/**
* Classificações de calorias
*/
export const CALORIE_CLASSIFICATIONS = {
    LOW: { max: 300, label: 'Baixa Caloria' },
    MEDIUM: { min: 301, max: 500, label: 'Média Caloria' },
    HIGH: { min: 501, label: 'Alta Caloria' }
} as const;

/**
* Restrições alimentares
*/
export const DIETARY_RESTRICTIONS = [
    'vegetariano',
    'vegano',
    'sem glúten',
    'sem lactose',
    'sem açúcar',
    'sem sódio',
    'low-carb',
    'keto',
    'paleo',
    'sem nozes',
    'sem frutos do mar',
    'halal',
    'kosher'
] as const;

/**
* Métodos de cozimento
*/
export const COOKING_METHODS = [
    'Assado',
    'Grelhado',
    'Frito',
    'Cozido',
    'Refogado',
    'Vapor',
    'Microondas',
    'Air Fryer',
    'Slow Cooker',
    'Pressure Cooker',
    'Cru'
] as const;

/**
* Opções de dificuldade para select
*/
export const DIFFICULTY_OPTIONS = RECIPE_DIFFICULTIES.map(difficulty => ({
    label: difficulty,
    value: difficulty,
    color: DIFFICULTY_COLORS[difficulty]
}));

/**
* Opções de tipo de refeição para select
*/
export const MEAL_TYPE_OPTIONS = MEAL_TYPES.map(type => ({
    label: type,
    value: type
}));
