import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado do toggle
*/
export interface ToggleFavoriteResult {
    isFavorita: boolean;
    message: string;
    favorita?: ReceitaFavorita;
}

/**
* Use Case: Toggle Favorito
* 
* Responsabilidade:
* - Adicionar receita aos favoritos se não estiver
* - Remover receita dos favoritos se já estiver
* - Operação idempotente
*/
export class ToggleFavoriteUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly recipeRepository: IRecipeRepository,
        private readonly userRepository: IUserRepository
    ) { }

    /**
     * Executa toggle de favorito
     * 
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<ToggleFavoriteResult> - Resultado da operação
     * @throws AppError - Se validações falharem
     */
    async execute(usuarioId: string, receitaId: number): Promise<ToggleFavoriteResult> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, receitaId);

            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(usuarioId);
            if (!userExists) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Verificar se receita existe
            const recipeExists = await this.recipeRepository.existsById(receitaId);
            if (!recipeExists) {
                throw AppError.notFound('Receita não encontrada');
            }

            // Verificar se já é favorita
            const isFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);

            if (isFavorite) {
                // Remover dos favoritos
                await this.favoritaRepository.deleteByUserAndRecipe(usuarioId, receitaId);

                return {
                    isFavorita: false,
                    message: 'Receita removida dos favoritos'
                };
            } else {
                // Adicionar aos favoritos
                const favorita = await this.favoritaRepository.create({
                    usuarioId,
                    receitaId
                });

                return {
                    isFavorita: true,
                    message: 'Receita adicionada aos favoritos',
                    favorita
                };
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ToggleFavoriteUseCase:', error);
            throw AppError.internal('Erro ao alternar favorito');
        }
    }

    /**
     * Toggle usando repositório nativo (se disponível)
     */
    async executeNative(usuarioId: string, receitaId: number): Promise<ToggleFavoriteResult> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, receitaId);

            // Usar método toggle do repositório
            const isAdded = await this.favoritaRepository.toggle(usuarioId, receitaId);

            return {
                isFavorita: isAdded,
                message: isAdded
                    ? 'Receita adicionada aos favoritos'
                    : 'Receita removida dos favoritos'
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ToggleFavoriteUseCase (native):', error);
            throw AppError.internal('Erro ao alternar favorito');
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

    /**
     * Verifica estado atual antes de toggle
     */
    async getTogglePreview(usuarioId: string, receitaId: number): Promise<{
        currentlyFavorite: boolean;
        willBeFavorite: boolean;
        action: 'add' | 'remove';
    }> {
        try {
            const isFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);

            return {
                currentlyFavorite: isFavorite,
                willBeFavorite: !isFavorite,
                action: isFavorite ? 'remove' : 'add'
            };
        } catch (error) {
            return {
                currentlyFavorite: false,
                willBeFavorite: true,
                action: 'add'
            };
        }
    }
}