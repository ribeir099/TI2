import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import {
 CreateFoodItemInputDTO,
 UpdateFoodItemInputDTO,
 FoodItemOutputDTO,
 FoodItemSummaryDTO,
 FoodItemFiltersDTO,
 FoodItemStatisticsDTO,
 FoodItemsByCategoryDTO,
 ExpirationAlertDTO,
 FoodItemDTOMapper
} from '@/application/dto/FoodItemDTO';
import { AppError } from '@/shared/errors/AppError';
import { FoodCategory } from '@/domain/value-objects/FoodCategory';

/**
* Serviço de Alimentos
* 
* Responsabilidades:
* - CRUD de alimentos
* - Gerenciamento de validades
* - Alertas de vencimento
* - Estatísticas da despensa
*/
export class FoodService {
 constructor(private readonly foodItemRepository: IFoodItemRepository) {}

 /**
  * Lista todos os alimentos
  */
 async getAllFoodItems(): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findAll();
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao listar alimentos');
   }
 }

 /**
  * Busca alimento por ID
  */
 async getFoodItemById(id: number): Promise<FoodItemOutputDTO> {
   try {
     const item = await this.foodItemRepository.findById(id);
     
     if (!item) {
       throw AppError.notFound('Alimento não encontrado');
     }

     return FoodItemDTOMapper.toOutputDTO(item);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar alimento');
   }
 }

 /**
  * Lista alimentos de um usuário
  */
 async getFoodItemsByUserId(usuarioId: string): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao listar alimentos do usuário');
   }
 }

 /**
  * Lista alimentos por categoria
  */
 async getFoodItemsByCategory(categoria: string): Promise<FoodItemOutputDTO[]> {
   try {
     // Validar categoria
     const categoryVO = FoodCategory.create(categoria);
     
     const items = await this.foodItemRepository.findByCategory(categoryVO.getValue());
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao listar alimentos por categoria');
   }
 }

 /**
  * Busca alimentos por nome
  */
 async searchFoodItems(nome: string): Promise<FoodItemOutputDTO[]> {
   try {
     if (!nome || nome.trim().length === 0) {
       return [];
     }

     const items = await this.foodItemRepository.findByName(nome);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao buscar alimentos');
   }
 }

 /**
  * Lista alimentos vencendo em breve
  */
 async getExpiringItems(usuarioId: string, dias: number = 3): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findExpiringItems(usuarioId, dias);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao buscar itens vencendo');
   }
 }

 /**
  * Lista alimentos vencidos
  */
 async getExpiredItems(usuarioId: string): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findExpiredItems(usuarioId);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao buscar itens vencidos');
   }
 }

 /**
  * Lista alimentos frescos
  */
 async getFreshItems(usuarioId: string): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findFreshItems(usuarioId);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao buscar itens frescos');
   }
 }

 /**
  * Busca alimentos com filtros
  */
 async getFoodItemsByFilters(filters: FoodItemFiltersDTO): Promise<FoodItemOutputDTO[]> {
   try {
     const items = await this.foodItemRepository.findByFilters(filters);
     return FoodItemDTOMapper.toOutputDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao buscar alimentos com filtros');
   }
 }

 /**
  * Agrupa alimentos por categoria
  */
 async getFoodItemsGroupedByCategory(usuarioId: string): Promise<FoodItemsByCategoryDTO[]> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);
     return FoodItemDTOMapper.groupByCategory(items);
   } catch (error) {
     throw AppError.internal('Erro ao agrupar alimentos por categoria');
   }
 }

 /**
  * Obtém alertas de validade
  */
 async getExpirationAlerts(usuarioId: string): Promise<ExpirationAlertDTO[]> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);
     return FoodItemDTOMapper.toExpirationAlerts(items);
   } catch (error) {
     throw AppError.internal('Erro ao obter alertas de validade');
   }
 }

 /**
  * Obtém estatísticas da despensa
  */
 async getFoodStatistics(usuarioId: string): Promise<FoodItemStatisticsDTO> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);
     return FoodItemDTOMapper.calculateStatistics(items);
   } catch (error) {
     throw AppError.internal('Erro ao calcular estatísticas');
   }
 }

 /**
  * Lista categorias disponíveis na despensa
  */
 async getCategories(usuarioId: string): Promise<string[]> {
   try {
     return await this.foodItemRepository.getCategories(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao listar categorias');
   }
 }

 /**
  * Cria novo alimento
  */
 async createFoodItem(input: CreateFoodItemInputDTO): Promise<FoodItemOutputDTO> {
   try {
     // Validar entrada
     const errors = FoodItemDTOMapper.validateCreateInput(input);
     if (errors.length > 0) {
       throw AppError.badRequest(errors.join(', '));
     }

     // Normalizar categoria
     const categoryVO = FoodCategory.create(input.categoria);
     input.categoria = categoryVO.getValue();

     // Criar alimento
     const item = await this.foodItemRepository.create(input);

     return FoodItemDTOMapper.toOutputDTO(item);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao criar alimento');
   }
 }

 /**
  * Atualiza alimento
  */
 async updateFoodItem(id: number, input: UpdateFoodItemInputDTO): Promise<FoodItemOutputDTO> {
   try {
     // Validar entrada
     const errors = FoodItemDTOMapper.validateUpdateInput(input);
     if (errors.length > 0) {
       throw AppError.badRequest(errors.join(', '));
     }

     // Verificar se alimento existe
     const existingItem = await this.foodItemRepository.findById(id);
     if (!existingItem) {
       throw AppError.notFound('Alimento não encontrado');
     }

     // Normalizar categoria se fornecida
     if (input.categoria) {
       const categoryVO = FoodCategory.create(input.categoria);
       input.categoria = categoryVO.getValue();
     }

     // Atualizar alimento
     const item = await this.foodItemRepository.update(id, input);

     return FoodItemDTOMapper.toOutputDTO(item);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar alimento');
   }
 }

 /**
  * Deleta alimento
  */
 async deleteFoodItem(id: number): Promise<void> {
   try {
     // Verificar se alimento existe
     const existingItem = await this.foodItemRepository.findById(id);
     if (!existingItem) {
       throw AppError.notFound('Alimento não encontrado');
     }

     await this.foodItemRepository.delete(id);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao deletar alimento');
   }
 }

 /**
  * Deleta todos os itens vencidos
  */
 async deleteExpiredItems(usuarioId: string): Promise<number> {
   try {
     return await this.foodItemRepository.deleteExpiredItems(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao deletar itens vencidos');
   }
 }

 /**
  * Conta alimentos de um usuário
  */
 async countFoodItems(usuarioId: string): Promise<number> {
   try {
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
     return await this.foodItemRepository.countByCategory(usuarioId);
   } catch (error) {
     throw AppError.internal('Erro ao contar alimentos por categoria');
   }
 }

 /**
  * Lista resumido de alimentos (para listagens)
  */
 async getFoodItemsSummary(usuarioId: string): Promise<FoodItemSummaryDTO[]> {
   try {
     const items = await this.foodItemRepository.findByUserId(usuarioId);
     return FoodItemDTOMapper.toSummaryDTOList(items);
   } catch (error) {
     throw AppError.internal('Erro ao listar resumo de alimentos');
   }
 }

 /**
  * Verifica se alimento existe
  */
 async foodItemExists(id: number): Promise<boolean> {
   try {
     return await this.foodItemRepository.existsById(id);
   } catch (error) {
     return false;
   }
 }

 /**
  * Filtra alimentos por categoria (client-side)
  */
 filterByCategory(items: FoodItemOutputDTO[], categoria: string): FoodItemOutputDTO[] {
   if (categoria === 'all' || !categoria) return items;
   return items.filter(item => 
     item.categoria.toLowerCase() === categoria.toLowerCase()
   );
 }

 /**
  * Busca alimentos por nome (client-side)
  */
 searchByName(items: FoodItemOutputDTO[], searchTerm: string): FoodItemOutputDTO[] {
   if (!searchTerm || searchTerm.trim().length === 0) return items;
   
   const term = searchTerm.toLowerCase();
   return items.filter(item =>
     item.nome.toLowerCase().includes(term)
   );
 }

 /**
  * Ordena alimentos
  */
 sortFoodItems(
   items: FoodItemOutputDTO[],
   campo: 'nome' | 'dataValidade' | 'categoria' | 'diasAteVencimento',
   ordem: 'asc' | 'desc' = 'asc'
 ): FoodItemOutputDTO[] {
   const sorted = [...items].sort((a, b) => {
     let comparison = 0;

     switch (campo) {
       case 'nome':
         comparison = a.nome.localeCompare(b.nome);
         break;
       case 'dataValidade':
         comparison = new Date(a.dataValidade).getTime() - new Date(b.dataValidade).getTime();
         break;
       case 'categoria':
         comparison = a.categoria.localeCompare(b.categoria);
         break;
       case 'diasAteVencimento':
         comparison = a.diasAteVencimento - b.diasAteVencimento;
         break;
     }

     return ordem === 'asc' ? comparison : -comparison;
   });

   return sorted;
 }
}