import { Recipe } from '../entities/Recipe';

/**
* DTO para criação de receita
*/
export interface CreateRecipeData {
    titulo: string;
    tempoPreparo: number;
    porcao: string;
    imagem?: string;
    ingredientes: string[];
    modoPreparo: string[];
    dificuldade?: string;
    tipoRefeicao?: string;
    calorias?: number;
    tags?: string[];
}

/**
* DTO para atualização de receita
*/
export interface UpdateRecipeData {
    titulo?: string;
    tempoPreparo?: number;
    porcao?: string;
    imagem?: string;
    ingredientes?: string[];
    modoPreparo?: string[];
    dificuldade?: string;
    tipoRefeicao?: string;
    calorias?: number;
    tags?: string[];
}

/**
* DTO para filtros de busca de receitas
*/
export interface RecipeFilters {
    titulo?: string;
    tempoPreparoMax?: number;
    tempoPreparoMin?: number;
    dificuldade?: string;
    tipoRefeicao?: string;
    caloriasMax?: number;
    caloriasMin?: number;
    tags?: string[];
    ingredientes?: string[];
}

/**
* DTO para ordenação de receitas
*/
export interface RecipeSortOptions {
    campo: 'titulo' | 'tempoPreparo' | 'calorias';
    ordem: 'asc' | 'desc';
}

/**
* Interface do Repositório de Receitas
* 
* Define o contrato para operações de persistência de receitas
*/
export interface IRecipeRepository {
    /**
     * Lista todas as receitas
     * @returns Promise com array de receitas
     */
    findAll(): Promise<Recipe[]>;

    /**
     * Busca uma receita por ID
     * @param id - ID da receita
     * @returns Promise com receita encontrada ou null
     */
    findById(id: number): Promise<Recipe | null>;

    /**
     * Busca receitas por título (busca parcial)
     * @param titulo - Título ou parte do título
     * @returns Promise com array de receitas encontradas
     */
    findByTitle(titulo: string): Promise<Recipe[]>;

    /**
     * Busca receitas por tag
     * @param tag - Tag da receita
     * @returns Promise com array de receitas com a tag
     */
    findByTag(tag: string): Promise<Recipe[]>;

    /**
     * Busca receitas por múltiplas tags (AND)
     * @param tags - Array de tags
     * @returns Promise com array de receitas que contêm todas as tags
     */
    findByTags(tags: string[]): Promise<Recipe[]>;

    /**
     * Busca receitas com tempo de preparo até o máximo especificado
     * @param tempoMaximo - Tempo máximo em minutos
     * @returns Promise com array de receitas
     */
    findByMaxTime(tempoMaximo: number): Promise<Recipe[]>;

    /**
     * Busca receitas por faixa de tempo de preparo
     * @param tempoMinimo - Tempo mínimo em minutos
     * @param tempoMaximo - Tempo máximo em minutos
     * @returns Promise com array de receitas
     */
    findByTimeRange(tempoMinimo: number, tempoMaximo: number): Promise<Recipe[]>;

    /**
     * Busca receitas por dificuldade
     * @param dificuldade - Nível de dificuldade
     * @returns Promise com array de receitas
     */
    findByDifficulty(dificuldade: string): Promise<Recipe[]>;

    /**
     * Busca receitas por tipo de refeição
     * @param tipoRefeicao - Tipo de refeição
     * @returns Promise com array de receitas
     */
    findByMealType(tipoRefeicao: string): Promise<Recipe[]>;

    /**
     * Busca receitas por ingrediente
     * @param ingrediente - Nome do ingrediente
     * @returns Promise com array de receitas que contêm o ingrediente
     */
    findByIngredient(ingrediente: string): Promise<Recipe[]>;

    /**
     * Busca receitas por múltiplos ingredientes
     * @param ingredientes - Array de ingredientes
     * @param matchAll - Se true, receita deve ter TODOS os ingredientes (default: false)
     * @returns Promise com array de receitas
     */
    findByIngredients(ingredientes: string[], matchAll?: boolean): Promise<Recipe[]>;

    /**
     * Busca receitas com filtros complexos
     * @param filters - Objeto com filtros
     * @returns Promise com array de receitas filtradas
     */
    findByFilters(filters: RecipeFilters): Promise<Recipe[]>;

    /**
     * Busca receitas com ordenação
     * @param sortOptions - Opções de ordenação
     * @returns Promise com array de receitas ordenadas
     */
    findWithSort(sortOptions: RecipeSortOptions): Promise<Recipe[]>;

    /**
     * Busca receitas rápidas (tempo <= 30 minutos)
     * @returns Promise com array de receitas rápidas
     */
    findQuickRecipes(): Promise<Recipe[]>;

    /**
     * Busca receitas por faixa de calorias
     * @param caloriasMin - Calorias mínimas
     * @param caloriasMax - Calorias máximas
     * @returns Promise com array de receitas
     */
    findByCaloriesRange(caloriasMin: number, caloriasMax: number): Promise<Recipe[]>;

    /**
     * Cria uma nova receita
     * @param recipeData - Dados da receita
     * @returns Promise com receita criada
     */
    create(recipeData: CreateRecipeData): Promise<Recipe>;

    /**
     * Atualiza uma receita
     * @param id - ID da receita
     * @param recipeData - Dados a serem atualizados
     * @returns Promise com receita atualizada
     * @throws Error se receita não existir
     */
    update(id: number, recipeData: UpdateRecipeData): Promise<Recipe>;

    /**
     * Deleta uma receita
     * @param id - ID da receita
     * @returns Promise<void>
     * @throws Error se receita não existir
     */
    delete(id: number): Promise<void>;

    /**
     * Conta total de receitas
     * @returns Promise<number>
     */
    count(): Promise<number>;

    /**
     * Lista todas as tags disponíveis
     * @returns Promise com array de tags únicas
     */
    getAllTags(): Promise<string[]>;

    /**
     * Lista todos os tipos de refeição disponíveis
     * @returns Promise com array de tipos únicos
     */
    getAllMealTypes(): Promise<string[]>;

    /**
     * Lista todas as dificuldades disponíveis
     * @returns Promise com array de dificuldades únicas
     */
    getAllDifficulties(): Promise<string[]>;

    /**
     * Busca receitas populares (mais favoritadas)
     * @param limit - Limite de receitas (default: 10)
     * @returns Promise com array de receitas populares
     */
    findPopular(limit?: number): Promise<Recipe[]>;

    /**
     * Busca receitas recentes (últimas adicionadas)
     * @param limit - Limite de receitas (default: 10)
     * @returns Promise com array de receitas recentes
     */
    findRecent(limit?: number): Promise<Recipe[]>;

    /**
     * Verifica se uma receita existe
     * @param id - ID da receita
     * @returns Promise<boolean>
     */
    existsById(id: number): Promise<boolean>;
}