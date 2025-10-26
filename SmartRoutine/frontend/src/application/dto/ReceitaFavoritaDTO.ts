import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';

/**
* DTO para entrada de criação de favorito
*/
export interface CreateReceitaFavoritaInputDTO {
    usuarioId: string;
    receitaId: number;
}

/**
* DTO para saída de favorito
*/
export interface ReceitaFavoritaOutputDTO {
    id: number;
    usuarioId: string;
    receitaId: number;
    nomeUsuario: string;
    tituloReceita: string;
    dataAdicao: string;
    // Campos calculados
    diasDesFavorito: number;
    dataAdicaoFormatada: string;
    dataHoraAdicaoFormatada: string;
    isFavoritoRecente: boolean;
    isFavoritoAntigo: boolean;
    tempoDesdeAdicao: string;
}

/**
* DTO resumido de favorito
*/
export interface ReceitaFavoritaSummaryDTO {
    id: number;
    receitaId: number;
    tituloReceita: string;
    dataAdicaoFormatada: string;
    isFavoritoRecente: boolean;
}

/**
* DTO para receita com contagem de favoritos
*/
export interface RecipeWithFavoriteCountDTO {
    receitaId: number;
    tituloReceita: string;
    totalFavoritos: number;
    percentualUsuarios?: number;
}

/**
* DTO para estatísticas de favoritos
*/
export interface FavoriteStatisticsDTO {
    totalFavoritos: number;
    favoritosRecentes: number; // últimos 7 dias
    receitaMaisFavoritada?: {
        receitaId: number;
        titulo: string;
        totalFavoritos: number;
    };
    distribuicaoPorData: Array<{
        data: string;
        quantidade: number;
    }>;
    tagsPopulares: Array<{
        tag: string;
        quantidade: number;
    }>;
}

/**
* DTO para verificação de favorito
*/
export interface IsFavoriteDTO {
    usuarioId: string;
    receitaId: number;
    isFavorita: boolean;
    dataAdicao?: string;
}

/**
* DTO para ranking de receitas favoritas
*/
export interface FavoriteRankingDTO {
    posicao: number;
    receitaId: number;
    tituloReceita: string;
    totalFavoritos: number;
    percentual: number;
    tendencia: 'subindo' | 'descendo' | 'estavel';
}

/**
* DTO para recomendações baseadas em favoritos
*/
export interface FavoriteRecommendationsDTO {
    receitasRecomendadas: Array<{
        receitaId: number;
        titulo: string;
        score: number; // 0-100
        razao: string;
    }>;
    baseadoEm: string[];
}

/**
* Mapper/Transformer para ReceitaFavorita
*/
export class ReceitaFavoritaDTOMapper {
    /**
     * Converte ReceitaFavorita Entity para ReceitaFavoritaOutputDTO
     */
    static toOutputDTO(favorita: ReceitaFavorita): ReceitaFavoritaOutputDTO {
        return {
            id: favorita.id,
            usuarioId: favorita.usuarioId,
            receitaId: favorita.receitaId,
            nomeUsuario: favorita.nomeUsuario,
            tituloReceita: favorita.tituloReceita,
            dataAdicao: favorita.dataAdicao,
            // Campos calculados
            diasDesFavorito: favorita.diasDesFavorito,
            dataAdicaoFormatada: favorita.dataAdicaoFormatada,
            dataHoraAdicaoFormatada: favorita.dataHoraAdicaoFormatada,
            isFavoritoRecente: favorita.isFavoritoRecente,
            isFavoritoAntigo: favorita.isFavoritoAntigo,
            tempoDesdeAdicao: favorita.tempoDesdeAdicao
        };
    }

    /**
     * Converte ReceitaFavorita Entity para ReceitaFavoritaSummaryDTO
     */
    static toSummaryDTO(favorita: ReceitaFavorita): ReceitaFavoritaSummaryDTO {
        return {
            id: favorita.id,
            receitaId: favorita.receitaId,
            tituloReceita: favorita.tituloReceita,
            dataAdicaoFormatada: favorita.dataAdicaoFormatada,
            isFavoritoRecente: favorita.isFavoritoRecente
        };
    }

    /**
     * Converte array de ReceitaFavoritas para array de ReceitaFavoritaOutputDTO
     */
    static toOutputDTOList(favoritas: ReceitaFavorita[]): ReceitaFavoritaOutputDTO[] {
        return favoritas.map(favorita => ReceitaFavoritaDTOMapper.toOutputDTO(favorita));
    }

    /**
     * Converte array de ReceitaFavoritas para array de ReceitaFavoritaSummaryDTO
     */
    static toSummaryDTOList(favoritas: ReceitaFavorita[]): ReceitaFavoritaSummaryDTO[] {
        return favoritas.map(favorita => ReceitaFavoritaDTOMapper.toSummaryDTO(favorita));
    }

    /**
     * Cria DTO de verificação de favorito
     */
    static toIsFavoriteDTO(
        usuarioId: string,
        receitaId: number,
        favorita?: ReceitaFavorita
    ): IsFavoriteDTO {
        return {
            usuarioId,
            receitaId,
            isFavorita: !!favorita,
            dataAdicao: favorita?.dataAdicao
        };
    }

    /**
     * Cria ranking de receitas favoritas
     */
    static toFavoriteRanking(
        receitasComContagem: RecipeWithFavoriteCountDTO[],
        totalUsuarios: number
    ): FavoriteRankingDTO[] {
        const totalFavoritos = receitasComContagem.reduce(
            (sum, r) => sum + r.totalFavoritos,
            0
        );

        return receitasComContagem.map((receita, index) => ({
            posicao: index + 1,
            receitaId: receita.receitaId,
            tituloReceita: receita.tituloReceita,
            totalFavoritos: receita.totalFavoritos,
            percentual: Math.round((receita.totalFavoritos / totalFavoritos) * 100),
            tendencia: 'estavel' as const // Seria calculado com dados históricos
        }));
    }

    /**
     * Calcula estatísticas de favoritos
     */
    static calculateStatistics(
        favoritas: ReceitaFavorita[],
        todasReceitas?: Array<{ id: number; titulo: string }>
    ): FavoriteStatisticsDTO {
        const total = favoritas.length;
        const recentes = favoritas.filter(f => f.isFavoritoRecente).length;

        // Receita mais favoritada
        const receitasMap = new Map<number, { titulo: string; count: number }>();
        favoritas.forEach(f => {
            const existing = receitasMap.get(f.receitaId);
            if (existing) {
                existing.count++;
            } else {
                receitasMap.set(f.receitaId, {
                    titulo: f.tituloReceita,
                    count: 1
                });
            }
        });

        let receitaMaisFavoritada: FavoriteStatisticsDTO['receitaMaisFavoritada'];
        if (receitasMap.size > 0) {
            const [receitaId, data] = Array.from(receitasMap.entries())
                .sort((a, b) => b[1].count - a[1].count)[0];

            receitaMaisFavoritada = {
                receitaId,
                titulo: data.titulo,
                totalFavoritos: data.count
            };
        }

        // Distribuição por data (últimos 30 dias)
        const distribuicaoMap = new Map<string, number>();
        const hoje = new Date();
        const trintaDiasAtras = new Date(hoje);
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        favoritas
            .filter(f => new Date(f.dataAdicao) >= trintaDiasAtras)
            .forEach(f => {
                const data = new Date(f.dataAdicao).toLocaleDateString('pt-BR');
                distribuicaoMap.set(data, (distribuicaoMap.get(data) || 0) + 1);
            });

        const distribuicaoPorData = Array.from(distribuicaoMap.entries())
            .map(([data, quantidade]) => ({ data, quantidade }))
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        return {
            totalFavoritos: total,
            favoritosRecentes: recentes,
            receitaMaisFavoritada,
            distribuicaoPorData,
            tagsPopulares: [] // Seria preenchido com dados de receitas
        };
    }

    /**
     * Valida CreateReceitaFavoritaInputDTO
     */
    static validateCreateInput(dto: CreateReceitaFavoritaInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.usuarioId || dto.usuarioId.trim().length === 0) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!dto.receitaId || dto.receitaId <= 0) {
            errors.push('ID da receita é obrigatório');
        }

        return errors;
    }
}
