import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { AppError } from '@/shared/errors/AppError';

/**
* Níveis de urgência
*/
export enum ExpirationUrgency {
    CRITICO = 'critico',      // Vence hoje ou amanhã
    ALTO = 'alto',            // Vence em 2-3 dias
    MEDIO = 'medio',          // Vence em 4-7 dias
    BAIXO = 'baixo'           // Vence em mais de 7 dias
}

/**
* Item com urgência
*/
export interface ItemWithUrgency {
    item: FoodItem;
    urgency: ExpirationUrgency;
    priority: number;
}

/**
* Use Case: Obter Itens Vencendo
* 
* Responsabilidade:
* - Listar alimentos próximos do vencimento
* - Classificar por urgência
* - Priorizar alertas
*/
export class GetExpiringItemsUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Lista itens vencendo em breve
     * 
     * @param usuarioId - ID do usuário
     * @param dias - Número de dias até vencimento (padrão: 3)
     * @returns Promise<FoodItem[]> - Itens vencendo
     */
    async execute(usuarioId: string, dias: number = 3): Promise<FoodItem[]> {
        try {
            // Validar entrada
            this.validateInput(usuarioId, dias);

            const items = await this.foodItemRepository.findExpiringItems(usuarioId, dias);

            // Ordenar por dias até vencimento (mais urgente primeiro)
            return items.sort((a, b) => a.diasAteVencimento - b.diasAteVencimento);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetExpiringItemsUseCase:', error);
            throw AppError.internal('Erro ao buscar itens vencendo');
        }
    }

    /**
     * Lista itens vencendo com nível de urgência
     * 
     * @param usuarioId - ID do usuário
     * @param dias - Dias até vencimento
     * @returns Promise<ItemWithUrgency[]> - Itens com urgência
     */
    async executeWithUrgency(usuarioId: string, dias: number = 7): Promise<ItemWithUrgency[]> {
        try {
            this.validateInput(usuarioId, dias);

            const items = await this.foodItemRepository.findExpiringItems(usuarioId, dias);

            return items.map(item => ({
                item,
                urgency: this.calculateUrgency(item.diasAteVencimento),
                priority: this.calculatePriority(item.diasAteVencimento)
            })).sort((a, b) => b.priority - a.priority);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar itens com urgência');
        }
    }

    /**
     * Lista itens por nível de urgência específico
     * 
     * @param usuarioId - ID do usuário
     * @param urgency - Nível de urgência
     * @returns Promise<FoodItem[]> - Itens do nível especificado
     */
    async executeByUrgency(
        usuarioId: string,
        urgency: ExpirationUrgency
    ): Promise<FoodItem[]> {
        try {
            this.validateInput(usuarioId, 7);

            const items = await this.foodItemRepository.findExpiringItems(usuarioId, 7);

            return items.filter(item =>
                this.calculateUrgency(item.diasAteVencimento) === urgency
            );
        } catch (error) {
            throw AppError.internal('Erro ao buscar itens por urgência');
        }
    }

    /**
     * Lista itens críticos (vencem hoje ou amanhã)
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FoodItem[]> - Itens críticos
     */
    async executeCritical(usuarioId: string): Promise<FoodItem[]> {
        try {
            this.validateInput(usuarioId, 1);

            const items = await this.foodItemRepository.findExpiringItems(usuarioId, 1);

            return items.sort((a, b) => a.diasAteVencimento - b.diasAteVencimento);
        } catch (error) {
            throw AppError.internal('Erro ao buscar itens críticos');
        }
    }

    /**
     * Agrupa itens vencendo por categoria
     */
    async executeGroupedByCategory(
        usuarioId: string,
        dias: number = 3
    ): Promise<Map<string, FoodItem[]>> {
        try {
            const items = await this.execute(usuarioId, dias);

            const grouped = new Map<string, FoodItem[]>();

            items.forEach(item => {
                const categoryItems = grouped.get(item.categoria) || [];
                categoryItems.push(item);
                grouped.set(item.categoria, categoryItems);
            });

            return grouped;
        } catch (error) {
            throw AppError.internal('Erro ao agrupar itens vencendo');
        }
    }

    /**
     * Conta itens vencendo
     */
    async count(usuarioId: string, dias: number = 3): Promise<number> {
        try {
            const items = await this.execute(usuarioId, dias);
            return items.length;
        } catch (error) {
            return 0;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Valida entrada
     */
    private validateInput(usuarioId: string, dias: number): void {
        if (!usuarioId || usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (dias < 0) {
            throw AppError.badRequest('Dias não pode ser negativo');
        }

        if (dias > 365) {
            throw AppError.badRequest('Dias muito grande (máximo 365)');
        }
    }

    /**
     * Calcula urgência baseado em dias
     */
    private calculateUrgency(diasAteVencimento: number): ExpirationUrgency {
        if (diasAteVencimento <= 1) return ExpirationUrgency.CRITICO;
        if (diasAteVencimento <= 3) return ExpirationUrgency.ALTO;
        if (diasAteVencimento <= 7) return ExpirationUrgency.MEDIO;
        return ExpirationUrgency.BAIXO;
    }

    /**
     * Calcula prioridade numérica (maior = mais urgente)
     */
    private calculatePriority(diasAteVencimento: number): number {
        if (diasAteVencimento <= 0) return 100;
        if (diasAteVencimento === 1) return 90;
        if (diasAteVencimento === 2) return 80;
        if (diasAteVencimento === 3) return 70;
        if (diasAteVencimento <= 7) return 50;
        return 30;
    }
}