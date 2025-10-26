import { ReceitaFavorita } from '../entities/ReceitaFavorita';

/**
* DTO para criação de favorito
*/
export interface CreateReceitaFavoritaData {
    usuarioId: string;
    receitaId: number;
}

/**
* DTO para estatísticas de favoritos
*/
export interface FavoriteStatistics {
    totalFavoritos: number;
    receitaMaisFavoritada?: {
        receitaId: number;
        titulo: string;
        totalFavoritos: number;
    };
    favoritosRecentes: number; // últimos 7 dias
    categoriasMaisFavoritadas: Array<{ categoria: string; quantidade: number }>;
}

/**
* DTO para receita com contagem de favoritos
*/
export interface RecipeWithFavoriteCount {
    receitaId: number;
    tituloReceita: string;
    totalFavoritos: number;
}

/**
* Interface do Repositório de Receitas Favoritas
* 
* Define o contrato para operações de persistência de favoritos
*/
export interface IReceitaFavoritaRepository {
    /**
     * Lista todos os favoritos
     * @returns Promise com array de favoritos
     */
    findAll(): Promise<ReceitaFavorita[]>;

    /**
     * Busca um favorito por ID
     * @param id - ID do favorito
     * @returns Promise com favorito encontrado ou null
     */
    findById(id: number): Promise<ReceitaFavorita | null>;

    /**
     * Lista todas as receitas favoritas de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com array de favoritos do usuário
     */
    findByUserId(usuarioId: string): Promise<ReceitaFavorita[]>;

    /**
     * Lista todos os usuários que favoritaram uma receita
     * @param receitaId - ID da receita
     * @returns Promise com array de favoritos da receita
     */
    findByRecipeId(receitaId: number): Promise<ReceitaFavorita[]>;

    /**
     * Busca um favorito específico de usuário e receita
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise com favorito encontrado ou null
     */
    findByUserAndRecipe(
        usuarioId: string,
        receitaId: number
    ): Promise<ReceitaFavorita | null>;

    /**
     * Verifica se uma receita é favorita de um usuário
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<boolean>
     */
    isFavorite(usuarioId: string, receitaId: number): Promise<boolean>;

    /**
     * Conta quantos usuários favoritaram uma receita
     * @param receitaId - ID da receita
     * @returns Promise<number>
     */
    countByRecipeId(receitaId: number): Promise<number>;

    /**
     * Conta quantas receitas um usuário favoritou
     * @param usuarioId - ID do usuário
     * @returns Promise<number>
     */
    countByUserId(usuarioId: string): Promise<number>;

    /**
     * Lista receitas favoritas recentes de um usuário
     * @param usuarioId - ID do usuário
     * @param limit - Limite de favoritos (default: 10)
     * @returns Promise com array de favoritos recentes
     */
    findRecentByUserId(usuarioId: string, limit?: number): Promise<ReceitaFavorita[]>;

    /**
     * Lista receitas mais favoritadas (ranking)
     * @param limit - Limite de receitas (default: 10)
     * @returns Promise com array de receitas com contagem
     */
    findMostFavorited(limit?: number): Promise<RecipeWithFavoriteCount[]>;

    /**
     * Lista favoritos por data (intervalo)
     * @param usuarioId - ID do usuário
     * @param dataInicio - Data inicial
     * @param dataFim - Data final
     * @returns Promise com array de favoritos no período
     */
    findByDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<ReceitaFavorita[]>;

    /**
     * Adiciona uma receita aos favoritos
     * @param favoritaData - Dados do favorito
     * @returns Promise com favorito criado
     * @throws Error se já for favorito
     */
    create(favoritaData: CreateReceitaFavoritaData): Promise<ReceitaFavorita>;

    /**
     * Remove uma receita dos favoritos por ID
     * @param id - ID do favorito
     * @returns Promise<void>
     * @throws Error se favorito não existir
     */
    delete(id: number): Promise<void>;

    /**
     * Remove uma receita dos favoritos por usuário e receita
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<void>
     * @throws Error se favorito não existir
     */
    deleteByUserAndRecipe(usuarioId: string, receitaId: number): Promise<void>;

    /**
     * Remove todos os favoritos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Quantidade de favoritos removidos
     */
    deleteAllByUserId(usuarioId: string): Promise<number>;

    /**
     * Remove todos os favoritos de uma receita
     * @param receitaId - ID da receita
     * @returns Promise<number> - Quantidade de favoritos removidos
     */
    deleteAllByRecipeId(receitaId: number): Promise<number>;

    /**
     * Toggle favorito (adiciona se não existir, remove se existir)
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<boolean> - true se adicionou, false se removeu
     */
    toggle(usuarioId: string, receitaId: number): Promise<boolean>;

    /**
     * Obtém estatísticas de favoritos de um usuário
     * @param usuarioId - ID do usuário
     * @returns Promise com estatísticas
     */
    getStatistics(usuarioId: string): Promise<FavoriteStatistics>;

    /**
     * Verifica se um favorito existe
     * @param id - ID do favorito
     * @returns Promise<boolean>
     */
    existsById(id: number): Promise<boolean>;

    /**
     * Busca receitas similares às favoritas do usuário
     * Baseado em tags e ingredientes das receitas favoritas
     * @param usuarioId - ID do usuário
     * @param limit - Limite de receitas (default: 10)
     * @returns Promise com array de IDs de receitas sugeridas
     */
    findSimilarRecipes(usuarioId: string, limit?: number): Promise<number[]>;

    /**
     * Lista IDs das receitas favoritas de um usuário
     * Útil para verificações rápidas
     * @param usuarioId - ID do usuário
     * @returns Promise com array de IDs
     */
    findRecipeIdsByUserId(usuarioId: string): Promise<number[]>;
}