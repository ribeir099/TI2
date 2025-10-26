/**
* Categorias de Alimentos
*/

/**
* Lista de categorias disponíveis
*/
export const FOOD_CATEGORIES = [
    'Laticínios',
    'Carnes',
    'Vegetais',
    'Frutas',
    'Padaria',
    'Grãos',
    'Condimentos',
    'Temperos',
    'Bebidas',
    'Proteínas',
    'Massas',
    'Outros'
] as const;

/**
* Tipo de categoria
*/
export type FoodCategoryType = typeof FOOD_CATEGORIES[number];

/**
* Mapeamento de categorias para ícones (lucide-react)
*/
export const CATEGORY_ICONS: Record<FoodCategoryType, string> = {
    'Laticínios': 'Milk',
    'Carnes': 'Beef',
    'Vegetais': 'Carrot',
    'Frutas': 'Apple',
    'Padaria': 'Croissant',
    'Grãos': 'Wheat',
    'Condimentos': 'Droplet',
    'Temperos': 'Leaf',
    'Bebidas': 'Coffee',
    'Proteínas': 'Egg',
    'Massas': 'UtensilsCrossed',
    'Outros': 'Package'
};

/**
* Mapeamento de categorias para cores
*/
export const CATEGORY_COLORS: Record<FoodCategoryType, string> = {
    'Laticínios': '#3b82f6',   // blue-500
    'Carnes': '#ef4444',       // red-500
    'Vegetais': '#10b981',     // green-500
    'Frutas': '#f59e0b',       // amber-500
    'Padaria': '#d97706',      // amber-600
    'Grãos': '#92400e',        // amber-800
    'Condimentos': '#6366f1',  // indigo-500
    'Temperos': '#22c55e',     // green-500
    'Bebidas': '#06b6d4',      // cyan-500
    'Proteínas': '#f97316',    // orange-500
    'Massas': '#eab308',       // yellow-500
    'Outros': '#6b7280'        // gray-500
};

/**
* Descrições das categorias
*/
export const CATEGORY_DESCRIPTIONS: Record<FoodCategoryType, string> = {
    'Laticínios': 'Leite, queijos, iogurtes e derivados',
    'Carnes': 'Carnes vermelhas, aves e peixes',
    'Vegetais': 'Verduras, legumes e hortaliças',
    'Frutas': 'Frutas frescas e secas',
    'Padaria': 'Pães, bolos e produtos de padaria',
    'Grãos': 'Arroz, feijão, lentilha e outros grãos',
    'Condimentos': 'Molhos, vinagres e condimentos',
    'Temperos': 'Ervas, especiarias e temperos',
    'Bebidas': 'Sucos, refrigerantes, café e chás',
    'Proteínas': 'Ovos, tofu e outras proteínas',
    'Massas': 'Macarrão, massas e similares',
    'Outros': 'Outros produtos alimentícios'
};

/**
* Validade típica por categoria (em dias)
*/
export const CATEGORY_TYPICAL_SHELF_LIFE: Record<FoodCategoryType, number> = {
    'Laticínios': 7,
    'Carnes': 3,
    'Vegetais': 5,
    'Frutas': 7,
    'Padaria': 3,
    'Grãos': 365,
    'Condimentos': 180,
    'Temperos': 365,
    'Bebidas': 30,
    'Proteínas': 7,
    'Massas': 365,
    'Outros': 30
};

/**
* Categorias perecíveis (validade curta)
*/
export const PERISHABLE_CATEGORIES: FoodCategoryType[] = [
    'Laticínios',
    'Carnes',
    'Vegetais',
    'Frutas',
    'Padaria',
    'Proteínas'
];

/**
* Categorias não perecíveis (validade longa)
*/
export const NON_PERISHABLE_CATEGORIES: FoodCategoryType[] = [
    'Grãos',
    'Condimentos',
    'Temperos',
    'Massas'
];

/**
* Opções para select de categorias
*/
export const CATEGORY_OPTIONS = FOOD_CATEGORIES.map(category => ({
    label: category,
    value: category,
    icon: CATEGORY_ICONS[category],
    color: CATEGORY_COLORS[category],
    description: CATEGORY_DESCRIPTIONS[category]
}));