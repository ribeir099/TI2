import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { CreateRecipeInputDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Adicionar Receita
* 
* Responsabilidade:
* - Criar nova receita
* - Validar dados da receita
* - Normalizar informações
*/
export class AddRecipeUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Executa criação de receita
     * 
     * @param input - Dados da receita
     * @returns Promise<Recipe> - Receita criada
     * @throws AppError - Se validações falharem
     */
    async execute(input: CreateRecipeInputDTO): Promise<Recipe> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Normalizar dados
            const normalizedInput = this.normalizeInput(input);

            // Criar receita
            const recipe = await this.recipeRepository.create(normalizedInput);

            return recipe;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no AddRecipeUseCase:', error);
            throw AppError.internal('Erro ao adicionar receita');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: CreateRecipeInputDTO): void {
        if (!input) {
            throw AppError.badRequest('Dados da receita são obrigatórios');
        }

        // Validar título
        if (!input.titulo || input.titulo.trim().length === 0) {
            throw AppError.badRequest('Título da receita é obrigatório');
        }

        if (input.titulo.trim().length < 3) {
            throw AppError.badRequest('Título deve ter pelo menos 3 caracteres');
        }

        if (input.titulo.length > 200) {
            throw AppError.badRequest('Título muito longo (máximo 200 caracteres)');
        }

        // Validar tempo de preparo
        if (!input.tempoPreparo || input.tempoPreparo <= 0) {
            throw AppError.badRequest('Tempo de preparo deve ser maior que zero');
        }

        if (input.tempoPreparo > 1440) { // 24 horas
            throw AppError.badRequest('Tempo de preparo muito longo (máximo 24 horas)');
        }

        // Validar porção
        if (!input.porcao || input.porcao.trim().length === 0) {
            throw AppError.badRequest('Porção é obrigatória');
        }

        // Validar ingredientes
        if (!input.ingredientes || input.ingredientes.length === 0) {
            throw AppError.badRequest('Receita deve ter pelo menos um ingrediente');
        }

        if (input.ingredientes.length > 50) {
            throw AppError.badRequest('Máximo de 50 ingredientes por receita');
        }

        // Validar que ingredientes não são vazios
        const ingredientesVazios = input.ingredientes.filter(ing => !ing || ing.trim().length === 0);
        if (ingredientesVazios.length > 0) {
            throw AppError.badRequest('Ingredientes não podem ser vazios');
        }

        // Validar modo de preparo
        if (!input.modoPreparo || input.modoPreparo.length === 0) {
            throw AppError.badRequest('Modo de preparo deve ter pelo menos um passo');
        }

        if (input.modoPreparo.length > 50) {
            throw AppError.badRequest('Máximo de 50 passos no modo de preparo');
        }

        // Validar que passos não são vazios
        const passosVazios = input.modoPreparo.filter(passo => !passo || passo.trim().length === 0);
        if (passosVazios.length > 0) {
            throw AppError.badRequest('Passos do modo de preparo não podem ser vazios');
        }

        // Validar calorias se fornecidas
        if (input.calorias !== undefined) {
            if (input.calorias < 0) {
                throw AppError.badRequest('Calorias não podem ser negativas');
            }

            if (input.calorias > 10000) {
                throw AppError.badRequest('Valor de calorias muito alto');
            }
        }

        // Validar URL da imagem se fornecida
        if (input.imagem && !this.isValidUrl(input.imagem)) {
            throw AppError.badRequest('URL da imagem inválida');
        }
    }

    /**
     * Normaliza dados de entrada
     */
    private normalizeInput(input: CreateRecipeInputDTO): CreateRecipeInputDTO {
        return {
            ...input,
            titulo: input.titulo.trim(),
            porcao: input.porcao.trim(),
            ingredientes: input.ingredientes.map(ing => ing.trim()).filter(ing => ing.length > 0),
            modoPreparo: input.modoPreparo.map(passo => passo.trim()).filter(passo => passo.length > 0),
            dificuldade: input.dificuldade?.trim() || 'Fácil',
            tipoRefeicao: input.tipoRefeicao?.trim() || 'Almoço/Jantar',
            tags: input.tags?.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0) || []
        };
    }

    /**
     * Valida URL
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Valida duplicação de receita (por título similar)
     */
    async checkDuplicate(titulo: string): Promise<boolean> {
        try {
            const recipes = await this.recipeRepository.findByTitle(titulo);
            return recipes.length > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Sugere título alternativo se duplicado
     */
    async suggestAlternativeTitle(titulo: string): Promise<string> {
        const isDuplicate = await this.checkDuplicate(titulo);

        if (!isDuplicate) {
            return titulo;
        }

        // Adicionar número incremental
        let counter = 2;
        let newTitle = `${titulo} (${counter})`;

        while (await this.checkDuplicate(newTitle)) {
            counter++;
            newTitle = `${titulo} (${counter})`;
        }

        return newTitle;
    }
}