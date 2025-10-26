import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { IsFavoriteDTO } from '@/application/dto/ReceitaFavoritaDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Verificar se Receita é Favorita
* 
* Responsabilidade:
* - Verificar se uma receita está nos favoritos de um usuário
* - Retornar informações adicionais se favorita
*/
export class CheckIsFavoriteUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Verifica se receita é favorita
     * 
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<boolean> - true se favorita
     */
    async execute(usuarioId: string, receitaId: number): Promise<boolean> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, receitaId);

            return await this.favoritaRepository.isFavorite(usuarioId, receitaId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CheckIsFavoriteUseCase:', error);
            return false;
        }
    }

    /**
     * Verifica se receita é favorita e retorna detalhes
     * 
     * @param usuarioId - ID do usuário
     * @param receitaId - ID da receita
     * @returns Promise<IsFavoriteDTO> - Detalhes do favorito
     */
    async executeWithDetails(usuarioId: string, receitaId: number): Promise<IsFavoriteDTO> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, receitaId);

            const favorita = await this.favoritaRepository.findByUserAndRecipe(usuarioId, receitaId);

            return {
                usuarioId,
                receitaId,
                isFavorita: !!favorita,
                dataAdicao: favorita?.dataAdicao
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CheckIsFavoriteUseCase (with details):', error);
            return {
                usuarioId,
                receitaId,
                isFavorita: false
            };
        }
    }

    /**
     * Verifica múltiplas receitas de uma vez
     * 
     * @param usuarioId - ID do usuário
     * @param receitaIds - Array de IDs de receitas
     * @returns Promise<Map<number, boolean>> - Map de receitaId → isFavorita
     */
    async executeBatch(usuarioId: string, receitaIds: number[]): Promise<Map<number, boolean>> {
        try {
            // Validar usuário
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            if (!receitaIds || receitaIds.length === 0) {
                return new Map();
            }

            // Buscar todos os favoritos do usuário
            const favoritos = await this.favoritaRepository.findByUserId(usuarioId);
            const favoritosSet = new Set(favoritos.map(f => f.receitaId));

            // Criar map de resultado
            const result = new Map<number, boolean>();
            receitaIds.forEach(id => {
                result.set(id, favoritosSet.has(id));
            });

            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no CheckIsFavoriteUseCase (batch):', error);
            return new Map();
        }
    }

    /**
     * Busca o favorito completo
     */
    async getFavoriteEntity(usuarioId: string, receitaId: number): Promise<ReceitaFavorita | null> {
        try {
            this.validateInput(usuarioId, receitaId);

            return await this.favoritaRepository.findByUserAndRecipe(usuarioId, receitaId);
        } catch (error) {
            return null;
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