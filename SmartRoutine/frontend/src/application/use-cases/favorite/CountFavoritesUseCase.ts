import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado de contagem de favoritos
*/
export interface FavoriteCountResult {
    totalFavoritos: number;
    favoritosRecentes: number;
    favoritosAntigos: number;
}

/**
* Use Case: Contar Favoritos
* 
* Responsabilidade:
* - Contar favoritos por usuário
* - Contar favoritos por receita
* - Estatísticas de contagem
*/
export class CountFavoritesUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Conta favoritos de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Total de favoritos
     */
    async executeByUser(usuarioId: string): Promise<number> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.favoritaRepository.countByUserId(usuarioId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CountFavoritesUseCase (by user):', error);
            throw AppError.internal('Erro ao contar favoritos do usuário');
        }
    }

    /**
     * Conta favoritos de uma receita
     * 
     * @param receitaId - ID da receita
     * @returns Promise<number> - Total de favoritos
     */
    async executeByRecipe(receitaId: number): Promise<number> {
        try {
            if (!receitaId || receitaId <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            return await this.favoritaRepository.countByRecipeId(receitaId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CountFavoritesUseCase (by recipe):', error);
            throw AppError.internal('Erro ao contar favoritos da receita');
        }
    }

    /**
     * Conta favoritos com detalhes (recentes vs antigos)
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FavoriteCountResult> - Contagem detalhada
     */
    async executeDetailed(usuarioId: string): Promise<FavoriteCountResult> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            const favoritas = await this.favoritaRepository.findByUserId(usuarioId);

            const total = favoritas.length;
            const recentes = favoritas.filter(f => f.isFavoritoRecente).length;
            const antigos = favoritas.filter(f => f.isFavoritoAntigo).length;

            return {
                totalFavoritos: total,
                favoritosRecentes: recentes,
                favoritosAntigos: antigos
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CountFavoritesUseCase (detailed):', error);
            throw AppError.internal('Erro ao contar favoritos detalhados');
        }
    }

    /**
     * Conta favoritos de múltiplas receitas
     * 
     * @param receitaIds - Array de IDs de receitas
     * @returns Promise<Map<number, number>> - Map de receitaId → total
     */
    async executeBatch(receitaIds: number[]): Promise<Map<number, number>> {
        try {
            if (!receitaIds || receitaIds.length === 0) {
                return new Map();
            }

            const result = new Map<number, number>();

            // Contar cada receita (paralelo)
            await Promise.all(
                receitaIds.map(async (receitaId) => {
                    try {
                        const count = await this.favoritaRepository.countByRecipeId(receitaId);
                        result.set(receitaId, count);
                    } catch (error) {
                        result.set(receitaId, 0);
                    }
                })
            );

            return result;
        } catch (error) {
            console.error('Erro no CountFavoritesUseCase (batch):', error);
            return new Map();
        }
    }

    /**
     * Verifica se usuário tem favoritos
     */
    async hasFavorites(usuarioId: string): Promise<boolean> {
        try {
            const count = await this.executeByUser(usuarioId);
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se receita tem favoritos
     */
    async hasBeenFavorited(receitaId: number): Promise<boolean> {
        try {
            const count = await this.executeByRecipe(receitaId);
            return count > 0;
        } catch (error) {
            return false;
        }
    }
}