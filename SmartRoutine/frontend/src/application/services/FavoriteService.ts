import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import {
 CreateReceitaFavoritaInputDTO,
 ReceitaFavoritaOutputDTO,
 ReceitaFavoritaSummaryDTO,
 RecipeWithFavoriteCountDTO,
 FavoriteStatisticsDTO,
 IsFavoriteDTO,
 FavoriteRankingDTO,
 ReceitaFavoritaDTOMapper
} from '@/application/dto/ReceitaFavoritaDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Serviço de Favoritos
* 
* Responsabilidades:
* - Gerenciamento de receitas favoritas
* - Toggle de favoritos
* - Rankings e estatísticas
* - Recomendações
*/
export class FavoriteService {
 constructor(
   private readonly favoritaRepository: IReceitaFavoritaRepository,
   private readonly recipeRepository: IRecipeRepository
 ) {}

 /**
  * Lista todos os favoritos
  */
 async getAllFavorites(): Promise<ReceitaFavoritaOutputDTO[]> {
   try {
     const favoritas = await this.favoritaRepository.findAll();
     return ReceitaFavoritaDTOMapper.toOutputDTOList(favoritas);
   } catch (error) {
     throw AppError.internal('Erro ao listar favoritos');
   }
 }

 /**
  * Busca favorito por ID
  */
 async getFavoriteById(id: number): Promise<ReceitaFavoritaOutputDTO> {
   try {
     const favorita = await this.favoritaRepository.findById(id);
     
     if (!favorita) {
       throw AppError.notFound('Favorito não encontrado');
     }

     return ReceitaFavoritaDTOMapper.toOutputDTO(favorita);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar favorito');
   }
 }

 /**
  * Lista favoritos de um usuário
  */
 async getFavoritesByUserId(usuarioId: string): Promise<ReceitaFavoritaOutputDTO[]> {
   try {
     const favoritas = await this.favoritaRepository.findByUserId(usuarioId);
     return ReceitaFavoritaDTOMapper.toOutputDTOList(favoritas);
   } catch (error) {
     throw AppError.internal('Erro ao listar favoritos do usuário');
   }
 }

 /**
  * Lista favoritos resumidos de um usuário
  */
 async getFavoritesSummaryByUserId(usuarioId: string): Promise<ReceitaFavoritaSummaryDTO[]> {
   try {
     const favoritas = await this.favoritaRepository.findByUserId(usuarioId);
     return ReceitaFavoritaDTOMapper.toSummaryDTOList(favoritas);
   } catch (error) {
     throw AppError.internal('Erro ao listar resumo de favoritos');
   }
 }

 /**
  * Lista favoritos recentes de um usuário
  */
 async getRecentFavorites(usuarioId: string, limit: number = 10): Promise<ReceitaFavoritaOutputDTO[]> {
   try {
     const favoritas = await this.favoritaRepository.findRecentByUserId(usuarioId, limit);
     return ReceitaFavoritaDTOMapper.toOutputDTOList(favoritas);
   } catch (error) {
     throw AppError.internal('Erro ao listar favoritos recentes');
   }
 }

 /**
  * Lista usuários que favoritaram uma receita
  */
 async getUsersWhoFavorited(receitaId: number): Promise<ReceitaFavoritaOutputDTO[]> {
   try {
     const favoritas = await this.favoritaRepository.findByRecipeId(receitaId);
     return ReceitaFavoritaDTOMapper.toOutputDTOList(favoritas);
   } catch (error) {
     throw AppError.internal('Erro ao listar usuários que favoritaram');
   }
 }

 /**
  * Verifica se receita é favorita
  */
 async isFavorite(usuarioId: string, receitaId: number): Promise<IsFavoriteDTO> {
   try {
     const favorita = await this.favoritaRepository.findByUserAndRecipe(usuarioId, receitaId);
     return ReceitaFavoritaDTOMapper.toIsFavoriteDTO(usuarioId, receitaId, favorita || undefined);
   } catch (error) {
     throw AppError.internal('Erro ao verificar favorito');
   }
 }

 /**
  * Conta favoritos de uma receita
  */
 async countFavoritesByRecipe(receitaId: number): Promise<number> {
   try {
     return await this.favoritaRepository.countByRecipeId(receitaId);
   } catch (error) {
     throw AppError.internal('Erro ao contar favoritos da receita');
   }
 }

 /**
  * Conta favoritos de um usuário
  */
 async countFavoritesByUser(usuarioId: string): Promise<number> {
   try {
     return await this.favoritaRepository.countByUserId(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao contar favoritos do usuário');
   }
 }

 /**
  * Lista receitas mais favoritadas
  */
 async getMostFavoritedRecipes(limit: number = 10): Promise<RecipeWithFavoriteCountDTO[]> {
   try {
     return await this.favoritaRepository.findMostFavorited(limit);
   } catch (error) {
     throw AppError.internal('Erro ao listar receitas mais favoritadas');
   }
 }

 /**
  * Obtém ranking de receitas favoritas
  */
 async getFavoriteRanking(limit: number = 10): Promise<FavoriteRankingDTO[]> {
   try {
     const mostFavorited = await this.favoritaRepository.findMostFavorited(limit);
     const totalUsuarios = 100; // TODO: Buscar do UserRepository

     return ReceitaFavoritaDTOMapper.toFavoriteRanking(mostFavorited, totalUsuarios);
   } catch (error) {
     throw AppError.internal('Erro ao obter ranking de favoritos');
   }
 }

 /**
  * Obtém estatísticas de favoritos
  */
 async getFavoriteStatistics(usuarioId: string): Promise<FavoriteStatisticsDTO> {
   try {
     return await this.favoritaRepository.getStatistics(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao calcular estatísticas de favoritos');
   }
 }

 /**
  * Lista IDs das receitas favoritas de um usuário
  */
 async getFavoriteRecipeIds(usuarioId: string): Promise<number[]> {
   try {
     return await this.favoritaRepository.findRecipeIdsByUserId(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao listar IDs de receitas favoritas');
   }
 }

 /**
  * Adiciona receita aos favoritos
  */
 async addFavorite(input: CreateReceitaFavoritaInputDTO): Promise<ReceitaFavoritaOutputDTO> {
   try {
     // Validar entrada
     const errors = ReceitaFavoritaDTOMapper.validateCreateInput(input);
     if (errors.length > 0) {
       throw AppError.badRequest(errors.join(', '));
     }

     // Verificar se receita existe
     const recipeExists = await this.recipeRepository.existsById(input.receitaId);
     if (!recipeExists) {
       throw AppError.notFound('Receita não encontrada');
     }

     // Verificar se já é favorita
     const isFavorite = await this.favoritaRepository.isFavorite(
       input.usuarioId,
       input.receitaId
     );

     if (isFavorite) {
       throw AppError.conflict('Receita já está nos favoritos');
     }

     // Adicionar aos favoritos
     const favorita = await this.favoritaRepository.create(input);

     return ReceitaFavoritaDTOMapper.toOutputDTO(favorita);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao adicionar favorito');
   }
 }

 /**
  * Remove receita dos favoritos por ID
  */
 async removeFavoriteById(id: number): Promise<void> {
   try {
     // Verificar se favorito existe
     const existingFavorite = await this.favoritaRepository.findById(id);
     if (!existingFavorite) {
       throw AppError.notFound('Favorito não encontrado');
     }

     await this.favoritaRepository.delete(id);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao remover favorito');
   }
 }

 /**
  * Remove receita dos favoritos por usuário e receita
  */
 async removeFavoriteByUserAndRecipe(usuarioId: string, receitaId: number): Promise<void> {
   try {
     // Verificar se é favorita
     const isFavorite = await this.favoritaRepository.isFavorite(usuarioId, receitaId);
     
     if (!isFavorite) {
       throw AppError.notFound('Receita não está nos favoritos');
     }

     await this.favoritaRepository.deleteByUserAndRecipe(usuarioId, receitaId);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao remover favorito');
   }
 }

 /**
  * Toggle favorito (adiciona se não existe, remove se existe)
  */
 async toggleFavorite(usuarioId: string, receitaId: number): Promise<{
   isFavorita: boolean;
   message: string;
 }> {
   try {
     const isAdded = await this.favoritaRepository.toggle(usuarioId, receitaId);

     return {
       isFavorita: isAdded,
       message: isAdded 
         ? 'Receita adicionada aos favoritos' 
         : 'Receita removida dos favoritos'
     };
   } catch (error) {
     throw AppError.internal('Erro ao alternar favorito');
   }
 }

 /**
  * Remove todos os favoritos de um usuário
  */
 async removeAllUserFavorites(usuarioId: string): Promise<number> {
   try {
     return await this.favoritaRepository.deleteAllByUserId(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao remover todos os favoritos');
   }
 }

 /**
  * Remove todos os favoritos de uma receita
  */
 async removeAllRecipeFavorites(receitaId: number): Promise<number> {
   try {
     return await this.favoritaRepository.deleteAllByRecipeId(receitaId);
   } catch (error) {
     throw AppError.internal('Erro ao remover favoritos da receita');
   }
 }

 /**
  * Busca receitas similares às favoritas do usuário
  */
 async getSimilarRecipes(usuarioId: string, limit: number = 10): Promise<number[]> {
   try {
     return await this.favoritaRepository.findSimilarRecipes(usuarioId, limit);
   } catch (error) {
     throw AppError.internal('Erro ao buscar receitas similares');
   }
 }

 /**
  * Verifica se favorito existe
  */
 async favoriteExists(id: number): Promise<boolean> {
   try {
     return await this.favoritaRepository.existsById(id);
   } catch (error) {
     return false;
   }
 }
}