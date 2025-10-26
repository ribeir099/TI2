import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { FoodCategory } from '@/domain/value-objects/FoodCategory';
import { CreateFoodItemInputDTO } from '@/application/dto/FoodItemDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Adicionar Item de Alimento
* 
* Responsabilidade:
* - Adicionar novo alimento à despensa
* - Validar dados do alimento
* - Verificar se usuário existe
* - Normalizar categoria
*/
export class AddFoodItemUseCase {
    constructor(
        private readonly foodItemRepository: IFoodItemRepository,
        private readonly userRepository: IUserRepository
    ) { }

    /**
     * Executa adição de alimento
     * 
     * @param input - Dados do alimento
     * @returns Promise<FoodItem> - Alimento criado
     * @throws AppError - Se validações falharem
     */
    async execute(input: CreateFoodItemInputDTO): Promise<FoodItem> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Verificar se usuário existe
            const userExists = await this.userRepository.existsById(input.usuarioId);
            if (!userExists) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Normalizar e validar categoria
            const categoryVO = FoodCategory.create(input.categoria);
            const normalizedInput = {
                ...input,
                categoria: categoryVO.getValue(),
                nome: input.nome.trim(),
                unidadeMedida: input.unidadeMedida.trim()
            };

            // Validar datas
            this.validateDates(normalizedInput.dataCompra, normalizedInput.dataValidade);

            // Criar alimento
            const foodItem = await this.foodItemRepository.create(normalizedInput);

            return foodItem;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no AddFoodItemUseCase:', error);
            throw AppError.internal('Erro ao adicionar alimento à despensa');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: CreateFoodItemInputDTO): void {
        if (!input) {
            throw AppError.badRequest('Dados do alimento são obrigatórios');
        }

        // Validar nome
        if (!input.nome || input.nome.trim().length === 0) {
            throw AppError.badRequest('Nome do alimento é obrigatório');
        }

        if (input.nome.trim().length < 2) {
            throw AppError.badRequest('Nome do alimento deve ter pelo menos 2 caracteres');
        }

        if (input.nome.length > 100) {
            throw AppError.badRequest('Nome do alimento muito longo (máximo 100 caracteres)');
        }

        // Validar quantidade
        if (input.quantidade === undefined || input.quantidade === null) {
            throw AppError.badRequest('Quantidade é obrigatória');
        }

        if (input.quantidade <= 0) {
            throw AppError.badRequest('Quantidade deve ser maior que zero');
        }

        if (input.quantidade > 999999) {
            throw AppError.badRequest('Quantidade muito grande');
        }

        // Validar unidade de medida
        if (!input.unidadeMedida || input.unidadeMedida.trim().length === 0) {
            throw AppError.badRequest('Unidade de medida é obrigatória');
        }

        const unidadesValidas = ['kg', 'g', 'L', 'ml', 'unidade', 'pacote', 'caixa'];
        if (!unidadesValidas.includes(input.unidadeMedida.toLowerCase())) {
            throw AppError.badRequest(
                `Unidade de medida inválida. Use: ${unidadesValidas.join(', ')}`
            );
        }

        // Validar data de validade
        if (!input.dataValidade) {
            throw AppError.badRequest('Data de validade é obrigatória');
        }

        // Validar categoria
        if (!input.categoria || input.categoria.trim().length === 0) {
            throw AppError.badRequest('Categoria é obrigatória');
        }

        // Validar usuário
        if (!input.usuarioId || input.usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }
    }

    /**
     * Valida datas de compra e validade
     */
    private validateDates(dataCompra: string | undefined, dataValidade: string): void {
        // Validar data de validade
        const validade = new Date(dataValidade);
        if (isNaN(validade.getTime())) {
            throw AppError.badRequest('Data de validade inválida');
        }

        // Validar data de compra se fornecida
        if (dataCompra) {
            const compra = new Date(dataCompra);
            if (isNaN(compra.getTime())) {
                throw AppError.badRequest('Data de compra inválida');
            }

            // Data de compra não pode ser posterior à validade
            if (compra > validade) {
                throw AppError.badRequest('Data de compra não pode ser posterior à data de validade');
            }

            // Data de compra não pode ser muito no futuro (mais de 7 dias)
            const hoje = new Date();
            const seteias = new Date(hoje);
            seteias.setDate(hoje.getDate() + 7);

            if (compra > seteias) {
                throw AppError.badRequest('Data de compra não pode ser mais de 7 dias no futuro');
            }
        }

        // Aviso se data de validade já passou
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (validade < hoje) {
            // Não bloquear, mas poderia retornar um warning
            console.warn('Alimento sendo adicionado com data de validade já vencida');
        }
    }

    /**
     * Verifica se categoria é válida
     */
    async isValidCategory(categoria: string): Promise<boolean> {
        try {
            FoodCategory.create(categoria);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Sugere categoria com base no nome do alimento
     */
    suggestCategory(nome: string): string {
        const nomeNormalizado = nome.toLowerCase();

        // Mapeamento de palavras-chave para categorias
        const categoriaMap: Record<string, string> = {
            leite: 'Laticínios',
            queijo: 'Laticínios',
            iogurte: 'Laticínios',
            manteiga: 'Laticínios',
            carne: 'Carnes',
            frango: 'Carnes',
            peixe: 'Carnes',
            porco: 'Carnes',
            tomate: 'Vegetais',
            alface: 'Vegetais',
            cenoura: 'Vegetais',
            batata: 'Vegetais',
            banana: 'Frutas',
            maçã: 'Frutas',
            laranja: 'Frutas',
            morango: 'Frutas',
            pão: 'Padaria',
            bolo: 'Padaria',
            arroz: 'Grãos',
            feijão: 'Grãos',
            macarrão: 'Massas',
            massa: 'Massas',
            suco: 'Bebidas',
            refrigerante: 'Bebidas',
            café: 'Bebidas'
        };

        for (const [palavra, categoria] of Object.entries(categoriaMap)) {
            if (nomeNormalizado.includes(palavra)) {
                return categoria;
            }
        }

        return 'Outros';
    }
}