import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { CreateReceitaFavoritaInputDTO } from '@/application/dto/ReceitaFavoritaDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Adicionar Receita aos Favoritos
* 
* Responsabilidade:
* - Adicionar uma receita aos favoritos de um usuário
* - Validar se usuário e receita existem
* - Verificar duplicidade
*/
export class AddFavoriteUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly recipeRepository: IRecipeRepository,
        private readonly userRepository: IUserRepository
    ) { }

    /**
     * Executa adição de favorito
     * 
     * @param input - IDs de usuário e receita
     * @returns Promise<ReceitaFavorita> - Favorito criado
     * @throws AppError - Se validações falharem
     */
    async execute(input: CreateReceitaFavoritaInputDTO): Promise<ReceitaFavorita> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(input.usuarioId);
            if (!userExists) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Verificar se receita existe
            const recipeExists = await this.recipeRepository.existsById(input.receitaId);
            if (!recipeExists) {
                throw AppError.notFound('Receita não encontrada');
            }

            // Verificar se já é favorita
            const alreadyFavorite = await this.favoritaRepository.isFavorite(
                input.usuarioId,
                input.receitaId
            );

            if (alreadyFavorite) {
                throw AppError.conflict('Receita já está nos favoritos');
            }

            // Adicionar aos favoritos
            const favorita = await this.favoritaRepository.create(input);

            return favorita;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no AddFavoriteUseCase:', error);
            throw AppError.internal('Erro ao adicionar receita aos favoritos');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: CreateReceitaFavoritaInputDTO): void {
        if (!input) {
            throw AppError.badRequest('Dados são obrigatórios');
        }

        if (!input.usuarioId || input.usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!input.receitaId || input.receitaId <= 0) {
            throw AppError.badRequest('ID da receita é obrigatório e deve ser maior que zero');
        }
    }

    /**
     * Verifica se receita pode ser favoritada
     */
    async canFavorite(usuarioId: string, receitaId: number): Promise<{
        canFavorite: boolean;
        reason?: string;
    }> {
        try {
            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(usuarioId);
            if (!userExists) {
                return { canFavorite: false, reason: 'Usuário não encontrado' };
            }

            // Verificar se receita existe
            const recipeExists = await this.recipeRepository.existsById(receitaId);
            if (!recipeExists) {
                return { canFavorite: false, reason: 'Receita não encontrada' };
            }

            // Verificar se já é favorita
            const alreadyFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);
            if (alreadyFavorite) {
                return { canFavorite: false, reason: 'Receita já está nos favoritos' };
            }

            return { canFavorite: true };
        } catch (error) {
            return { canFavorite: false, reason: 'Erro ao verificar' };
        }
    }
}