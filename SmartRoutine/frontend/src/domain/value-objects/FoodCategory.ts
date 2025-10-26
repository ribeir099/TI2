/**
* Categorias de alimentos disponíveis no sistema
*/
export enum FoodCategoryEnum {
    LATICINIOS = 'Laticínios',
    CARNES = 'Carnes',
    VEGETAIS = 'Vegetais',
    FRUTAS = 'Frutas',
    PADARIA = 'Padaria',
    GRAOS = 'Grãos',
    CONDIMENTOS = 'Condimentos',
    TEMPEROS = 'Temperos',
    BEBIDAS = 'Bebidas',
    PROTEINAS = 'Proteínas',
    MASSAS = 'Massas',
    OUTROS = 'Outros'
}

/**
* Value Object para Categoria de Alimentos
* 
* Responsabilidades:
* - Validar categorias de alimentos
* - Fornecer informações sobre cada categoria
* - Centralizar lógica de categorização
*/
export class FoodCategory {
    private readonly category: FoodCategoryEnum;

    private constructor(category: FoodCategoryEnum) {
        this.category = category;
    }

    /**
     * Cria uma FoodCategory validando o valor
     */
    static create(category: string): FoodCategory {
        const normalizedCategory = this.normalize(category);

        if (!this.isValid(normalizedCategory)) {
            throw new Error(`Categoria inválida: ${category}. Use uma das categorias disponíveis.`);
        }

        return new FoodCategory(normalizedCategory as FoodCategoryEnum);
    }

    /**
     * Normaliza o nome da categoria (capitaliza)
     */
    static normalize(category: string): string {
        if (!category) return '';

        const trimmed = category.trim();

        // Tenta encontrar correspondência exata (case-insensitive)
        const allCategories = Object.values(FoodCategoryEnum);
        const found = allCategories.find(
            cat => cat.toLowerCase() === trimmed.toLowerCase()
        );

        if (found) {
            return found;
        }

        // Se não encontrou, retorna capitalizado
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    /**
     * Valida se a categoria existe
     */
    static isValid(category: string): boolean {
        const allCategories = Object.values(FoodCategoryEnum);
        return allCategories.some(
            cat => cat.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Retorna o valor da categoria
     */
    getValue(): FoodCategoryEnum {
        return this.category;
    }

    /**
     * Retorna o nome da categoria como string
     */
    toString(): string {
        return this.category;
    }

    /**
     * Retorna a chave enum da categoria
     */
    get key(): string {
        const entries = Object.entries(FoodCategoryEnum);
        const found = entries.find(([_, value]) => value === this.category);
        return found ? found[0] : '';
    }

    /**
     * Retorna ícone sugerido para a categoria (lucide-react)
     */
    get icon(): string {
        return FoodCategory.getIcon(this.category);
    }

    /**
     * Retorna ícone estático
     */
    static getIcon(category: FoodCategoryEnum | string): string {
        const icons: Record<string, string> = {
            [FoodCategoryEnum.LATICINIOS]: 'Milk',
            [FoodCategoryEnum.CARNES]: 'Beef',
            [FoodCategoryEnum.VEGETAIS]: 'Carrot',
            [FoodCategoryEnum.FRUTAS]: 'Apple',
            [FoodCategoryEnum.PADARIA]: 'Croissant',
            [FoodCategoryEnum.GRAOS]: 'Wheat',
            [FoodCategoryEnum.CONDIMENTOS]: 'Droplet',
            [FoodCategoryEnum.TEMPEROS]: 'Leaf',
            [FoodCategoryEnum.BEBIDAS]: 'Coffee',
            [FoodCategoryEnum.PROTEINAS]: 'Egg',
            [FoodCategoryEnum.MASSAS]: 'UtensilsCrossed',
            [FoodCategoryEnum.OUTROS]: 'Package'
        };
        return icons[category.toString()] || 'Package';
    }

    /**
     * Retorna cor sugerida para a categoria
     */
    get color(): string {
        return FoodCategory.getColor(this.category);
    }

    /**
     * Retorna cor estática
     */
    static getColor(category: FoodCategoryEnum | string): string {
        const colors: Record<string, string> = {
            [FoodCategoryEnum.LATICINIOS]: '#3b82f6',   // blue-500
            [FoodCategoryEnum.CARNES]: '#ef4444',       // red-500
            [FoodCategoryEnum.VEGETAIS]: '#10b981',     // green-500
            [FoodCategoryEnum.FRUTAS]: '#f59e0b',       // amber-500
            [FoodCategoryEnum.PADARIA]: '#d97706',      // amber-600
            [FoodCategoryEnum.GRAOS]: '#92400e',        // amber-800
            [FoodCategoryEnum.CONDIMENTOS]: '#6366f1',  // indigo-500
            [FoodCategoryEnum.TEMPEROS]: '#22c55e',     // green-500
            [FoodCategoryEnum.BEBIDAS]: '#06b6d4',      // cyan-500
            [FoodCategoryEnum.PROTEINAS]: '#f97316',    // orange-500
            [FoodCategoryEnum.MASSAS]: '#eab308',       // yellow-500
            [FoodCategoryEnum.OUTROS]: '#6b7280'        // gray-500
        };
        return colors[category.toString()] || '#6b7280';
    }

    /**
     * Retorna descrição da categoria
     */
    get description(): string {
        return FoodCategory.getDescription(this.category);
    }

    /**
     * Retorna descrição estática
     */
    static getDescription(category: FoodCategoryEnum | string): string {
        const descriptions: Record<string, string> = {
            [FoodCategoryEnum.LATICINIOS]: 'Leite, queijos, iogurtes e derivados',
            [FoodCategoryEnum.CARNES]: 'Carnes vermelhas, aves e peixes',
            [FoodCategoryEnum.VEGETAIS]: 'Verduras, legumes e hortaliças',
            [FoodCategoryEnum.FRUTAS]: 'Frutas frescas e secas',
            [FoodCategoryEnum.PADARIA]: 'Pães, bolos e produtos de padaria',
            [FoodCategoryEnum.GRAOS]: 'Arroz, feijão, lentilha e outros grãos',
            [FoodCategoryEnum.CONDIMENTOS]: 'Molhos, vinagres e condimentos',
            [FoodCategoryEnum.TEMPEROS]: 'Ervas, especiarias e temperos',
            [FoodCategoryEnum.BEBIDAS]: 'Sucos, refrigerantes, café e chás',
            [FoodCategoryEnum.PROTEINAS]: 'Ovos, tofu e outras proteínas',
            [FoodCategoryEnum.MASSAS]: 'Macarrão, massas e similares',
            [FoodCategoryEnum.OUTROS]: 'Outros produtos alimentícios'
        };
        return descriptions[category.toString()] || 'Categoria geral';
    }

    /**
     * Retorna validade típica em dias para a categoria
     */
    get typicalShelfLifeDays(): number {
        return FoodCategory.getTypicalShelfLifeDays(this.category);
    }

    /**
     * Retorna validade típica estática
     */
    static getTypicalShelfLifeDays(category: FoodCategoryEnum | string): number {
        const shelfLife: Record<string, number> = {
            [FoodCategoryEnum.LATICINIOS]: 7,
            [FoodCategoryEnum.CARNES]: 3,
            [FoodCategoryEnum.VEGETAIS]: 5,
            [FoodCategoryEnum.FRUTAS]: 7,
            [FoodCategoryEnum.PADARIA]: 3,
            [FoodCategoryEnum.GRAOS]: 365,
            [FoodCategoryEnum.CONDIMENTOS]: 180,
            [FoodCategoryEnum.TEMPEROS]: 365,
            [FoodCategoryEnum.BEBIDAS]: 30,
            [FoodCategoryEnum.PROTEINAS]: 7,
            [FoodCategoryEnum.MASSAS]: 365,
            [FoodCategoryEnum.OUTROS]: 30
        };
        return shelfLife[category.toString()] || 30;
    }

    /**
     * Verifica se é categoria perecível (validade curta)
     */
    get isPerishable(): boolean {
        return this.typicalShelfLifeDays <= 7;
    }

    /**
     * Verifica se é categoria não perecível (validade longa)
     */
    get isNonPerishable(): boolean {
        return this.typicalShelfLifeDays > 180;
    }

    /**
     * Retorna sugestões de armazenamento
     */
    get storageRecommendation(): string {
        const recommendations: Record<string, string> = {
            [FoodCategoryEnum.LATICINIOS]: 'Manter refrigerado entre 2°C e 5°C',
            [FoodCategoryEnum.CARNES]: 'Manter congelado ou refrigerado abaixo de 4°C',
            [FoodCategoryEnum.VEGETAIS]: 'Manter em local fresco ou refrigerado',
            [FoodCategoryEnum.FRUTAS]: 'Manter em local fresco e arejado',
            [FoodCategoryEnum.PADARIA]: 'Manter em local seco e arejado',
            [FoodCategoryEnum.GRAOS]: 'Manter em local seco e protegido da luz',
            [FoodCategoryEnum.CONDIMENTOS]: 'Manter em local fresco e seco',
            [FoodCategoryEnum.TEMPEROS]: 'Manter em local seco protegido da luz e umidade',
            [FoodCategoryEnum.BEBIDAS]: 'Manter em local fresco',
            [FoodCategoryEnum.PROTEINAS]: 'Manter refrigerado',
            [FoodCategoryEnum.MASSAS]: 'Manter em local seco',
            [FoodCategoryEnum.OUTROS]: 'Verificar instruções da embalagem'
        };
        return recommendations[this.category] || 'Armazenar adequadamente';
    }

    /**
     * Compara com outra FoodCategory
     */
    equals(other: FoodCategory): boolean {
        if (!(other instanceof FoodCategory)) {
            return false;
        }
        return this.category === other.category;
    }

    /**
     * Compara com uma string
     */
    equalsString(category: string): boolean {
        return this.category.toLowerCase() === category.toLowerCase();
    }

    /**
     * Serialização JSON
     */
    toJSON(): string {
        return this.category;
    }

    /**
     * Lista todas as categorias
     */
    static all(): FoodCategoryEnum[] {
        return Object.values(FoodCategoryEnum);
    }

    /**
     * Retorna todas as categorias como FoodCategory
     */
    static allAsVO(): FoodCategory[] {
        return FoodCategory.all().map(cat => new FoodCategory(cat));
    }

    /**
     * Retorna todas as categorias com metadados
     */
    static allWithMetadata(): Array<{
        value: FoodCategoryEnum;
        label: string;
        icon: string;
        color: string;
        description: string;
    }> {
        return FoodCategory.all().map(cat => ({
            value: cat,
            label: cat,
            icon: FoodCategory.getIcon(cat),
            color: FoodCategory.getColor(cat),
            description: FoodCategory.getDescription(cat)
        }));
    }
}