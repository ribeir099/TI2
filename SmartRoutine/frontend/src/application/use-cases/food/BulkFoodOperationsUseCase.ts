import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { CreateFoodItemInputDTO, UpdateFoodItemInputDTO } from '@/application/dto/FoodItemDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado de operação em lote
*/
export interface BulkOperationResult {
    total: number;
    sucessos: number;
    falhas: number;
    erros: Array<{ index: number; nome?: string; erro: string }>;
    itemsCriados?: FoodItem[];
}

/**
* Use Case: Operações em Lote de Alimentos
* 
* Responsabilidade:
* - Adicionar múltiplos itens de uma vez
* - Deletar múltiplos itens
* - Atualizar múltiplos itens
* - Operações batch otimizadas
*/
export class BulkFoodOperationsUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Adiciona múltiplos alimentos
     * 
     * @param items - Array de dados de alimentos
     * @returns Promise<BulkOperationResult> - Resultado da operação
     */
    async addMultiple(items: CreateFoodItemInputDTO[]): Promise<BulkOperationResult> {
        const result: BulkOperationResult = {
            total: items.length,
            sucessos: 0,
            falhas: 0,
            erros: [],
            itemsCriados: []
        };

        if (!items || items.length === 0) {
            throw AppError.badRequest('Lista de itens é obrigatória');
        }

        if (items.length > 100) {
            throw AppError.badRequest('Limite de 100 itens por operação em lote');
        }

        // Processar cada item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            try {
                const created = await this.foodItemRepository.create(item);
                result.sucessos++;
                result.itemsCriados!.push(created);
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    index: i,
                    nome: item.nome,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Deleta múltiplos alimentos
     * 
     * @param ids - Array de IDs
     * @param usuarioId - ID do usuário (para validação)
     * @returns Promise<BulkOperationResult> - Resultado
     */
    async deleteMultiple(ids: number[], usuarioId?: string): Promise<BulkOperationResult> {
        const result: BulkOperationResult = {
            total: ids.length,
            sucessos: 0,
            falhas: 0,
            erros: []
        };

        if (!ids || ids.length === 0) {
            throw AppError.badRequest('Lista de IDs é obrigatória');
        }

        if (ids.length > 100) {
            throw AppError.badRequest('Limite de 100 itens por operação');
        }

        // Processar cada ID
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            try {
                // Verificar ownership se necessário
                if (usuarioId) {
                    const item = await this.foodItemRepository.findById(id);
                    if (item && item.usuarioId !== usuarioId) {
                        throw new Error('Sem permissão');
                    }
                }

                await this.foodItemRepository.delete(id);
                result.sucessos++;
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    index: i,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Atualiza múltiplos alimentos
     * 
     * @param updates - Array de { id, data }
     * @returns Promise<BulkOperationResult> - Resultado
     */
    async updateMultiple(
        updates: Array<{ id: number; data: UpdateFoodItemInputDTO }>
    ): Promise<BulkOperationResult> {
        const result: BulkOperationResult = {
            total: updates.length,
            sucessos: 0,
            falhas: 0,
            erros: []
        };

        if (!updates || updates.length === 0) {
            throw AppError.badRequest('Lista de atualizações é obrigatória');
        }

        if (updates.length > 100) {
            throw AppError.badRequest('Limite de 100 itens por operação');
        }

        // Processar cada atualização
        for (let i = 0; i < updates.length; i++) {
            const { id, data } = updates[i];

            try {
                await this.foodItemRepository.update(id, data);
                result.sucessos++;
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    index: i,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Atualiza quantidade de múltiplos itens
     * 
     * @param updates - Array de { id, quantidade }
     * @returns Promise<BulkOperationResult> - Resultado
     */
    async updateQuantities(
        updates: Array<{ id: number; quantidade: number }>
    ): Promise<BulkOperationResult> {
        return await this.updateMultiple(
            updates.map(u => ({
                id: u.id,
                data: { quantidade: u.quantidade }
            }))
        );
    }

    /**
     * Importa lista de alimentos (CSV, JSON, etc)
     * 
     * @param data - Dados a serem importados
     * @param usuarioId - ID do usuário
     * @returns Promise<BulkOperationResult> - Resultado
     */
    async import(data: CreateFoodItemInputDTO[], usuarioId: string): Promise<BulkOperationResult> {
        try {
            // Adicionar usuarioId a todos os itens
            const itemsWithUser = data.map(item => ({
                ...item,
                usuarioId
            }));

            return await this.addMultiple(itemsWithUser);
        } catch (error) {
            throw AppError.internal('Erro ao importar alimentos');
        }
    }
}