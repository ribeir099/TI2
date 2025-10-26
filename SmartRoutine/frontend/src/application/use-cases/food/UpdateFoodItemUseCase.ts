import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { FoodCategory } from '@/domain/value-objects/FoodCategory';
import { UpdateFoodItemInputDTO } from '@/application/dto/FoodItemDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Atualizar Item de Alimento
* 
* Responsabilidade:
* - Atualizar dados de um alimento existente
* - Validar alterações
* - Garantir integridade dos dados
*/
export class UpdateFoodItemUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Executa atualização de alimento
     * 
     * @param id - ID do alimento
     * @param input - Dados a serem atualizados
     * @returns Promise<FoodItem> - Alimento atualizado
     * @throws AppError - Se validações falharem
     */
    async execute(id: number, input: UpdateFoodItemInputDTO): Promise<FoodItem> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID do alimento é inválido');
            }

            // Validar entrada
            this.validateInput(input);

            // Verificar se alimento existe
            const existingItem = await this.foodItemRepository.findById(id);
            if (!existingItem) {
                throw AppError.notFound('Alimento não encontrado');
            }

            // Preparar dados normalizados
            const normalizedInput = { ...input };

            // Normalizar categoria se fornecida
            if (input.categoria) {
                const categoryVO = FoodCategory.create(input.categoria);
                normalizedInput.categoria = categoryVO.getValue();
            }

            // Normalizar nome se fornecido
            if (input.nome) {
                normalizedInput.nome = input.nome.trim();
            }

            // Normalizar unidade se fornecida
            if (input.unidadeMedida) {
                normalizedInput.unidadeMedida = input.unidadeMedida.trim();
            }

            // Validar datas se alteradas
            if (input.dataCompra || input.dataValidade) {
                const dataCompra = input.dataCompra || existingItem.dataCompra;
                const dataValidade = input.dataValidade || existingItem.dataValidade;
                this.validateDates(dataCompra, dataValidade);
            }

            // Atualizar alimento
            const foodItem = await this.foodItemRepository.update(id, normalizedInput);

            return foodItem;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no UpdateFoodItemUseCase:', error);
            throw AppError.internal('Erro ao atualizar alimento');
        }
    }

    /**
     * Atualiza apenas quantidade
     */
    async updateQuantity(id: number, quantidade: number): Promise<FoodItem> {
        try {
            if (quantidade <= 0) {
                throw AppError.badRequest('Quantidade deve ser maior que zero');
            }

            return await this.execute(id, { quantidade });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao atualizar quantidade');
        }
    }

    /**
     * Atualiza apenas data de validade
     */
    async updateExpirationDate(id: number, dataValidade: string): Promise<FoodItem> {
        try {
            const validade = new Date(dataValidade);
            if (isNaN(validade.getTime())) {
                throw AppError.badRequest('Data de validade inválida');
            }

            return await this.execute(id, { dataValidade });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao atualizar data de validade');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: UpdateFoodItemInputDTO): void {
        if (!input || Object.keys(input).length === 0) {
            throw AppError.badRequest('Nenhum dado para atualizar');
        }

        // Validar nome se fornecido
        if (input.nome !== undefined) {
            if (input.nome.trim().length === 0) {
                throw AppError.badRequest('Nome do alimento não pode ser vazio');
            }

            if (input.nome.trim().length < 2) {
                throw AppError.badRequest('Nome do alimento deve ter pelo menos 2 caracteres');
            }

            if (input.nome.length > 100) {
                throw AppError.badRequest('Nome do alimento muito longo');
            }
        }

        // Validar quantidade se fornecida
        if (input.quantidade !== undefined) {
            if (input.quantidade <= 0) {
                throw AppError.badRequest('Quantidade deve ser maior que zero');
            }

            if (input.quantidade > 999999) {
                throw AppError.badRequest('Quantidade muito grande');
            }
        }

        // Validar unidade se fornecida
        if (input.unidadeMedida !== undefined) {
            if (input.unidadeMedida.trim().length === 0) {
                throw AppError.badRequest('Unidade de medida não pode ser vazia');
            }

            const unidadesValidas = ['kg', 'g', 'L', 'ml', 'unidade', 'pacote', 'caixa'];
            if (!unidadesValidas.includes(input.unidadeMedida.toLowerCase())) {
                throw AppError.badRequest(
                    `Unidade de medida inválida. Use: ${unidadesValidas.join(', ')}`
                );
            }
        }

        // Validar categoria se fornecida
        if (input.categoria !== undefined) {
            if (input.categoria.trim().length === 0) {
                throw AppError.badRequest('Categoria não pode ser vazia');
            }
        }
    }

    /**
     * Valida datas
     */
    private validateDates(dataCompra: string | undefined, dataValidade: string): void {
        const validade = new Date(dataValidade);
        if (isNaN(validade.getTime())) {
            throw AppError.badRequest('Data de validade inválida');
        }

        if (dataCompra) {
            const compra = new Date(dataCompra);
            if (isNaN(compra.getTime())) {
                throw AppError.badRequest('Data de compra inválida');
            }

            if (compra > validade) {
                throw AppError.badRequest('Data de compra não pode ser posterior à data de validade');
            }
        }
    }
}