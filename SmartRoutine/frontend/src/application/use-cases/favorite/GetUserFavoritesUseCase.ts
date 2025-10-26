import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de ordenação para favoritos
*/
export interface FavoriteSortOptions {
    campo: 'dataAdicao' | 'tituloReceita';
    ordem: 'asc' | 'desc';
}

/**
* Use Case: Obter Favoritos do Usuário
* 
* Responsabilidade:
* - Listar todas as receitas favoritas de um usuário
* - Ordenar e filtrar favoritos
* - Paginar resultados
*/
export class GetUserFavoritesUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly userRepository: IUserRepository
    ) { }

    /**
     * Lista todos os favoritos de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<ReceitaFavorita[]> - Lista de favoritos
     * @throws AppError - Se usuário não existir
     */
    async execute(usuarioId: string): Promise<ReceitaFavorita[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(usuarioId);
            if (!userExists) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Buscar favoritos
            const favoritas = await this.favoritaRepository.findByUserId(usuarioId);

            return favoritas;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetUserFavoritesUseCase:', error);
            throw AppError.internal('Erro ao buscar favoritos do usuário');
        }
    }

    /**
     * Lista favoritos recentes de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @param limit - Limite de resultados
     * @returns Promise<ReceitaFavorita[]> - Favoritos recentes
     */
    async executeRecent(usuarioId: string, limit: number = 10): Promise<ReceitaFavorita[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            if (limit <= 0) {
                throw AppError.badRequest('Limite deve ser maior que zero');
            }

            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(usuarioId);
            if (!userExists) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Buscar favoritos recentes
            const favoritas = await this.favoritaRepository.findRecentByUserId(usuarioId, limit);

            return favoritas;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetUserFavoritesUseCase (recent):', error);
            throw AppError.internal('Erro ao buscar favoritos recentes');
        }
    }

    /**
     * Lista IDs das receitas favoritas (útil para verificações)
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<number[]> - IDs das receitas favoritas
     */
    async executeFavoriteIds(usuarioId: string): Promise<number[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.favoritaRepository.findRecipeIdsByUserId(usuarioId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetUserFavoritesUseCase (IDs):', error);
            throw AppError.internal('Erro ao buscar IDs de favoritos');
        }
    }

    /**
     * Lista favoritos com ordenação
     */
    async executeWithSort(
        usuarioId: string,
        sortOptions: FavoriteSortOptions
    ): Promise<ReceitaFavorita[]> {
        try {
            const favoritas = await this.execute(usuarioId);

            return this.sortFavorites(favoritas, sortOptions);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.internal('Erro ao buscar favoritos ordenados');
        }
    }

    /**
     * Filtra favoritos por período
     */
    async executeByDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<ReceitaFavorita[]> {
        try {
            // Validar datas
            this.validateDateRange(dataInicio, dataFim);

            return await this.favoritaRepository.findByDateRange(usuarioId, dataInicio, dataFim);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.internal('Erro ao buscar favoritos por período');
        }
    }

    /**
     * Conta favoritos do usuário
     */
    async count(usuarioId: string): Promise<number> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.favoritaRepository.countByUserId(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao contar favoritos');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Ordena favoritos
     */
    private sortFavorites(
        favoritas: ReceitaFavorita[],
        options: FavoriteSortOptions
    ): ReceitaFavorita[] {
        return [...favoritas].sort((a, b) => {
            let comparison = 0;

            switch (options.campo) {
                case 'dataAdicao':
                    comparison = new Date(a.dataAdicao).getTime() - new Date(b.dataAdicao).getTime();
                    break;
                case 'tituloReceita':
                    comparison = a.tituloReceita.localeCompare(b.tituloReceita);
                    break;
            }

            return options.ordem === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Valida intervalo de datas
     */
    private validateDateRange(dataInicio: string, dataFim: string): void {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        if (isNaN(inicio.getTime())) {
            throw AppError.badRequest('Data de início inválida');
        }

        if (isNaN(fim.getTime())) {
            throw AppError.badRequest('Data de fim inválida');
        }

        if (inicio > fim) {
            throw AppError.badRequest('Data de início não pode ser posterior à data de fim');
        }
    }
}