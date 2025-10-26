import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { FoodItemStatisticsDTO } from '@/application/dto/FoodItemDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Estatísticas detalhadas
*/
export interface DetailedStatistics extends FoodItemStatisticsDTO {
 distribuicaoValidade: {
   vencidosHaMaisDe7Dias: number;
   vencidosAte7Dias: number;
   venceHoje: number;
   venceAmanha: number;
   vence2a3Dias: number;
   vence4a7Dias: number;
   vence8a30Dias: number;
   venceMais30Dias: number;
 };
 top5Categorias: Array<{ categoria: string; quantidade: number }>;
 categoriaComMaisVencidos: string | null;
 ultimaCompra?: Date;
 proximoVencimento?: Date;
}

/**
* Use Case: Obter Estatísticas da Despensa
* 
* Responsabilidade:
* - Calcular estatísticas gerais
* - Análise de padrões
* - Métricas de desperdício
*/
export class GetFoodStatisticsUseCase {
 constructor(private readonly foodItemRepository: IFoodItemRepository) {}

 /**
  * Obtém estatísticas básicas
  * 
  * @param usuarioId - ID do usuário
  * @returns Promise<FoodItemStatisticsDTO> - Estatísticas
  */
 async execute(usuarioId: string): Promise<FoodItemStatisticsDTO> {
   try {
     // Validar entrada
     if (!usuarioId || usuarioId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // Buscar todos os itens
     const items = await this.foodItemRepository.findByUserId(usuarioId);

     return this.calculateBasicStatistics(items);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no GetFoodStatisticsUseCase:', error);
     throw AppError.internal('Erro ao calcular estatísticas');
   }
 }

 /**
  * Obtém estatísticas detalhadas
  * 
  * @param usuarioId - ID do usuário
  * @returns Promise<DetailedStatistics> - Estatísticas detalhadas
  */
 async executeDetailed(usuarioId: string): Promise<DetailedStatistics> {
   try {
     if (!usuarioId || usuarioId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     const items = await this.foodItemRepository.findByUserId(usuarioId);

     const basicStats = this.calculateBasicStatistics(items);
     const distribuicao = this.calculateExpirationDistribution(items);
     const top5 = this.getTop5Categories(basicStats.itensPorCategoria);
     const categoriaComMaisVencidos = this.getCategoryWithMostExpired(items);

     // Última compra e próximo vencimento
     let ultimaCompra: Date | undefined;
     let proximoVencimento: Date | undefined;

     const itemsComDataCompra = items.filter(i => i.dataCompra);
     if (itemsComDataCompra.length > 0) {
       ultimaCompra = new Date(
         Math.max(...itemsComDataCompra.map(i => new Date(i.dataCompra!).getTime()))
       );
     }

     const itemsNaoVencidos = items.filter(i => !i.isVencido());
     if (itemsNaoVencidos.length > 0) {
       const itemMaisProximo = itemsNaoVencidos.reduce((closest, item) =>
         item.diasAteVencimento < closest.diasAteVencimento ? item : closest
       );
       proximoVencimento = new Date(itemMaisProximo.dataValidade);
     }

     return {
       ...basicStats,
       distribuicaoValidade: distribuicao,
       top5Categorias: top5,
       categoriaComMaisVencidos,
       ultimaCompra,
       proximoVencimento
     };
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao calcular estatísticas detalhadas');
   }
 }

 /**
  * Obtém estatísticas por período
  */
 async executeByPeriod(
   usuarioId: string,
   dataInicio: string,
   dataFim: string
 ): Promise<FoodItemStatisticsDTO> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);

     // Filtrar por período de compra
     const inicio = new Date(dataInicio);
     const fim = new Date(dataFim);

     const itemsNoPeriodo = items.filter(item => {
       if (!item.dataCompra) return false;
       const compra = new Date(item.dataCompra);
       return compra >= inicio && compra <= fim;
     });

     return this.calculateBasicStatistics(itemsNoPeriodo);
   } catch (error) {
     throw AppError.internal('Erro ao calcular estatísticas por período');
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

   // Dias média até vencimento (apenas não vencidos)
   const itemsNaoVencidos = items.filter(i => !i.isVencido());
   const somaDias = itemsNaoVencidos.reduce((sum, item) => sum + item.diasAteVencimento, 0);
   const diasMediaVencimento = itemsNaoVencidos.length > 0 
     ? Math.round(somaDias / itemsNaoVencidos.length) 
     : 0;

   // Categoria com mais itens
   const categoriaComMaisItens = itensPorCategoria.length > 0 
     ? itensPorCategoria[0].categoria 
     : 'N/A';

   // Valor estimado de desperdício
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
 private calculateExpirationDistribution(items: FoodItem[]): DetailedStatistics['distribuicaoValidade'] {
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
 ): Array<{ categoria: string; quantidade: number }> {
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