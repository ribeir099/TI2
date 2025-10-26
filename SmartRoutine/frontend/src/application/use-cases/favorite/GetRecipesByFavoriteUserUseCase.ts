import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Usuários que Favoritaram uma Receita
* 
* Responsabilidade:
* - Listar usuários que favoritaram uma receita específica
* - Análise de popularidade da receita
*/
export class GetRecipesByFavoriteUserUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Lista usuários que favoritaram uma receita
     * 
     * @param receitaId - ID da receita
     * @returns Promise<ReceitaFavorita[]> - Lista de favoritos
     */
    async execute(receitaId: number): Promise<ReceitaFavorita[]> {
        try {
            // Validar entrada
            if (!receitaId || receitaId <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            return await this.favoritaRepository.findByRecipeId(receitaId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetRecipesByFavoriteUserUseCase:', error);
            throw AppError.internal('Erro ao buscar usuários que favoritaram');
        }
    }

    /**
     * Lista IDs dos usuários que favoritaram
     * 
     * @param receitaId - ID da receita
     * @returns Promise<string[]> - IDs dos usuários
     */
    async executeUserIds(receitaId: number): Promise<string[]> {
        try {
            const favoritas = await this.execute(receitaId);
            return favoritas.map(f => f.usuarioId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            return [];
        }
    }

    /**
     * Obtém dados de popularidade da receita
     */
    async getPopularityData(receitaId: number): Promise<{
        totalFavoritos: number;
        usuariosQueFavoritaram: string[];
        primeiroFavorito?: Date;
        ultimoFavorito?: Date;
        mediaFavoritosPorDia: number;
    }> {
        try {
            const favoritas = await this.execute(receitaId);

            if (favoritas.length === 0) {
                return {
                    totalFavoritos: 0,
                    usuariosQueFavoritaram: [],
                    mediaFavoritosPorDia: 0
                };
            }

            // Ordenar por data
            const ordenados = favoritas.sort((a, b) =>
                new Date(a.dataAdicao).getTime() - new Date(b.dataAdicao).getTime()
            );

            const primeiroFavorito = new Date(ordenados[0].dataAdicao);
            const ultimoFavorito = new Date(ordenados[ordenados.length - 1].dataAdicao);

            // Calcular média de favoritos por dia
            const diasTotal = Math.ceil(
                (ultimoFavorito.getTime() - primeiroFavorito.getTime()) / (1000 * 60 * 60 * 24)
            );
            const mediaFavoritosPorDia = diasTotal > 0
                ? favoritas.length / diasTotal
                : favoritas.length;

            return {
                totalFavoritos: favoritas.length,
                usuariosQueFavoritaram: favoritas.map(f => f.usuarioId),
                primeiroFavorito,
                ultimoFavorito,
                mediaFavoritosPorDia: Number(mediaFavoritosPorDia.toFixed(2))
            };
        } catch (error) {
            throw AppError.internal('Erro ao obter dados de popularidade');
        }
    }

    /**
     * Verifica se receita é tendência (muitos favoritos recentes)
     */
    async isTrending(receitaId: number, daysThreshold: number = 7): Promise<boolean> {
        try {
            const favoritas = await this.execute(receitaId);

            if (favoritas.length < 5) return false; // Mínimo de 5 favoritos

            // Contar favoritos recentes
            const dataLimite = new Date();
            dataLimite.setDate(dataLimite.getDate() - daysThreshold);

            const favoritosRecentes = favoritas.filter(f =>
                new Date(f.dataAdicao) >= dataLimite
            ).length;

            // É tendência se mais de 50% dos favoritos são recentes
            const percentualRecentes = (favoritosRecentes / favoritas.length) * 100;
            return percentualRecentes >= 50;
        } catch (error) {
            return false;
        }
    }
}