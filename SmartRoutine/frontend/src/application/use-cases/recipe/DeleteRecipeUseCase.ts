import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { AppError } from '@/shared/errors/AppError';
import { UpdateRecipeInputDTO } from '@/application/dto';
import { Recipe } from '@/domain/entities';

/**
* Opções de deleção
*/
export interface DeleteRecipeOptions {
    removeFavorites?: boolean; // Remover dos favoritos também
    force?: boolean;           // Forçar deleção mesmo com favoritos
}

/**
* Resultado da deleção
*/
export interface DeleteRecipeResult {
    deleted: boolean;
    recipeName: string;
    favoritesRemoved?: number;
}

/**
* Use Case: Deletar Receita
* 
* Responsabilidade:
* - Remover receita do sistema
* - Verificar dependências (favoritos)
* - Limpeza em cascata
*/
export class DeleteRecipeUseCase {
    constructor(
        private readonly recipeRepository: IRecipeRepository,
        private readonly favoritaRepository?: IReceitaFavoritaRepository
    ) { }

    /**
     * Executa deleção de receita
     * 
     * @param id - ID da receita
     * @param options - Opções de deleção
     * @returns Promise<void>
     * @throws AppError - Se receita não existir ou houver dependências
     */
    async execute(id: number, options: DeleteRecipeOptions = {}): Promise<void> {
        try {
            // Validar ID
            if (!id || id <= 0) {
                throw AppError.badRequest('ID da receita é inválido');
            }

            // Verificar se receita existe
            const existingRecipe = await this.recipeRepository.findById(id);
            if (!existingRecipe) {
                throw AppError.notFound('Receita não encontrada');
            }

            // Verificar favoritos se repositório disponível
            if (this.favoritaRepository && !options.force) {
                const favoriteCount = await this.favoritaRepository.countByRecipeId(id);

                if (favoriteCount > 0 && !options.removeFavorites) {
                    throw AppError.conflict(
                        `Esta receita tem ${favoriteCount} favorito(s). ` +
                        'Use a opção removeFavorites=true para remover dos favoritos também.'
                    );
                }
            }

            // Remover dos favoritos se solicitado
            if (options.removeFavorites && this.favoritaRepository) {
                await this.favoritaRepository.deleteAllByRecipeId(id);
            }

            // Deletar receita
            await this.recipeRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no DeleteRecipeUseCase:', error);
            throw AppError.internal('Erro ao deletar receita');
        }
    }

    /**
     * Deleta com resultado detalhado
     */
    async executeWithResult(id: number, options: DeleteRecipeOptions = {}): Promise<DeleteRecipeResult> {
        try {
            const recipe = await this.recipeRepository.findById(id);

            if (!recipe) {
                return {
                    deleted: false,
                    recipeName: ''
                };
            }

            let favoritesRemoved = 0;

            // Remover dos favoritos se solicitado
            if (options.removeFavorites && this.favoritaRepository) {
                favoritesRemoved = await this.favoritaRepository.deleteAllByRecipeId(id);
            }

            await this.recipeRepository.delete(id);

            return {
                deleted: true,
                recipeName: recipe.titulo,
                favoritesRemoved: options.removeFavorites ? favoritesRemoved : undefined
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao deletar receita');
        }
    }

    /**
     * Verifica se receita pode ser deletada
     */
    async canDelete(id: number): Promise<{
        canDelete: boolean;
        reason?: string;
        favoriteCount?: number;
    }> {
        try {
            const recipe = await this.recipeRepository.findById(id);

            if (!recipe) {
                return { canDelete: false, reason: 'Receita não encontrada' };
            }

            // Verificar favoritos
            if (this.favoritaRepository) {
                const favoriteCount = await this.favoritaRepository.countByRecipeId(id);

                if (favoriteCount > 0) {
                    return {
                        canDelete: false,
                        reason: `Receita tem ${favoriteCount} favorito(s)`,
                        favoriteCount
                    };
                }
            }

            return { canDelete: true };
        } catch (error) {
            return { canDelete: false, reason: 'Erro ao verificar' };
        }
    }

    /**
     * Preview de deleção (mostra o que será afetado)
     */
    async previewDelete(id: number): Promise<{
        recipe: Recipe | null;
        favoriteCount: number;
        affectedUsers: string[];
    }> {
        try {
            const recipe = await this.recipeRepository.findById(id);

            if (!recipe) {
                return {
                    recipe: null,
                    favoriteCount: 0,
                    affectedUsers: []
                };
            }

            let favoriteCount = 0;
            let affectedUsers: string[] = [];

            if (this.favoritaRepository) {
                favoriteCount = await this.favoritaRepository.countByRecipeId(id);

                if (favoriteCount > 0) {
                    const favorites = await this.favoritaRepository.findByRecipeId(id);
                    affectedUsers = favorites.map(f => f.usuarioId);
                }
            }

            return {
                recipe,
                favoriteCount,
                affectedUsers
            };
        } catch (error) {
            return {
                recipe: null,
                favoriteCount: 0,
                affectedUsers: []
            };
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: UpdateRecipeInputDTO): void {
        if (!input || Object.keys(input).length === 0) {
            throw AppError.badRequest('Nenhum dado para atualizar');
        }

        // Validações similares ao AddRecipeUseCase
        if (input.titulo !== undefined && input.titulo.trim().length < 3) {
            throw AppError.badRequest('Título deve ter pelo menos 3 caracteres');
        }

        if (input.tempoPreparo !== undefined && input.tempoPreparo <= 0) {
            throw AppError.badRequest('Tempo de preparo deve ser maior que zero');
        }

        if (input.ingredientes !== undefined && input.ingredientes.length === 0) {
            throw AppError.badRequest('Receita deve ter pelo menos um ingrediente');
        }

        if (input.modoPreparo !== undefined && input.modoPreparo.length === 0) {
            throw AppError.badRequest('Modo de preparo deve ter pelo menos um passo');
        }

        if (input.calorias !== undefined && input.calorias < 0) {
            throw AppError.badRequest('Calorias não podem ser negativas');
        }
    }

    /**
     * Normaliza dados
     */
    private normalizeInput(input: UpdateRecipeInputDTO): UpdateRecipeInputDTO {
        const normalized: UpdateRecipeInputDTO = {};

        if (input.titulo) normalized.titulo = input.titulo.trim();
        if (input.porcao) normalized.porcao = input.porcao.trim();
        if (input.tempoPreparo !== undefined) normalized.tempoPreparo = input.tempoPreparo;
        if (input.imagem) normalized.imagem = input.imagem.trim();
        if (input.dificuldade) normalized.dificuldade = input.dificuldade.trim();
        if (input.tipoRefeicao) normalized.tipoRefeicao = input.tipoRefeicao.trim();
        if (input.calorias !== undefined) normalized.calorias = input.calorias;

        if (input.ingredientes) {
            normalized.ingredientes = input.ingredientes
                .map((ing: string) => ing.trim())
                .filter((ing: string | any[]) => ing.length > 0);
        }

        if (input.modoPreparo) {
            normalized.modoPreparo = input.modoPreparo
                .map((passo: string) => passo.trim())
                .filter((passo: string | any[]) => passo.length > 0);
        }

        if (input.tags) {
            normalized.tags = input.tags
                .map((tag: string) => tag.trim().toLowerCase())
                .filter((tag: string | any[]) => tag.length > 0);
        }

        return normalized;
    }
}