import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { ReceitaFavorita } from '@/domain/entities/ReceitaFavorita';
import { AppError } from '@/shared/errors/AppError';

/**
* Resultado de operação em lote
*/
export interface BulkOperationResult {
    total: number;
    sucessos: number;
    falhas: number;
    erros: Array<{ receitaId: number; erro: string }>;
}

/**
* Use Case: Operações em Lote de Favoritos
* 
* Responsabilidade:
* - Adicionar/remover múltiplos favoritos de uma vez
* - Operações batch otimizadas
*/
export class BulkFavoriteOperationsUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly recipeRepository: IRecipeRepository
    ) { }

    /**
     * Adiciona múltiplas receitas aos favoritos
     * 
     * @param usuarioId - ID do usuário
     * @param receitaIds - Array de IDs de receitas
     * @returns Promise<BulkOperationResult> - Resultado da operação
     */
    async addMultiple(usuarioId: string, receitaIds: number[]): Promise<BulkOperationResult> {
        const result: BulkOperationResult = {
            total: receitaIds.length,
            sucessos: 0,
            falhas: 0,
            erros: []
        };

        if (!usuarioId || usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!receitaIds || receitaIds.length === 0) {
            throw AppError.badRequest('Lista de receitas é obrigatória');
        }

        // Processar cada receita
        for (const receitaId of receitaIds) {
            try {
                // Verificar se receita existe
                const recipeExists = await this.recipeRepository.existsById(receitaId);
                if (!recipeExists) {
                    throw new Error('Receita não encontrada');
                }

                // Verificar se já é favorita
                const alreadyFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);
                if (alreadyFavorite) {
                    throw new Error('Receita já está nos favoritos');
                }

                // Adicionar aos favoritos
                await this.favoritaRepository.create({ usuarioId, receitaId });
                result.sucessos++;
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    receitaId,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Remove múltiplas receitas dos favoritos
     * 
     * @param usuarioId - ID do usuário
     * @param receitaIds - Array de IDs de receitas
     * @returns Promise<BulkOperationResult> - Resultado da operação
     */
    async removeMultiple(usuarioId: string, receitaIds: number[]): Promise<BulkOperationResult> {
        const result: BulkOperationResult = {
            total: receitaIds.length,
            sucessos: 0,
            falhas: 0,
            erros: []
        };

        if (!usuarioId || usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!receitaIds || receitaIds.length === 0) {
            throw AppError.badRequest('Lista de receitas é obrigatória');
        }

        // Processar cada receita
        for (const receitaId of receitaIds) {
            try {
                // Verificar se é favorita
                const isFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);
                if (!isFavorite) {
                    throw new Error('Receita não está nos favoritos');
                }

                // Remover dos favoritos
                await this.favoritaRepository.deleteByUserAndRecipe(usuarioId, receitaId);
                result.sucessos++;
            } catch (error) {
                result.falhas++;
                result.erros.push({
                    receitaId,
                    erro: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        }

        return result;
    }

    /**
     * Sincroniza favoritos (adiciona novos, remove não listados)
     * 
     * @param usuarioId - ID do usuário
     * @param receitaIds - IDs que devem estar nos favoritos
     * @returns Promise<BulkOperationResult> - Resultado
     */
    async syncFavorites(usuarioId: string, receitaIds: number[]): Promise<BulkOperationResult> {
        try {
            // Buscar favoritos atuais
            const favoritosAtuais = await this.favoritaRepository.findRecipeIdsByUserId(usuarioId);
            const favoritosSet = new Set(favoritosAtuais);
            const novosSet = new Set(receitaIds);

            // Calcular diferenças
            const paraAdicionar = receitaIds.filter(id => !favoritosSet.has(id));
            const paraRemover = favoritosAtuais.filter(id => !novosSet.has(id));

            let sucessos = 0;
            let falhas = 0;
            const erros: Array<{ receitaId: number; erro: string }> = [];

            // Adicionar novos
            for (const receitaId of paraAdicionar) {
                try {
                    await this.favoritaRepository.create({ usuarioId, receitaId });
                    sucessos++;
                } catch (error) {
                    falhas++;
                    erros.push({
                        receitaId,
                        erro: `Falha ao adicionar: ${error instanceof Error ? error.message : 'Erro'}`
                    });
                }
            }

            // Remover antigos
            for (const receitaId of paraRemover) {
                try {
                    await this.favoritaRepository.deleteByUserAndRecipe(usuarioId, receitaId);
                    sucessos++;
                } catch (error) {
                    falhas++;
                    erros.push({
                        receitaId,
                        erro: `Falha ao remover: ${error instanceof Error ? error.message : 'Erro'}`
                    });
                }
            }

            return {
                total: paraAdicionar.length + paraRemover.length,
                sucessos,
                falhas,
                erros
            };
        } catch (error) {
            throw AppError.internal('Erro ao sincronizar favoritos');
        }
    }
}