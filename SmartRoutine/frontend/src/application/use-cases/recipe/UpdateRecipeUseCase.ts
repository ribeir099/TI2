import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { UpdateRecipeInputDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Atualizar Receita
* 
* Responsabilidade:
* - Atualizar dados de receita existente
* - Validar alterações
* - Garantir integridade
*/
export class UpdateRecipeUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Executa atualização de receita
     * 
     * @param id - ID da receita
     * @param input - Dados a serem atualizados
     * @returns Promise<Recipe> - Receita atualizada
     * @throws AppError - Se validações falharem
     */
    async execute(id: number, input: UpdateRecipeInputDTO): Promise<Recipe> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            // Validar entrada
            this.validateInput(input);

            // Verificar se receita existe
            const existingRecipe = await this.recipeRepository.findById(id);
            if (!existingRecipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            // Normalizar dados
            const normalizedInput = this.normalizeInput(input);

            // Atualizar receita
            const recipe = await this.recipeRepository.update(id, normalizedInput);

            return recipe;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no UpdateRecipeUseCase:', error);
            throw AppError.internal('Erro ao atualizar receita');
        }
    }

    /**
     * Atualiza apenas título
     */
    async updateTitle(id: number, titulo: string): Promise<Recipe> {
        try {
            if (!titulo || titulo.trim().length < 3) {
                throw AppError.badRequest('Título inválido');
            }

            return await this.execute(id, { titulo });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao atualizar título');
        }
    }

    /**
     * Atualiza apenas tempo de preparo
     */
    async updateTime(id: number, tempoPreparo: number): Promise<Recipe> {
        try {
            if (tempoPreparo <= 0) {
                throw AppError.badRequest('Tempo de preparo inválido');
            }

            return await this.execute(id, { tempoPreparo });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao atualizar tempo');
        }
    }

    /**
     * Adiciona ingrediente à receita
     */
    async addIngredient(id: number, ingrediente: string): Promise<Recipe> {
        try {
            const recipe = await this.recipeRepository.findById(id);
            if (!recipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            const novosIngredientes = [...recipe.ingredientes, ingrediente.trim()];

            return await this.execute(id, { ingredientes: novosIngredientes });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao adicionar ingrediente');
        }
    }

    /**
     * Remove ingrediente da receita
     */
    async removeIngredient(id: number, ingrediente: string): Promise<Recipe> {
        try {
            const recipe = await this.recipeRepository.findById(id);
            if (!recipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            const novosIngredientes = recipe.ingredientes.filter(ing => ing !== ingrediente);

            if (novosIngredientes.length === 0) {
                throw AppError.badRequest('Receita deve ter pelo menos um ingrediente');
            }

            return await this.execute(id, { ingredientes: novosIngredientes });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao remover ingrediente');
        }
    }

    /**
     * Adiciona tag à receita
     */
    async addTag(id: number, tag: string): Promise<Recipe> {
        try {
            const recipe = await this.recipeRepository.findById(id);
            if (!recipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            const tags = recipe.tags || [];
            const tagNormalizada = tag.trim().toLowerCase();

            if (tags.includes(tagNormalizada)) {
                throw AppError.conflict('Tag já existe na receita');
            }

            const novasTags = [...tags, tagNormalizada];

            return await this.execute(id, { tags: novasTags });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao adicionar tag');
        }
    }

    /**
     * Remove tag da receita
     */
    async removeTag(id: number, tag: string): Promise<Recipe> {
        try {
            const recipe = await this.recipeRepository.findById(id);
            if (!recipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            const tags = recipe.tags || [];
            const novasTags = tags.filter(t => t !== tag.toLowerCase());

            return await this.execute(id, { tags: novasTags });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao remover tag');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: UpdateRecipeInputDTO): void {
        if (!input || Object.keys(input).length === 0) {
            throw AppError.badRequest('Nenhum dado para atualizar');
        }

        // Validar título se fornecido
        if (input.titulo !== undefined) {
            if (input.titulo.trim().length === 0) {
                throw AppError.badRequest('Título não pode ser vazio');
            }

            if (input.titulo.trim().length < 3) {
                throw AppError.badRequest('Título deve ter pelo menos 3 caracteres');
            }

            if (input.titulo.length > 200) {
                throw AppError.badRequest('Título muito longo');
            }
        }

        // Validar tempo se fornecido
        if (input.tempoPreparo !== undefined) {
            if (input.tempoPreparo <= 0) {
                throw AppError.badRequest('Tempo de preparo deve ser maior que zero');
            }

            if (input.tempoPreparo > 1440) {
                throw AppError.badRequest('Tempo de preparo muito longo');
            }
        }

        // Validar porção se fornecida
        if (input.porcao !== undefined && input.porcao.trim().length === 0) {
            throw AppError.badRequest('Porção não pode ser vazia');
        }

        // Validar ingredientes se fornecidos
        if (input.ingredientes !== undefined) {
            if (input.ingredientes.length === 0) {
                throw AppError.badRequest('Receita deve ter pelo menos um ingrediente');
            }

            if (input.ingredientes.length > 50) {
                throw AppError.badRequest('Máximo de 50 ingredientes');
            }
        }

        // Validar modo de preparo se fornecido
        if (input.modoPreparo !== undefined) {
            if (input.modoPreparo.length === 0) {
                throw AppError.badRequest('Modo de preparo deve ter pelo menos um passo');
            }

            if (input.modoPreparo.length > 50) {
                throw AppError.badRequest('Máximo de 50 passos');
            }
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
    }

    /**
     * Normaliza dados de entrada
     */
    private normalizeInput(input: UpdateRecipeInputDTO): UpdateRecipeInputDTO {
        const normalized: UpdateRecipeInputDTO = {};

        if (input.titulo) {
            normalized.titulo = input.titulo.trim();
        }

        if (input.porcao) {
            normalized.porcao = input.porcao.trim();
        }

        if (input.tempoPreparo !== undefined) {
            normalized.tempoPreparo = input.tempoPreparo;
        }

        if (input.imagem) {
            normalized.imagem = input.imagem.trim();
        }

        if (input.ingredientes) {
            normalized.ingredientes = input.ingredientes
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0);
        }

        if (input.modoPreparo) {
            normalized.modoPreparo = input.modoPreparo
                .map(passo => passo.trim())
                .filter(passo => passo.length > 0);
        }

        if (input.dificuldade) {
            normalized.dificuldade = input.dificuldade.trim();
        }

        if (input.tipoRefeicao) {
            normalized.tipoRefeicao = input.tipoRefeicao.trim();
        }

        if (input.calorias !== undefined) {
            normalized.calorias = input.calorias;
        }

        if (input.tags) {
            normalized.tags = input.tags
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag.length > 0);
        }

        return normalized;
    }
}