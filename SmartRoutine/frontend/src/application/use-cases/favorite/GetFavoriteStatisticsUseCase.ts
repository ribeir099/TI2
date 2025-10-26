import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { FavoriteStatisticsDTO, ReceitaFavoritaDTOMapper } from '@/application/dto/ReceitaFavoritaDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Estatísticas de Favoritos
* 
* Responsabilidade:
* - Calcular estatísticas de favoritos de um usuário
* - Agregar dados para dashboard
* - Análise de padrões
*/
export class GetFavoriteStatisticsUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository
    ) { }

    /**
     * Obtém estatísticas completas de favoritos
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FavoriteStatisticsDTO> - Estatísticas
     */
    async execute(usuarioId: string): Promise<FavoriteStatisticsDTO> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.favoritaRepository.getStatistics(usuarioId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetFavoriteStatisticsUseCase:', error);
            throw AppError.internal('Erro ao obter estatísticas de favoritos');
        }
    }

    /**
     * Calcula estatísticas customizadas
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FavoriteStatisticsDTO> - Estatísticas calculadas
     */
    async executeCustom(usuarioId: string): Promise<FavoriteStatisticsDTO> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar todos os favoritos
            const favoritas = await this.favoritaRepository.findByUserId(usuarioId);

            // Calcular estatísticas
            return ReceitaFavoritaDTOMapper.calculateStatistics(favoritas);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.internal('Erro ao calcular estatísticas customizadas');
        }
    }

    /**
     * Obtém tendências de favoritos (últimos 30 dias)
     */
    async getFavoriteTrends(usuarioId: string): Promise<{
        totalUltimos30Dias: number;
        mediaFavoritosPorSemana: number;
        crescimento: number; // Percentual
    }> {
        try {
            const hoje = new Date();
            const trintaDiasAtras = new Date(hoje);
            trintaDiasAtras.setDate(hoje.getDate() - 30);
            const sessentaDiasAtras = new Date(hoje);
            sessentaDiasAtras.setDate(hoje.getDate() - 60);

            // Buscar favoritos dos últimos 30 dias
            const favoritosRecentes = await this.favoritaRepository.findByDateRange(
                usuarioId,
                trintaDiasAtras.toISOString(),
                hoje.toISOString()
            );

            // Buscar favoritos de 30-60 dias atrás
            const favoritosAnteriores = await this.favoritaRepository.findByDateRange(
                usuarioId,
                sessentaDiasAtras.toISOString(),
                trintaDiasAtras.toISOString()
            );

            const totalRecentes = favoritosRecentes.length;
            const totalAnteriores = favoritosAnteriores.length;

            // Calcular crescimento
            let crescimento = 0;
            if (totalAnteriores > 0) {
                crescimento = ((totalRecentes - totalAnteriores) / totalAnteriores) * 100;
            } else if (totalRecentes > 0) {
                crescimento = 100;
            }

            // Média por semana
            const mediaFavoritosPorSemana = Math.round((totalRecentes / 30) * 7);

            return {
                totalUltimos30Dias: totalRecentes,
                mediaFavoritosPorSemana,
                crescimento: Math.round(crescimento)
            };
        } catch (error) {
            return {
                totalUltimos30Dias: 0,
                mediaFavoritosPorSemana: 0,
                crescimento: 0
            };
        }
    }

    /**
     * Compara favoritos de dois usuários
     */
    async compareUsers(usuarioId1: string, usuarioId2: string): Promise<{
        usuario1Total: number;
        usuario2Total: number;
        emComum: number;
        percentualSimilaridade: number;
    }> {
        try {
            const [favoritos1, favoritos2] = await Promise.all([
                this.favoritaRepository.findRecipeIdsByUserId(usuarioId1),
                this.favoritaRepository.findRecipeIdsByUserId(usuarioId2)
            ]);

            const set1 = new Set(favoritos1);
            const set2 = new Set(favoritos2);

            // Calcular interseção
            const emComum = favoritos1.filter(id => set2.has(id)).length;

            // Calcular similaridade (Jaccard similarity)
            const uniao = new Set([...favoritos1, ...favoritos2]).size;
            const percentualSimilaridade = uniao > 0
                ? Math.round((emComum / uniao) * 100)
                : 0;

            return {
                usuario1Total: favoritos1.length,
                usuario2Total: favoritos2.length,
                emComum,
                percentualSimilaridade
            };
        } catch (error) {
            throw AppError.internal('Erro ao comparar favoritos');
        }
    }
}