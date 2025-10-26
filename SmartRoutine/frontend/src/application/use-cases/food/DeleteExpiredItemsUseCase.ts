import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { AppError } from '@/shared/errors/AppError';
import { FoodItemStatisticsDTO } from '@/application/dto';

/**
* Resultado da limpeza
*/
export interface CleanupResult {
 totalDeletados: number;
 itemsDeletados: Array<{ id: number; nome: string; diasVencido: number }>;
 categoriasMaisAfetadas: Array<{ categoria: string; quantidade: number }>;
 valorEstimadoDesperdicio: number;
}

/**
* Use Case: Deletar Itens Vencidos
* 
* Responsabilidade:
* - Remover itens vencidos da despensa
* - Limpeza automática
* - Relatório de itens removidos
*/
export class DeleteExpiredItemsUseCase {
 constructor(private readonly foodItemRepository: IFoodItemRepository) {}

 /**
  * Deleta todos os itens vencidos
  * 
  * @param usuarioId - ID do usuário
  * @returns Promise<number> - Quantidade de itens deletados
  */
 async execute(usuarioId: string): Promise<number> {
   try {
     // Validar entrada
     if (!usuarioId || usuarioId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     return await this.foodItemRepository.deleteExpiredItems(usuarioId);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no DeleteExpiredItemsUseCase:', error);
     throw AppError.internal('Erro ao deletar itens vencidos');
   }
 }

 /**
  * Deleta com relatório detalhado
  * 
  * @param usuarioId - ID do usuário
  * @returns Promise<CleanupResult> - Relatório da limpeza
  */
 async executeWithReport(usuarioId: string): Promise<CleanupResult> {
   try {
     // Validar entrada
     if (!usuarioId || usuarioId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // Buscar itens vencidos antes de deletar
     const expiredItems = await this.foodItemRepository.findExpiredItems(usuarioId);

     if (expiredItems.length === 0) {
       return {
         totalDeletados: 0,
         itemsDeletados: [],
         categoriasMaisAfetadas: [],
         valorEstimadoDesperdicio: 0
       };
     }

     // Preparar dados do relatório
     const itemsDeletados = expiredItems.map(item => ({
       id: item.id,
       nome: item.nome,
       diasVencido: Math.abs(item.diasAteVencimento)
     }));

     // Categorias mais afetadas
     const categoriasMap = new Map<string, number>();
     expiredItems.forEach(item => {
       categoriasMap.set(item.categoria, (categoriasMap.get(item.categoria) || 0) + 1);
     });

     const categoriasMaisAfetadas = Array.from(categoriasMap.entries())
       .map(([categoria, quantidade]) => ({ categoria, quantidade }))
       .sort((a, b) => b.quantidade - a.quantidade);

     // Valor estimado
     const valorEstimadoDesperdicio = expiredItems.length * 15;

     // Deletar itens
     const totalDeletados = await this.foodItemRepository.deleteExpiredItems(usuarioId);

     return {
       totalDeletados,
       itemsDeletados,
       categoriasMaisAfetadas,
       valorEstimadoDesperdicio
     };
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao deletar com relatório');
   }
 }

 /**
  * Deleta itens vencidos de uma categoria específica
  * 
  * @param usuarioId - ID do usuário
  * @param categoria - Categoria
  * @returns Promise<number> - Quantidade deletada
  */
 async executeByCategory(usuarioId: string, categoria: string): Promise<number> {
   try {
     const expiredItems = await this.foodItemRepository.findExpiredItems(usuarioId);

     const itemsCategoria = expiredItems.filter(item =>
       item.categoria.toLowerCase() === categoria.toLowerCase()
     );

     // Deletar cada item
     let deleted = 0;
     for (const item of itemsCategoria) {
       try {
         await this.foodItemRepository.delete(item.id);
         deleted++;
       } catch (error) {
         console.error(`Erro ao deletar item ${item.id}:`, error);
       }
     }

     return deleted;
   } catch (error) {
     throw AppError.internal('Erro ao deletar vencidos por categoria');
   }
 }

 /**
  * Deleta itens vencidos há mais de X dias
  * 
  * @param usuarioId - ID do usuário
  * @param diasVencido - Dias desde que venceu
  * @returns Promise<number> - Quantidade deletada
  */
 async executeOlderThan(usuarioId: string, diasVencido: number): Promise<number> {
   try {
     const expiredItems = await this.foodItemRepository.findExpiredItems(usuarioId);

     const itemsAntigos = expiredItems.filter(item =>
       Math.abs(item.diasAteVencimento) >= diasVencido
     );

     // Deletar cada item
     let deleted = 0;
     for (const item of itemsAntigos) {
       try {
         await this.foodItemRepository.delete(item.id);
         deleted++;
       } catch (error) {
         console.error(`Erro ao deletar item ${item.id}:`, error);
       }
     }

     return deleted;
   } catch (error) {
     throw AppError.internal('Erro ao deletar itens antigos');
   }
 }

 /**
  * Preview da limpeza (sem deletar)
  */
 async previewCleanup(usuarioId: string): Promise<{
   total: number;
   items: Array<{ nome: string; categoria: string; diasVencido: number }>;
 }> {
   try {
     const expiredItems = await this.foodItemRepository.findExpiredItems(usuarioId);

     return {
       total: expiredItems.length,
       items: expiredItems.map(item => ({
         nome: item.nome,
         categoria: item.categoria,
         diasVencido: Math.abs(item.diasAteVencimento)
       }))
     };
   } catch (error) {
     return { total: 0, items: [] };
   }
 }

 // ==================== MÉTODOS PRIVADOS ====================

 /**
  * Calcula estatísticas básicas
  */
 private calculateBasicStatistics(items: FoodItem[]): FoodItemStatisticsDTO {
   const total = items.length;
   const vencidos = items.filter(i => i.isVencido()).length;
   const vencendo = items.filter(i => i.isVencendoEmBreve() && !i.isVencido()).length;
   const frescos = items.filter(i => i.isFresco()).length;

   // Itens por categoria
   const categoriasMap = new Map<string, number>();
   items.forEach(item => {
     categoriasMap.set(item.categoria, (categoriasMap.get(item.categoria) || 0) + 1);
   });

   const itensPorCategoria = Array.from(categoriasMap.entries())
     .map(([categoria, quantidade]) => ({
       categoria,
       quantidade,
       percentual: total > 0 ? Math.round((quantidade / total) * 100) : 0
     }))
     .sort((a, b) => b.quantidade - a.quantidade);

   // Dias média até vencimento
   const itemsNaoVencidos = items.filter(i => !i.isVencido());
   const somaDias = itemsNaoVencidos.reduce((sum, item) => sum + item.diasAteVencimento, 0);
   const diasMediaVencimento = itemsNaoVencidos.length > 0 
     ? Math.round(somaDias / itemsNaoVencidos.length) 
     : 0;

   const categoriaComMaisItens = itensPorCategoria.length > 0 
     ? itensPorCategoria[0].categoria 
     : 'N/A';

   const valorEstimadoDesperdicio = vencidos * 15;

   return {
     totalItens: total,
     totalVencidos: vencidos,
     totalVencendo: vencendo,
     totalFrescos: frescos,
     itensPorCategoria,
     diasMediaVencimento,
     categoriaComMaisItens,
     valorEstimadoDesperdicio
   };
 }

 /**
  * Calcula distribuição de validade
  */
 private calculateExpirationDistribution(items: FoodItem[]) {
   return {
     vencidosHaMaisDe7Dias: items.filter(i => i.diasAteVencimento < -7).length,
     vencidosAte7Dias: items.filter(i => i.diasAteVencimento >= -7 && i.diasAteVencimento < 0).length,
     venceHoje: items.filter(i => i.diasAteVencimento === 0).length,
     venceAmanha: items.filter(i => i.diasAteVencimento === 1).length,
     vence2a3Dias: items.filter(i => i.diasAteVencimento >= 2 && i.diasAteVencimento <= 3).length,
     vence4a7Dias: items.filter(i => i.diasAteVencimento >= 4 && i.diasAteVencimento <= 7).length,
     vence8a30Dias: items.filter(i => i.diasAteVencimento >= 8 && i.diasAteVencimento <= 30).length,
     venceMais30Dias: items.filter(i => i.diasAteVencimento > 30).length
   };
 }

 /**
  * Obtém top 5 categorias
  */
 private getTop5Categories(
   itensPorCategoria: Array<{ categoria: string; quantidade: number }>
 ) {
   return itensPorCategoria.slice(0, 5);
 }

 /**
  * Obtém categoria com mais itens vencidos
  */
 private getCategoryWithMostExpired(items: FoodItem[]): string | null {
   const vencidos = items.filter(i => i.isVencido());

   if (vencidos.length === 0) return null;

   const categoriasMap = new Map<string, number>();
   vencidos.forEach(item => {
     categoriasMap.set(item.categoria, (categoriasMap.get(item.categoria) || 0) + 1);
   });

   const sorted = Array.from(categoriasMap.entries())
     .sort((a, b) => b[1] - a[1]);

   return sorted.length > 0 ? sorted[0][0] : null;
 }
}