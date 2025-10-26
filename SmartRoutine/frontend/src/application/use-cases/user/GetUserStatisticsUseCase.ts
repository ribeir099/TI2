import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

/**
* Estatísticas do usuário
*/
export interface UserStatistics {
    usuario: {
        id: string;
        nome: string;
        email: string;
        idade: number;
        membroDesde?: Date;
    };
    despensa: {
        totalItens: number;
        itensVencidos: number;
        itensVencendo: number;
        itensFrescos: number;
        categoriasFavoritas: Array<{ categoria: string; quantidade: number }>;
    };
    receitas: {
        totalFavoritas: number;
        favoritasRecentes: number;
        tagsPreferidas: Array<{ tag: string; quantidade: number }>;
    };
    atividade: {
        ultimaCompra?: Date;
        ultimoFavorito?: Date;
        diasAtivo?: number;
    };
    metricas: {
        taxaAproveitamento: number;
        economiaEstimada: number;
        receitasMaisFeitas: string[];
    };
}

/**
* Use Case: Obter Estatísticas do Usuário
* 
* Responsabilidade:
* - Agregar dados do usuário
* - Calcular métricas
* - Dashboard de atividades
*/
export class GetUserStatisticsUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly foodItemRepository?: IFoodItemRepository,
        private readonly favoritaRepository?: IReceitaFavoritaRepository
    ) { }

    /**
     * Obtém estatísticas completas
     * 
     * @param userId - ID do usuário
     * @returns Promise<UserStatistics> - Estatísticas
     */
    async execute(userId: string): Promise<UserStatistics> {
        try {
            // Validar entrada
            if (!userId || userId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar usuário
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Buscar dados da despensa
            const despensaStats = await this.getFoodStatistics(userId);

            // Buscar dados de receitas
            const receitasStats = await this.getRecipeStatistics(userId);

            // Calcular métricas
            const metricas = this.calculateMetrics(despensaStats);

            return {
                usuario: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    idade: user.idade,
                    membroDesde: user.dataCriacao ? new Date(user.dataCriacao) : undefined
                },
                despensa: despensaStats,
                receitas: receitasStats,
                atividade: {
                    // TODO: Implementar quando houver campos de atividade
                },
                metricas
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetUserStatisticsUseCase:', error);
            throw AppError.internal('Erro ao obter estatísticas');
        }
    }

    /**
     * Obtém estatísticas resumidas
     */
    async executeSummary(userId: string): Promise<{
        totalItens: number;
        totalFavoritas: number;
        itensVencendo: number;
        economiaEstimada: number;
    }> {
        try {
            const stats = await this.execute(userId);

            return {
                totalItens: stats.despensa.totalItens,
                totalFavoritas: stats.receitas.totalFavoritas,
                itensVencendo: stats.despensa.itensVencendo,
                economiaEstimada: stats.metricas.economiaEstimada
            };
        } catch (error) {
            return {
                totalItens: 0,
                totalFavoritas: 0,
                itensVencendo: 0,
                economiaEstimada: 0
            };
        }
    }

    /**
     * Compara estatísticas com período anterior
     */
    async executeWithComparison(userId: string): Promise<{
        atual: UserStatistics;
        crescimento: {
            itens: number;
            favoritas: number;
            percentual: number;
        };
    }> {
        try {
            const atual = await this.execute(userId);

            // TODO: Implementar comparação com dados históricos
            return {
                atual,
                crescimento: {
                    itens: 0,
                    favoritas: 0,
                    percentual: 0
                }
            };
        } catch (error) {
            throw AppError.internal('Erro ao comparar estatísticas');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Obtém estatísticas da despensa
     */
    private async getFoodStatistics(userId: string): Promise<UserStatistics['despensa']> {
        if (!this.foodItemRepository) {
            return {
                totalItens: 0,
                itensVencidos: 0,
                itensVencendo: 0,
                itensFrescos: 0,
                categoriasFavoritas: []
            };
        }

        try {
            const items = await this.foodItemRepository.findByUserId(userId);

            const vencidos = items.filter(i => i.isVencido()).length;
            const vencendo = items.filter(i => i.isVencendoEmBreve() && !i.isVencido()).length;
            const frescos = items.filter(i => i.isFresco()).length;

            // Categorias favoritas
            const categoriasMap = new Map<string, number>();
            items.forEach(item => {
                categoriasMap.set(item.categoria, (categoriasMap.get(item.categoria) || 0) + 1);
            });

            const categoriasFavoritas = Array.from(categoriasMap.entries())
                .map(([categoria, quantidade]) => ({ categoria, quantidade }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);

            return {
                totalItens: items.length,
                itensVencidos: vencidos,
                itensVencendo: vencendo,
                itensFrescos: frescos,
                categoriasFavoritas
            };
        } catch (error) {
            return {
                totalItens: 0,
                itensVencidos: 0,
                itensVencendo: 0,
                itensFrescos: 0,
                categoriasFavoritas: []
            };
        }
    }

    /**
     * Obtém estatísticas de receitas
     */
    private async getRecipeStatistics(userId: string): Promise<UserStatistics['receitas']> {
        if (!this.favoritaRepository) {
            return {
                totalFavoritas: 0,
                favoritasRecentes: 0,
                tagsPreferidas: []
            };
        }

        try {
            const favoritas = await this.favoritaRepository.findByUserId(userId);
            const recentes = favoritas.filter(f => f.isFavoritoRecente).length;

            // TODO: Extrair tags das receitas favoritas
            const tagsPreferidas: Array<{ tag: string; quantidade: number }> = [];

            return {
                totalFavoritas: favoritas.length,
                favoritasRecentes: recentes,
                tagsPreferidas
            };
        } catch (error) {
            return {
                totalFavoritas: 0,
                favoritasRecentes: 0,
                tagsPreferidas: []
            };
        }
    }

    /**
     * Calcula métricas
     */
    private calculateMetrics(despensaStats: UserStatistics['despensa']): UserStatistics['metricas'] {
        const total = despensaStats.totalItens;
        const vencidos = despensaStats.itensVencidos;

        // Taxa de aproveitamento (quanto não foi desperdiçado)
        const taxaAproveitamento = total > 0
            ? Math.round(((total - vencidos) / total) * 100)
            : 0;

        // Economia estimada (R$ 15 por item não desperdiçado)
        const economiaEstimada = (total - vencidos) * 15;

        return {
            taxaAproveitamento,
            economiaEstimada,
            receitasMaisFeitas: [] // TODO: Implementar histórico
        };
    }
}