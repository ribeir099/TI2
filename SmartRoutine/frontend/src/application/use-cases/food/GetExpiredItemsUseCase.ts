import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { AppError } from '@/shared/errors/AppError';

/**
* Estatísticas de itens vencidos
*/
export interface ExpiredItemsStatistics {
    total: number;
    valorEstimadoDesperdicio: number;
    itensPorCategoria: Record<string, number>;
    itemMaisAntigo: FoodItem | null;
    diasMedioVencido: number;
}

/**
* Use Case: Obter Itens Vencidos
* 
* Responsabilidade:
* - Listar alimentos vencidos
* - Calcular estatísticas de desperdício
* - Identificar padrões de desperdício
*/
export class GetExpiredItemsUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Lista todos os itens vencidos
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FoodItem[]> - Itens vencidos
     */
    async execute(usuarioId: string): Promise<FoodItem[]> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            const items = await this.foodItemRepository.findExpiredItems(usuarioId);

            // Ordenar por dias vencido (mais velho primeiro)
            return items.sort((a, b) => a.diasAteVencimento - b.diasAteVencimento);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetExpiredItemsUseCase:', error);
            throw AppError.internal('Erro ao buscar itens vencidos');
        }
    }

    /**
     * Lista itens vencidos por categoria
     * 
     * @param usuarioId - ID do usuário
     * @param categoria - Categoria específica
     * @returns Promise<FoodItem[]> - Itens vencidos da categoria
     */
    async executeByCategory(usuarioId: string, categoria: string): Promise<FoodItem[]> {
        try {
            const items = await this.execute(usuarioId);

            return items.filter(item =>
                item.categoria.toLowerCase() === categoria.toLowerCase()
            );
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar itens vencidos por categoria');
        }
    }

    /**
     * Agrupa itens vencidos por categoria
     */
    async executeGroupedByCategory(usuarioId: string): Promise<Map<string, FoodItem[]>> {
        try {
            const items = await this.execute(usuarioId);

            const grouped = new Map<string, FoodItem[]>();

            items.forEach(item => {
                const categoryItems = grouped.get(item.categoria) || [];
                categoryItems.push(item);
                grouped.set(item.categoria, categoryItems);
            });

            return grouped;
        } catch (error) {
            throw AppError.internal('Erro ao agrupar itens vencidos');
        }
    }

    /**
     * Obtém estatísticas de itens vencidos
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<ExpiredItemsStatistics> - Estatísticas
     */
    async executeStatistics(usuarioId: string): Promise<ExpiredItemsStatistics> {
        try {
            const items = await this.execute(usuarioId);

            if (items.length === 0) {
                return {
                    total: 0,
                    valorEstimadoDesperdicio: 0,
                    itensPorCategoria: {},
                    itemMaisAntigo: null,
                    diasMedioVencido: 0
                };
            }

            // Valor estimado (R$ 15 por item em média)
            const valorEstimadoDesperdicio = items.length * 15;

            // Itens por categoria
            const itensPorCategoria: Record<string, number> = {};
            items.forEach(item => {
                itensPorCategoria[item.categoria] = (itensPorCategoria[item.categoria] || 0) + 1;
            });

            // Item mais antigo (mais tempo vencido)
            const itemMaisAntigo = items.reduce((oldest, item) =>
                item.diasAteVencimento < oldest.diasAteVencimento ? item : oldest
            );

            // Dias médio vencido
            const somaDias = items.reduce((sum, item) => sum + Math.abs(item.diasAteVencimento), 0);
            const diasMedioVencido = Math.round(somaDias / items.length);

            return {
                total: items.length,
                valorEstimadoDesperdicio,
                itensPorCategoria,
                itemMaisAntigo,
                diasMedioVencido
            };
        } catch (error) {
            throw AppError.internal('Erro ao calcular estatísticas de vencidos');
        }
    }

    /**
     * Lista itens vencidos há mais de X dias
     * 
     * @param usuarioId - ID do usuário
     * @param diasVencido - Dias desde que venceu
     * @returns Promise<FoodItem[]> - Itens vencidos há mais tempo
     */
    async executeExpiredForDays(usuarioId: string, diasVencido: number): Promise<FoodItem[]> {
        try {
            const items = await this.execute(usuarioId);

            return items.filter(item => Math.abs(item.diasAteVencimento) >= diasVencido);
        } catch (error) {
            throw AppError.internal('Erro ao buscar itens vencidos por dias');
        }
    }

    /**
     * Conta itens vencidos
     */
    async count(usuarioId: string): Promise<number> {
        try {
            const items = await this.execute(usuarioId);
            return items.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Verifica se usuário tem itens vencidos
     */
    async hasExpiredItems(usuarioId: string): Promise<boolean> {
        try {
            const count = await this.count(usuarioId);
            return count > 0;
        } catch (error) {
            return false;
        }
    }
}