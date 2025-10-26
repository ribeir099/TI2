import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { CreateRecipeInputDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado de operação em lote
*/
export interface BulkRecipeOperationResult {
    total: number;
    sucessos: number;
    falhas: number;
    erros: Array<{ index: number; titulo?: string; erro: string }>;
    recipesCriadas?: Recipe[];
}

/**
* Use Case: Operações em Lote de Receitas
* 
* Responsabilidade:
* - Adicionar/deletar múltiplas receitas
* - Importação em massa
* - Operações batch
*/
export class BulkRecipeOperationsUseCase {
    constructor(private readonly recipeRepository: IRecipeRepository) { }

    /**
     * Adiciona múltiplas receitas
     * 
     * @param recipes - Array de dados de receitas
     * @returns Promise<BulkRecipeOperationResult> - Resultado
     */
    async addMultiple(recipes: CreateRecipeInputDTO[]): Promise<BulkRecipeOperationResult> {
        const result: BulkRecipeOperationResult = {
            total: recipes.length,
            sucessos: 0,
            falhas: 0,
            erros: [],
            recipesCriadas: []
        };

        if (!recipes || recipes.length === 0) {
            throw AppError.badRequest('Lista de receitas é obrigatória');
        }

        if (recipes.length > 50) {
            throw AppError.badRequest('Limite de 50 receitas por operação em lote');
        }

        // Processar cada receita
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];

            try {
                const created = await this.recipeRepository.create(recipe);
                result.sucessos++;
                result.recipesCriadas!.push(created);
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    index: i,
                    titulo: recipe.titulo,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Deleta múltiplas receitas
     * 
     * @param ids - Array de IDs
     * @returns Promise<BulkRecipeOperationResult> - Resultado
     */
    async deleteMultiple(ids: number[]): Promise<BulkRecipeOperationResult> {
        const result: BulkRecipeOperationResult = {
            total: ids.length,
            sucessos: 0,
            falhas: 0,
            erros: []
        };

        if (!ids || ids.length === 0) {
            throw AppError.badRequest('Lista de IDs é obrigatória');
        }

        if (ids.length > 50) {
            throw AppError.badRequest('Limite de 50 receitas por operação');
        }

        // Processar cada ID
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            try {
                await this.recipeRepository.delete(id);
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
     * Importa receitas de arquivo JSON
     * 
     * @param jsonData - Dados JSON
     * @returns Promise<BulkRecipeOperationResult> - Resultado
     */
    async importFromJSON(jsonData: string): Promise<BulkRecipeOperationResult> {
        try {
            const data = JSON.parse(jsonData);

            if (!Array.isArray(data)) {
                throw AppError.badRequest('JSON deve conter um array de receitas');
            }

            return await this.addMultiple(data);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw AppError.badRequest('JSON inválido');
            }

            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao importar receitas');
        }
    }

    /**
     * Duplica receita com variações
     */
    async duplicateWithVariations(
        recipeId: number,
        variations: Array<{ sufixo: string; mudancas: Partial<CreateRecipeInputDTO> }>
    ): Promise<BulkRecipeOperationResult> {
        try {
            const originalRecipe = await this.recipeRepository.findById(recipeId);

            if (!originalRecipe) {
                throw AppError.notFound('Receita original não encontrada');
            }

            const recipesToCreate: CreateRecipeInputDTO[] = variations.map(v => ({
                titulo: `${originalRecipe.titulo} - ${v.sufixo}`,
                tempoPreparo: v.mudancas.tempoPreparo || originalRecipe.tempoPreparo,
                porcao: v.mudancas.porcao || originalRecipe.porcao,
                imagem: v.mudancas.imagem || originalRecipe.imagem,
                ingredientes: v.mudancas.ingredientes || originalRecipe.ingredientes,
                modoPreparo: v.mudancas.modoPreparo || originalRecipe.modoPreparo,
                dificuldade: v.mudancas.dificuldade || originalRecipe.dificuldade,
                tipoRefeicao: v.mudancas.tipoRefeicao || originalRecipe.tipoRefeicao,
                calorias: v.mudancas.calorias || originalRecipe.calorias,
                tags: v.mudancas.tags || originalRecipe.tags
            }));

            return await this.addMultiple(recipesToCreate);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao duplicar com variações');
        }
    }
}