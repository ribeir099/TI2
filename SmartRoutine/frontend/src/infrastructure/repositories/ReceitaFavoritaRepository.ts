import {
    IReceitaFavoritaRepository,
    CreateReceitaFavoritaData,
    FavoriteStatistics,
    RecipeWithFavoriteCount
} from '@/domain/repositories/IReceitaFavoritaRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Implementação do Repositório de Receitas Favoritas
* 
* Responsabilidades:
* - Comunicação com API de favoritos
* - Conversão de DTOs para Entities
* - Gerenciamento de relacionamento Many-to-Many
*/
export class ReceitaFavoritaRepository implements IReceitaFavoritaRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todos os favoritos
     */
    async findAll(): Promise<ReceitaFavorita[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.FAVORITA.BASE);
            return data.map(dto => ReceitaFavorita.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar favoritos');
        }
    }

    /**
     * Busca favorito por ID
     */
    async findById(id: number): Promise<ReceitaFavorita | null> {
        try {
            const data = await this.apiClient.get(ENDPOINTS.FAVORITA.BY_ID(id));
            return ReceitaFavorita.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar favorito');
        }
    }

    /**
     * Lista favoritos por usuário
     */
    async findByUserId(usuarioId: string): Promise<ReceitaFavorita[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.FAVORITA.BY_USER(usuarioId)
            );
            return data.map(dto => ReceitaFavorita.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar favoritos do usuário');
        }
    }

    /**
     * Lista favoritos por receita
     */
    async findByRecipeId(receitaId: number): Promise<ReceitaFavorita[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.FAVORITA.BY_RECIPE(receitaId)
            );
            return data.map(dto => ReceitaFavorita.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar favoritos da receita');
        }
    }

    /**
     * Busca favorito específico
     */
    async findByUserAndRecipe(
        usuarioId: string,
        receitaId: number
    ): Promise<ReceitaFavorita | null> {
        try {
            const favoritos = await this.findByUserId(usuarioId);
            const favorito = favoritos.find(f => f.receitaId === receitaId);
            return favorito || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se é favorita
     */
    async isFavorite(usuarioId: string, receitaId: number): Promise<boolean> {
        try {
            const data = await this.apiClient.get<{ isFavorita: boolean }>(
                ENDPOINTS.FAVORITA.CHECK(usuarioId, receitaId)
            );
            return data.isFavorita;
        } catch (error) {
            // Fallback
            try {
                const favorito = await this.findByUserAndRecipe(usuarioId, receitaId);
                return favorito !== null;
            } catch (fallbackError) {
                return false;
            }
        }
    }

    /**
     * Conta favoritos por receita
     */
    async countByRecipeId(receitaId: number): Promise<number> {
        try {
            const data = await this.apiClient.get<{ count: number }>(
                ENDPOINTS.FAVORITA.COUNT_BY_RECIPE(receitaId)
            );
            return data.count;
        } catch (error) {
            // Fallback
            try {
                const favoritos = await this.findByRecipeId(receitaId);
                return favoritos.length;
            } catch (fallbackError) {
                return 0;
            }
        }
    }

    /**
     * Conta favoritos por usuário
     */
    async countByUserId(usuarioId: string): Promise<number> {
        try {
            const data = await this.apiClient.get<{ count: number }>(
                ENDPOINTS.FAVORITA.COUNT_BY_USER(usuarioId)
            );
            return data.count;
        } catch (error) {
            // Fallback
            try {
                const favoritos = await this.findByUserId(usuarioId);
                return favoritos.length;
            } catch (fallbackError) {
                return 0;
            }
        }
    }

    /**
     * Lista favoritos recentes
     */
    async findRecentByUserId(usuarioId: string, limit: number = 10): Promise<ReceitaFavorita[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.FAVORITA.RECENT(usuarioId, limit)
            );
            return data.map(dto => ReceitaFavorita.fromDTO(dto));
        } catch (error) {
            // Fallback
            try {
                const favoritos = await this.findByUserId(usuarioId);

                // Ordenar por data de adição decrescente
                favoritos.sort((a, b) =>
                    new Date(b.dataAdicao).getTime() - new Date(a.dataAdicao).getTime()
                );

                return favoritos.slice(0, limit);
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Lista receitas mais favoritadas
     */
    async findMostFavorited(limit: number = 10): Promise<RecipeWithFavoriteCount[]> {
        try {
            const data = await this.apiClient.get<RecipeWithFavoriteCount[]>(
                ENDPOINTS.FAVORITA.MOST_FAVORITED(limit)
            );
            return data;
        } catch (error) {
            // Fallback
            try {
                const allFavoritos = await this.findAll();
                const countMap = new Map<number, { titulo: string; count: number }>();

                allFavoritos.forEach(fav => {
                    const existing = countMap.get(fav.receitaId);
                    if (existing) {
                        existing.count++;
                    } else {
                        countMap.set(fav.receitaId, {
                            titulo: fav.tituloReceita,
                            count: 1
                        });
                    }
                });

                return Array.from(countMap.entries())
                    .map(([receitaId, data]) => ({
                        receitaId,
                        tituloReceita: data.titulo,
                        totalFavoritos: data.count
                    }))
                    .sort((a, b) => b.totalFavoritos - a.totalFavoritos)
                    .slice(0, limit);
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Busca favoritos por período
     */
    async findByDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<ReceitaFavorita[]> {
        try {
            const favoritos = await this.findByUserId(usuarioId);

            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);

            return favoritos.filter(fav => {
                const dataAdicao = new Date(fav.dataAdicao);
                return dataAdicao >= inicio && dataAdicao <= fim;
            });
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por período');
        }
    }

    /**
     * Cria favorito
     */
    async create(favoritaData: CreateReceitaFavoritaData): Promise<ReceitaFavorita> {
        try {
            const payload = {
                usuarioId: favoritaData.usuarioId,
                receitaId: favoritaData.receitaId
            };

            const data = await this.apiClient.post(ENDPOINTS.FAVORITA.CREATE, payload);

            // Se retorna apenas mensagem, buscar o criado
            if (data.message && !data.id) {
                const favorito = await this.findByUserAndRecipe(
                    favoritaData.usuarioId,
                    favoritaData.receitaId
                );
                if (!favorito) {
                    throw new Error('Favorito criado mas não encontrado');
                }
                return favorito;
            }

            return ReceitaFavorita.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 409) {
                throw AppError.conflict('Receita já está nos favoritos');
            }
            throw this.handleError(error, 'Erro ao adicionar favorito');
        }
    }

    /**
     * Deleta favorito por ID
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.FAVORITA.DELETE(id));
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Favorito não encontrado');
            }
            throw this.handleError(error, 'Erro ao remover favorito');
        }
    }

    /**
     * Deleta por usuário e receita
     */
    async deleteByUserAndRecipe(usuarioId: string, receitaId: number): Promise<void> {
        try {
            await this.apiClient.delete(
                ENDPOINTS.FAVORITA.DELETE_BY_USER_RECIPE(usuarioId, receitaId)
            );
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Receita não está nos favoritos');
            }
            throw this.handleError(error, 'Erro ao remover favorito');
        }
    }

    /**
     * Deleta todos os favoritos de um usuário
     */
    async deleteAllByUserId(usuarioId: string): Promise<number> {
        try {
            const favoritos = await this.findByUserId(usuarioId);

            let deleted = 0;
            for (const favorito of favoritos) {
                try {
                    await this.delete(favorito.id);
                    deleted++;
                } catch (error) {
                    console.error(`Erro ao deletar favorito ${favorito.id}:`, error);
                }
            }

            return deleted;
        } catch (error) {
            throw this.handleError(error, 'Erro ao deletar favoritos do usuário');
        }
    }

    /**
     * Deleta todos os favoritos de uma receita
     */
    async deleteAllByRecipeId(receitaId: number): Promise<number> {
        try {
            const favoritos = await this.findByRecipeId(receitaId);

            let deleted = 0;
            for (const favorito of favoritos) {
                try {
                    await this.delete(favorito.id);
                    deleted++;
                } catch (error) {
                    console.error(`Erro ao deletar favorito ${favorito.id}:`, error);
                }
            }

            return deleted;
        } catch (error) {
            throw this.handleError(error, 'Erro ao deletar favoritos da receita');
        }
    }

    /**
     * Toggle favorito
     */
    async toggle(usuarioId: string, receitaId: number): Promise<boolean> {
        try {
            // Se API tiver endpoint de toggle
            const data = await this.apiClient.post<{ isFavorita: boolean }>(
                ENDPOINTS.FAVORITA.TOGGLE(usuarioId, receitaId)
            );
            return data.isFavorita;
        } catch (error) {
            // Fallback: verificar e adicionar/remover
            try {
                const isFavorite = await this.isFavorite(usuarioId, receitaId);

                if (isFavorite) {
                    await this.deleteByUserAndRecipe(usuarioId, receitaId);
                    return false;
                } else {
                    await this.create({ usuarioId, receitaId });
                    return true;
                }
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao alternar favorito');
            }
        }
    }

    /**
     * Obtém estatísticas
     */
    async getStatistics(usuarioId: string): Promise<FavoriteStatistics> {
        try {
            const data = await this.apiClient.get<FavoriteStatistics>(
                ENDPOINTS.FAVORITA.STATISTICS(usuarioId)
            );
            return data;
        } catch (error) {
            // Fallback: calcular manualmente
            try {
                const favoritos = await this.findByUserId(usuarioId);
                const total = favoritos.length;
                const recentes = favoritos.filter(f => f.isFavoritoRecente).length;

                // Receita mais favoritada
                const receitasMap = new Map<number, { titulo: string; count: number }>();
                favoritos.forEach(fav => {
                    const existing = receitasMap.get(fav.receitaId);
                    if (existing) {
                        existing.count++;
                    } else {
                        receitasMap.set(fav.receitaId, {
                            titulo: fav.tituloReceita,
                            count: 1
                        });
                    }
                });

                let receitaMaisFavoritada: FavoriteStatistics['receitaMaisFavoritada'];
                if (receitasMap.size > 0) {
                    const [receitaId, data] = Array.from(receitasMap.entries())
                        .sort((a, b) => b[1].count - a[1].count)[0];

                    receitaMaisFavoritada = {
                        receitaId,
                        titulo: data.titulo,
                        totalFavoritos: data.count
                    };
                }

                return {
                    totalFavoritos: total,
                    favoritosRecentes: recentes,
                    receitaMaisFavoritada,
                    categoriasMaisFavoritadas: []
                };
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao obter estatísticas');
            }
        }
    }

    /**
     * Verifica se favorito existe
     */
    async existsById(id: number): Promise<boolean> {
        try {
            const favorito = await this.findById(id);
            return favorito !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Busca receitas similares
     */
    async findSimilarRecipes(usuarioId: string, limit: number = 10): Promise<number[]> {
        try {
            const data = await this.apiClient.get<number[]>(
                ENDPOINTS.FAVORITA.SIMILAR(usuarioId, limit)
            );
            return data;
        } catch (error) {
            // Fallback: retornar receitas populares
            try {
                const mostFavorited = await this.findMostFavorited(limit);
                return mostFavorited.map(r => r.receitaId);
            } catch (fallbackError) {
                return [];
            }
        }
    }

    /**
     * Lista IDs das receitas favoritas
     */
    async findRecipeIdsByUserId(usuarioId: string): Promise<number[]> {
        try {
            const favoritos = await this.findByUserId(usuarioId);
            return favoritos.map(f => f.receitaId);
        } catch (error) {
            return [];
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Trata erros
     */
    private handleError(error: any, defaultMessage: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        console.error(defaultMessage, error);
        return AppError.internal(defaultMessage);
    }
}