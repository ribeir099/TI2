import { Registra } from '../entities/Registra';

/**
* DTO para criação de registro de compra
*/
export interface CreateRegistraData {
    usuarioId: string;
    alimentoId: number;
    dataCompra: string;
    dataValidade: string;
    quantidade: number;
    unidadeMedida: string;
    lote?: string;
}

/**
* DTO para atualização de registro de compra
*/
export interface UpdateRegistraData {
    dataCompra?: string;
    dataValidade?: string;
    quantidade?: number;
    unidadeMedida?: string;
    lote?: string;
}

/**
* DTO para filtros de busca de registros
*/
export interface RegistraFilters {
    usuarioId?: string;
    alimentoId?: number;
    dataCompraInicio?: string;
    dataCompraFim?: string;
    dataValidadeInicio?: string;
    dataValidadeFim?: string;
    lote?: string;
}

/**
* DTO para estatísticas de compras
*/
export interface PurchaseStatistics {
    totalCompras: number;
    totalItens: number;
    produtosVencidos: number;
    produtosVencendo: number;
    produtosFrescos: number;
    categoriasMaisCompradas: Array<{ categoria: string; quantidade: number }>;
    alimentosMaisComprados: Array<{ alimento: string; quantidade: number }>;
}

/**
* Interface do Repositório de Registros de Compra
* 
* Define o contrato para operações de persistência de registros de compras
*/
export interface IRegistraRepository {
    /**
     * Lista todos os registros
     * @returns Promise com array de registros
     */
    findAll(): Promise<Registra[]>;

    /**
     * Busca um registro por ID
     * @param id - ID do registro
     * @returns Promise com registro encontrado ou null
     */
    findById(id: number): Promise<Registra | null>;

    /**
     * Lista todos os registros de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com array de registros
     */
    findByUserId(usuarioId: string): Promise<Registra[]>;

    /**
     * Lista todos os registros de um alimento
     * @param alimentoId - ID do alimento
     * @returns Promise com array de registros
     */
    findByFoodId(alimentoId: number): Promise<Registra[]>;

    /**
     * Busca registros por período de compra
     * @param usuarioId - ID do usuário
     * @param dataInicio - Data inicial
     * @param dataFim - Data final
     * @returns Promise com array de registros
     */
    findByPurchaseDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<Registra[]>;

    /**
     * Busca registros por período de validade
     * @param usuarioId - ID do usuário
     * @param dataInicio - Data inicial
     * @param dataFim - Data final
     * @returns Promise com array de registros
     */
    findByExpirationDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<Registra[]>;

    /**
     * Lista registros próximos ao vencimento
     * @param usuarioId - ID do usuário
     * @param dias - Número de dias até o vencimento
     * @returns Promise com array de registros
     */
    findExpiringItems(usuarioId: string, dias: number): Promise<Registra[]>;

    /**
     * Lista registros vencidos
     * @param usuarioId - ID do usuário
     * @returns Promise com array de registros vencidos
     */
    findExpiredItems(usuarioId: string): Promise<Registra[]>;

    /**
     * Lista registros frescos (validade > 3 dias)
     * @param usuarioId - ID do usuário
     * @returns Promise com array de registros frescos
     */
    findFreshItems(usuarioId: string): Promise<Registra[]>;

    /**
     * Busca registros por lote
     * @param lote - Número do lote
     * @returns Promise com array de registros do lote
     */
    findByLote(lote: string): Promise<Registra[]>;

    /**
     * Busca registros com filtros complexos
     * @param filters - Objeto com filtros
     * @returns Promise com array de registros filtrados
     */
    findByFilters(filters: RegistraFilters): Promise<Registra[]>;

    /**
     * Cria um novo registro de compra
     * @param registraData - Dados do registro
     * @returns Promise com registro criado
     */
    create(registraData: CreateRegistraData): Promise<Registra>;

    /**
     * Atualiza um registro de compra
     * @param id - ID do registro
     * @param registraData - Dados a serem atualizados
     * @returns Promise com registro atualizado
     * @throws Error se registro não existir
     */
    update(id: number, registraData: UpdateRegistraData): Promise<Registra>;

    /**
     * Deleta um registro de compra
     * @param id - ID do registro
     * @returns Promise<void>
     * @throws Error se registro não existir
     */
    delete(id: number): Promise<void>;

    /**
     * Deleta todos os registros vencidos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Quantidade de registros deletados
     */
    deleteExpiredItems(usuarioId: string): Promise<number>;

    /**
     * Conta total de registros de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number>
     */
    countByUserId(usuarioId: string): Promise<number>;

    /**
     * Conta registros vencidos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number>
     */
    countExpiredItems(usuarioId: string): Promise<number>;

    /**
     * Conta registros vencendo em breve de um usuário
     * @param usuarioId - ID do usuário
     * @param dias - Número de dias até o vencimento
     * @returns Promise<number>
     */
    countExpiringItems(usuarioId: string, dias: number): Promise<number>;

    /**
     * Busca o último registro de compra de um alimento para um usuário
     * @param usuarioId - ID do usuário
     * @param alimentoId - ID do alimento
     * @returns Promise com registro mais recente ou null
     */
    findLastPurchase(usuarioId: string, alimentoId: number): Promise<Registra | null>;

    /**
     * Busca compras recentes de um usuário
     * @param usuarioId - ID do usuário
     * @param limit - Limite de registros (default: 10)
     * @returns Promise com array de registros mais recentes
     */
    findRecentPurchases(usuarioId: string, limit?: number): Promise<Registra[]>;

    /**
     * Obtém estatísticas de compras de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com estatísticas
     */
    getStatistics(usuarioId: string): Promise<PurchaseStatistics>;

    /**
     * Verifica se um registro existe
     * @param id - ID do registro
     * @returns Promise<boolean>
     */
    existsById(id: number): Promise<boolean>;

    /**
     * Calcula quantidade total de um alimento para um usuário
     * @param usuarioId - ID do usuário
     * @param alimentoId - ID do alimento
     * @returns Promise<number> - Soma das quantidades
     */
    calculateTotalQuantity(usuarioId: string, alimentoId: number): Promise<number>;
}