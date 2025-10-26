import { FoodItem } from '../entities/FoodItem';

/**
* DTO para criação de item de alimento
*/
export interface CreateFoodItemData {
    nome: string;
    quantidade: number;
    unidadeMedida: string;
    dataValidade: string;
    categoria: string;
    dataCompra?: string;
    lote?: string;
    usuarioId: string;
    alimentoId?: number;
}

/**
* DTO para atualização de item de alimento
*/
export interface UpdateFoodItemData {
    nome?: string;
    quantidade?: number;
    unidadeMedida?: string;
    dataValidade?: string;
    categoria?: string;
    dataCompra?: string;
    lote?: string;
}

/**
* DTO para filtros de busca de alimentos
*/
export interface FoodItemFilters {
    nome?: string;
    categoria?: string;
    usuarioId?: string;
    dataValidadeInicio?: string;
    dataValidadeFim?: string;
    vencido?: boolean;
    vencendoEmDias?: number;
}

/**
* DTO para ordenação de alimentos
*/
export interface FoodItemSortOptions {
    campo: 'nome' | 'dataValidade' | 'categoria' | 'quantidade' | 'dataCompra';
    ordem: 'asc' | 'desc';
}

/**
* Interface do Repositório de Itens de Alimentos
* 
* Define o contrato para operações de persistência de alimentos na despensa
*/
export interface IFoodItemRepository {
    /**
     * Lista todos os itens de alimentos
     * @returns Promise com array de alimentos
     */
    findAll(): Promise<FoodItem[]>;

    /**
     * Busca um item de alimento por ID
     * @param id - ID do item
     * @returns Promise com alimento encontrado ou null
     */
    findById(id: number): Promise<FoodItem | null>;

    /**
     * Lista todos os alimentos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com array de alimentos do usuário
     */
    findByUserId(usuarioId: string): Promise<FoodItem[]>;

    /**
     * Lista alimentos por categoria
     * @param categoria - Nome da categoria
     * @returns Promise com array de alimentos da categoria
     */
    findByCategory(categoria: string): Promise<FoodItem[]>;

    /**
     * Busca alimentos por nome (busca parcial)
     * @param nome - Nome ou parte do nome
     * @returns Promise com array de alimentos encontrados
     */
    findByName(nome: string): Promise<FoodItem[]>;

    /**
     * Lista alimentos próximos ao vencimento
     * @param usuarioId - ID do usuário
     * @param dias - Número de dias até o vencimento (padrão: 3)
     * @returns Promise com array de alimentos vencendo
     */
    findExpiringItems(usuarioId: string, dias: number): Promise<FoodItem[]>;

    /**
     * Lista alimentos vencidos
     * @param usuarioId - ID do usuário
     * @returns Promise com array de alimentos vencidos
     */
    findExpiredItems(usuarioId: string): Promise<FoodItem[]>;

    /**
     * Lista alimentos frescos (validade > 3 dias)
     * @param usuarioId - ID do usuário
     * @returns Promise com array de alimentos frescos
     */
    findFreshItems(usuarioId: string): Promise<FoodItem[]>;

    /**
     * Busca alimentos com filtros complexos
     * @param filters - Objeto com filtros
     * @returns Promise com array de alimentos filtrados
     */
    findByFilters(filters: FoodItemFilters): Promise<FoodItem[]>;

    /**
     * Busca alimentos com ordenação
     * @param usuarioId - ID do usuário
     * @param sortOptions - Opções de ordenação
     * @returns Promise com array de alimentos ordenados
     */
    findWithSort(usuarioId: string, sortOptions: FoodItemSortOptions): Promise<FoodItem[]>;

    /**
     * Cria um novo item de alimento
     * @param foodData - Dados do alimento
     * @returns Promise com alimento criado
     */
    create(foodData: CreateFoodItemData): Promise<FoodItem>;

    /**
     * Atualiza um item de alimento
     * @param id - ID do item
     * @param foodData - Dados a serem atualizados
     * @returns Promise com alimento atualizado
     * @throws Error se alimento não existir
     */
    update(id: number, foodData: UpdateFoodItemData): Promise<FoodItem>;

    /**
     * Deleta um item de alimento
     * @param id - ID do item
     * @returns Promise<void>
     * @throws Error se alimento não existir
     */
    delete(id: number): Promise<void>;

    /**
     * Deleta todos os alimentos vencidos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Quantidade de itens deletados
     */
    deleteExpiredItems(usuarioId: string): Promise<number>;

    /**
     * Conta total de alimentos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Total de alimentos
     */
    countByUserId(usuarioId: string): Promise<number>;

    /**
     * Conta alimentos por categoria para um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com objeto { categoria: quantidade }
     */
    countByCategory(usuarioId: string): Promise<Record<string, number>>;

    /**
     * Lista categorias disponíveis na despensa do usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com array de categorias únicas
     */
    getCategories(usuarioId: string): Promise<string[]>;

    /**
     * Verifica se um alimento existe
     * @param id - ID do alimento
     * @returns Promise<boolean>
     */
    existsById(id: number): Promise<boolean>;

    /**
     * Busca alimentos por lote
     * @param lote - Número do lote
     * @returns Promise com array de alimentos do lote
     */
    findByLote(lote: string): Promise<FoodItem[]>;

    /**
     * Calcula valor total em dias de alimentos (soma das quantidades × dias até vencer)
     * Útil para métricas de desperdício
     * @param usuarioId - ID do usuário
     * @returns Promise<number>
     */
    calculateTotalShelfLifeValue(usuarioId: string): Promise<number>;
}
