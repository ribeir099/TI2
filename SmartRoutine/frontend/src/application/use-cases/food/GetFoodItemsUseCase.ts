import { IFoodItemRepository, FoodItemSortOptions } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { AppError } from '@/shared/errors/AppError';
import { FoodCategory } from '@/domain/value-objects';
import { UpdateFoodItemInputDTO } from '@/application/dto';

/**
* Use Case: Obter Itens de Alimentos
* 
* Responsabilidade:
* - Listar alimentos da despensa
* - Filtrar e ordenar resultados
* - Buscar alimentos específicos
*/
export class GetFoodItemsUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Lista todos os alimentos
     * 
     * @returns Promise<FoodItem[]> - Lista de alimentos
     */
    async execute(): Promise<FoodItem[]> {
        try {
            return await this.foodItemRepository.findAll();
        } catch (error) {
            console.error('Erro no GetFoodItemsUseCase:', error);
            throw AppError.internal('Erro ao listar alimentos');
        }
    }

    /**
     * Busca alimento por ID
     * 
     * @param id - ID do alimento
     * @returns Promise<FoodItem> - Alimento encontrado
     * @throws AppError - Se não encontrado
     */
    async executeById(id: number): Promise<FoodItem> {
        try {
            if (!id || id <= 0) {
                throw AppError.badRequest('ID do alimento é inválido');
            }

            const item = await this.foodItemRepository.findById(id);

            if (!item) {
                throw AppError.notFound('Alimento não encontrado');
            }

            return item;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar alimento');
        }
    }

    /**
     * Lista alimentos de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FoodItem[]> - Alimentos do usuário
     */
    async executeByUserId(usuarioId: string): Promise<FoodItem[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.findByUserId(usuarioId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao listar alimentos do usuário');
        }
    }

    /**
     * Lista alimentos por categoria
     * 
     * @param categoria - Nome da categoria
     * @returns Promise<FoodItem[]> - Alimentos da categoria
     */
    async executeByCategory(categoria: string): Promise<FoodItem[]> {
        try {
            if (!categoria || categoria.trim().length === 0) {
                throw AppError.badRequest('Categoria é obrigatória');
            }

            // Normalizar categoria
            const categoryVO = FoodCategory.create(categoria);

            return await this.foodItemRepository.findByCategory(categoryVO.getValue());
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao listar alimentos por categoria');
        }
    }

    /**
     * Lista alimentos com ordenação
     * 
     * @param usuarioId - ID do usuário
     * @param sortOptions - Opções de ordenação
     * @returns Promise<FoodItem[]> - Alimentos ordenados
     */
    async executeWithSort(
        usuarioId: string,
        sortOptions: FoodItemSortOptions
    ): Promise<FoodItem[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.findWithSort(usuarioId, sortOptions);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao listar alimentos ordenados');
        }
    }

    /**
     * Lista alimentos frescos de um usuário
     * 
     * @param usuarioId - ID do usuário
     * @returns Promise<FoodItem[]> - Alimentos frescos
     */
    async executeFreshItems(usuarioId: string): Promise<FoodItem[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.findFreshItems(usuarioId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao listar alimentos frescos');
        }
    }

    /**
     * Busca alimento por ID ou null
     */
    async executeByIdOrNull(id: number): Promise<FoodItem | null> {
        try {
            return await this.executeById(id);
        } catch (error) {
            return null;
        }
    }

    /**
     * Lista categorias disponíveis na despensa
     */
    async executeCategories(usuarioId: string): Promise<string[]> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.getCategories(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao listar categorias');
        }
    }

    /**
     * Conta alimentos de um usuário
     */
    async count(usuarioId: string): Promise<number> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.countByUserId(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao contar alimentos');
        }
    }

    /**
     * Conta alimentos por categoria
     */
    async countByCategory(usuarioId: string): Promise<Record<string, number>> {
        try {
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            return await this.foodItemRepository.countByCategory(usuarioId);
        } catch (error) {
            throw AppError.internal('Erro ao contar por categoria');
        }
    }

    /**
     * Validar entrada de atualização
     */
    private validateInput(input: UpdateFoodItemInputDTO): void {
        // Validar nome se fornecido
        if (input.nome !== undefined && input.nome.trim().length < 2) {
            throw AppError.badRequest('Nome deve ter pelo menos 2 caracteres');
        }

        // Validar quantidade se fornecida
        if (input.quantidade !== undefined && input.quantidade <= 0) {
            throw AppError.badRequest('Quantidade deve ser maior que zero');
        }

        // Validar unidade se fornecida
        if (input.unidadeMedida !== undefined && input.unidadeMedida.trim().length === 0) {
            throw AppError.badRequest('Unidade de medida não pode ser vazia');
        }
    }

    /**
     * Valida datas
     */
    private validateDates(dataCompra: string | undefined, dataValidade: string): void {
        if (!dataValidade) return;

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
                throw AppError.badRequest('Data de compra não pode ser posterior à validade');
            }
        }
    }
}