import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Deletar Item de Alimento
* 
* Responsabilidade:
* - Remover alimento da despensa
* - Validar existência
* - Garantir autorização (em produção)
*/
export class DeleteFoodItemUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Executa deleção de alimento
     * 
     * @param id - ID do alimento
     * @param usuarioId - ID do usuário (para validação de ownership)
     * @returns Promise<void>
     * @throws AppError - Se alimento não existir
     */
    async execute(id: number, usuarioId?: string): Promise<void> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID do alimento é inválido');
            }

            // Verificar se alimento existe
            const existingItem = await this.foodItemRepository.findById(id);
            if (!existingItem) {
                throw AppError.notFound('Alimento não encontrado');
            }

            // Validar ownership se usuarioId fornecido
            if (usuarioId && existingItem.usuarioId !== usuarioId) {
                throw AppError.forbidden('Você não tem permissão para deletar este alimento');
            }

            // Deletar alimento
            await this.foodItemRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no DeleteFoodItemUseCase:', error);
            throw AppError.internal('Erro ao deletar alimento');
        }
    }

    /**
     * Deleta com confirmação (verifica se realmente existe)
     */
    async executeWithConfirmation(id: number): Promise<{
        deleted: boolean;
        itemName: string;
    }> {
        try {
            const item = await this.foodItemRepository.findById(id);

            if (!item) {
                return {
                    deleted: false,
                    itemName: ''
                };
            }

            await this.foodItemRepository.delete(id);

            return {
                deleted: true,
                itemName: item.nome
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao deletar alimento');
        }
    }

    /**
     * Verifica se alimento pode ser deletado
     */
    async canDelete(id: number, usuarioId?: string): Promise<{
        canDelete: boolean;
        reason?: string;
    }> {
        try {
            const item = await this.foodItemRepository.findById(id);

            if (!item) {
                return { canDelete: false, reason: 'Alimento não encontrado' };
            }

            if (usuarioId && item.usuarioId !== usuarioId) {
                return { canDelete: false, reason: 'Sem permissão' };
            }

            return { canDelete: true };
        } catch (error) {
            return { canDelete: false, reason: 'Erro ao verificar' };
        }
    }
}