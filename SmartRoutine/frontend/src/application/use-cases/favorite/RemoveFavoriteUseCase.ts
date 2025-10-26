import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Remover Receita dos Favoritos
* 
* Responsabilidade:
* - Remover uma receita dos favoritos
* - Validar existência do favorito
*/
export class RemoveFavoriteUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Remove favorito por ID
     * 
     * @param id - ID do favorito
     * @returns Promise<void>
     * @throws AppError - Se favorito não existir
     */
    async executeById(id: number): Promise<void> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID do favorito é inválido');
            }

            // Verificar se favorito existe
            const exists = await this.favoritaRepository.existsById(id);
            if (!exists) {
                throw AppError.notFound('Favorito não encontrado');
            }

            // Remover favorito
            await this.favoritaRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no RemoveFavoriteUseCase (by ID):', error);
            throw AppError.internal('Erro ao remover favorito');
        }
    }

    /**
     * Remove favorito por usuário e receita
     * 
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<void>
     * @throws AppError - Se favorito não existir
     */
    async executeByUserAndRecipe(usuarioId: string, receitaId: number): Promise<void> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, receitaId);

            // Verificar se é favorita
            const isFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);

            if (!isFavorite) {
                throw AppError.notFound('Receita não está nos favoritos');
            }

            // Remover favorito
            await this.favoritaRepository.deleteByUserAndRecipe(usuarioId, receitaId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no RemoveFavoriteUseCase (by user and recipe):', error);
            throw AppError.internal('Erro ao remover favorito');
        }
    }

    /**
     * Remove todos os favoritos de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<number> - Quantidade removida
     */
    async executeAllByUser(usuarioId: string): Promise<number> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.favoritaRepository.deleteAllByUserId(usuarioId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no RemoveFavoriteUseCase (all by user):', error);
            throw AppError.internal('Erro ao remover todos os favoritos');
        }
    }

    /**
     * Remove todos os favoritos de uma receita
     * 
     * @param receitaId - ID da receita
     * @returns Promise<number> - Quantidade removida
     */
    async executeAllByRecipe(receitaId: number): Promise<number> {
        try {
            if (!receitaId || receitaId <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            return await this.favoritaRepository.deleteAllByRecipeId(receitaId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no RemoveFavoriteUseCase (all by recipe):', error);
            throw AppError.internal('Erro ao remover favoritos da receita');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(usuarioId: string, receitaId: number): void {
        if (!usuarioId || usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!receitaId || receitaId <= 0) {
            throw AppError.badRequest('ID da receita é inválido');
        }
    }
}