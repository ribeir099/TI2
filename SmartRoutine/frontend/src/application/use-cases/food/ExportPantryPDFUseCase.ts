import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { User } from '@/domain/entities/User';
import { ExpirationStatusVO } from '@/domain/value-objects/ExpirationStatus';
import { AppError } from '@/shared/errors/AppError';

/**
* Dados para geração do PDF
*/
export interface PantryPDFData {
    usuario: User;
    items: FoodItem[];
    dataGeracao: Date;
    estatisticas: {
        total: number;
        vencidos: number;
        vencendo: number;
        frescos: number;
    };
}

/**
* Use Case: Exportar Despensa em PDF
* 
* Responsabilidade:
* - Preparar dados para exportação
* - Gerar estrutura do PDF
* - Incluir estatísticas e informações relevantes
* 
* Nota: A geração real do PDF é feita na camada de infraestrutura
*/
export class ExportPantryPDFUseCase {
    constructor(
        private readonly foodItemRepository: IFoodItemRepository,
        private readonly userRepository: IUserRepository
    ) { }

    /**
     * Prepara dados para exportação em PDF
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<PantryPDFData> - Dados estruturados para PDF
     * @throws AppError - Se usuário não existir
     */
    async execute(usuarioId: string): Promise<PantryPDFData> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar usuário
            const user = await this.userRepository.findById(usuarioId);
            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Buscar alimentos
            const items = await this.foodItemRepository.findByUserId(usuarioId);

            if (items.length === 0) {
                throw AppError.badRequest('Despensa vazia. Não há itens para exportar.');
            }

            // Calcular estatísticas
            const vencidos = items.filter(item => item.isVencido()).length;
            const vencendo = items.filter(item => item.isVencendoEmBreve() && !item.isVencido()).length;
            const frescos = items.filter(item => item.isFresco()).length;

            // Ordenar itens (vencidos primeiro, depois vencendo, depois frescos)
            const sortedItems = items.sort((a, b) => {
                const statusA = ExpirationStatusVO.fromDays(a.diasAteVencimento);
                const statusB = ExpirationStatusVO.fromDays(b.diasAteVencimento);

                const priorityA = statusA.priority;
                const priorityB = statusB.priority;

                if (priorityA !== priorityB) {
                    return priorityB - priorityA; // Maior prioridade primeiro
                }

                // Mesma prioridade, ordenar por dias até vencimento
                return a.diasAteVencimento - b.diasAteVencimento;
            });

            return {
                usuario: user,
                items: sortedItems,
                dataGeracao: new Date(),
                estatisticas: {
                    total: items.length,
                    vencidos,
                    vencendo,
                    frescos
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ExportPantryPDFUseCase:', error);
            throw AppError.internal('Erro ao preparar dados para exportação');
        }
    }

    /**
     * Prepara dados filtrados por categoria
     */
    async executeByCategory(usuarioId: string, categoria: string): Promise<PantryPDFData> {
        try {
            const data = await this.execute(usuarioId);

            // Filtrar por categoria
            const filteredItems = data.items.filter(item =>
                item.categoria.toLowerCase() === categoria.toLowerCase()
            );

            if (filteredItems.length === 0) {
                throw AppError.badRequest(`Nenhum item encontrado na categoria ${categoria}`);
            }

            // Recalcular estatísticas
            const vencidos = filteredItems.filter(item => item.isVencido()).length;
            const vencendo = filteredItems.filter(item => item.isVencendoEmBreve() && !item.isVencido()).length;
            const frescos = filteredItems.filter(item => item.isFresco()).length;

            return {
                ...data,
                items: filteredItems,
                estatisticas: {
                    total: filteredItems.length,
                    vencidos,
                    vencendo,
                    frescos
                }
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao exportar categoria');
        }
    }

    /**
     * Prepara dados apenas de itens vencendo/vencidos (alertas)
     */
    async executeAlertsOnly(usuarioId: string, dias: number = 3): Promise<PantryPDFData> {
        try {
            const data = await this.execute(usuarioId);

            // Filtrar apenas vencidos e vencendo
            const filteredItems = data.items.filter(item =>
                item.isVencido() || item.isVencendoEmBreve(dias)
            );

            if (filteredItems.length === 0) {
                throw AppError.badRequest('Nenhum item vencido ou vencendo encontrado');
            }

            const vencidos = filteredItems.filter(item => item.isVencido()).length;
            const vencendo = filteredItems.length - vencidos;

            return {
                ...data,
                items: filteredItems,
                estatisticas: {
                    total: filteredItems.length,
                    vencidos,
                    vencendo,
                    frescos: 0
                }
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao exportar alertas');
        }
    }
}