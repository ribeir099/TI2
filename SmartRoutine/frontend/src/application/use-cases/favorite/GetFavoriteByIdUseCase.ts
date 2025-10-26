import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Favorito por ID
* 
* Responsabilidade:
* - Buscar um favorito específico por ID
* - Validar existência
*/
export class GetFavoriteByIdUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Busca favorito por ID
     * 
     * @param id - ID do favorito
     * @returns Promise<ReceitaFavorita> - Favorito encontrado
     * @throws AppError - Se favorito não existir
     */
    async execute(id: number): Promise<ReceitaFavorita> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID do favorito é inválido');
            }

            const favorita = await this.favoritaRepository.findById(id);

            if (!favorita) {
                throw AppError.notFound('Favorito não encontrado');
            }

            return favorita;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetFavoriteByIdUseCase:', error);
            throw AppError.internal('Erro ao buscar favorito');
        }
    }

    /**
     * Busca favorito por ID sem lançar erro
     * 
     * @param id - ID do favorito
     * @returns Promise<ReceitaFavorita | null> - Favorito ou null
     */
    async executeOrNull(id: number): Promise<ReceitaFavorita | null> {
        try {
            return await this.execute(id);
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se favorito existe
     */
    async exists(id: number): Promise<boolean> {
        try {
            if (!id || id <= 0) return false;

            return await this.favoritaRepository.existsById(id);
        } catch (error) {
            return false;
        }
    }
}