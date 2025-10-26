import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de deleção
*/
export interface DeleteUserOptions {
 confirmarSenha?: string;
 deletarDados?: boolean; // Deletar alimentos e favoritos também
}

/**
* Resultado da deleção
*/
export interface DeleteUserResult {
 deleted: boolean;
 userName: string;
 dataDeleted: {
   foodItems: number;
   favorites: number;
 };
}

/**
* Use Case: Deletar Usuário
* 
* Responsabilidade:
* - Deletar conta de usuário
* - Remover dados associados
* - Validar permissões
* - Garantir integridade
*/
export class DeleteUserUseCase {
 constructor(
   private readonly userRepository: IUserRepository,
   private readonly foodItemRepository?: IFoodItemRepository,
   private readonly favoritaRepository?: IReceitaFavoritaRepository
 ) {}

 /**
  * Executa deleção de usuário
  * 
  * @param id - ID do usuário
  * @param requestingUserId - ID do usuário fazendo a requisição
  * @param options - Opções de deleção
  * @returns Promise<void>
  * @throws AppError - Se validações falharem
  */
 async execute(
   id: string,
   requestingUserId: string,
   options: DeleteUserOptions = {}
 ): Promise<void> {
   try {
     // Validar IDs
     if (!id || id.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     if (!requestingUserId || requestingUserId.trim().length === 0) {
       throw AppError.badRequest('ID do requisitante é obrigatório');
     }

     // Verificar permissão
     if (id !== requestingUserId) {
       throw AppError.forbidden('Você só pode deletar sua própria conta');
       // TODO: Adicionar verificação de admin
     }

     // Verificar se usuário existe
     const user = await this.userRepository.findById(id);
     if (!user) {
       throw AppError.notFound('Usuário não encontrado');
     }

     // Deletar dados associados se solicitado
     if (options.deletarDados !== false) { // Default true
       await this.deleteUserData(id);
     }

     // Deletar usuário
     await this.userRepository.delete(id);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no DeleteUserUseCase:', error);
     throw AppError.internal('Erro ao deletar usuário');
   }
 }

 /**
  * Deleta com resultado detalhado
  */
 async executeWithResult(
   id: string,
   requestingUserId: string,
   options: DeleteUserOptions = {}
 ): Promise<DeleteUserResult> {
   try {
     const user = await this.userRepository.findById(id);

     if (!user) {
       return {
         deleted: false,
         userName: '',
         dataDeleted: { foodItems: 0, favorites: 0 }
       };
     }

     // Contar dados que serão deletados
     let foodItemsCount = 0;
     let favoritesCount = 0;

     if (this.foodItemRepository) {
       foodItemsCount = await this.foodItemRepository.countByUserId(id);
     }

     if (this.favoritaRepository) {
       favoritesCount = await this.favoritaRepository.countByUserId(id);
     }

     // Deletar
     await this.execute(id, requestingUserId, options);

     return {
       deleted: true,
       userName: user.nome,
       dataDeleted: {
         foodItems: foodItemsCount,
         favorites: favoritesCount
       }
     };
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao deletar usuário');
   }
 }

 /**
  * Preview de deleção (mostra o que será deletado)
  */
 async previewDelete(id: string): Promise<{
   user: User | null;
   dataToDelete: {
     foodItems: number;
     favorites: number;
     totalItems: number;
   };
   warnings: string[];
 }> {
   try {
     const user = await this.userRepository.findById(id);

     if (!user) {
       return {
         user: null,
         dataToDelete: { foodItems: 0, favorites: 0, totalItems: 0 },
         warnings: []
       };
     }

     let foodItemsCount = 0;
     let favoritesCount = 0;

     if (this.foodItemRepository) {
       foodItemsCount = await this.foodItemRepository.countByUserId(id);
     }

     if (this.favoritaRepository) {
       favoritesCount = await this.favoritaRepository.countByUserId(id);
     }

     const totalItems = foodItemsCount + favoritesCount;

     const warnings: string[] = [];
     if (foodItemsCount > 0) {
       warnings.push(`${foodItemsCount} item(ns) da despensa serão deletados`);
     }
     if (favoritesCount > 0) {
       warnings.push(`${favoritesCount} receita(s) favorita(s) serão removidas`);
     }
     if (totalItems > 0) {
       warnings.push('Esta ação não pode ser desfeita');
     }

     return {
       user,
       dataToDelete: {
         foodItems: foodItemsCount,
         favorites: favoritesCount,
         totalItems
       },
       warnings
     };
   } catch (error) {
     return {
       user: null,
       dataToDelete: { foodItems: 0, favorites: 0, totalItems: 0 },
       warnings: ['Erro ao obter preview']
     };
   }
 }

 /**
  * Verifica se usuário pode ser deletado
  */
 async canDelete(id: string, requestingUserId: string): Promise<{
   canDelete: boolean;
   reason?: string;
 }> {
   try {
     // Verificar permissão
     if (id !== requestingUserId) {
       return {
         canDelete: false,
         reason: 'Você só pode deletar sua própria conta'
       };
     }

     // Verificar se usuário existe
     const exists = await this.userRepository.existsById(id);
     if (!exists) {
       return {
         canDelete: false,
         reason: 'Usuário não encontrado'
       };
     }

     return { canDelete: true };
   } catch (error) {
     return { canDelete: false, reason: 'Erro ao verificar' };
   }
 }

 // ==================== MÉTODOS PRIVADOS ====================

 /**
  * Valida entrada
  */
 private validateInput(input: UpdateUserInputDTO): void {
   if (!input || Object.keys(input).length === 0) {
     throw AppError.badRequest('Nenhum dado para atualizar');
   }
 }

 /**
  * Normaliza e valida dados
  */
 private async normalizeAndValidateInput(
   id: string,
   input: UpdateUserInputDTO,
   existingUser: User
 ): Promise<UpdateUserInputDTO> {
   const normalized: UpdateUserInputDTO = {};

   if (input.nome) {
     normalized.nome = input.nome.trim();
   }

   if (input.email) {
     const emailVO = Email.create(input.email);
     const emailNormalizado = emailVO.getValue();

     if (emailNormalizado !== existingUser.email) {
       const userWithEmail = await this.userRepository.findByEmail(emailNormalizado);
       
       if (userWithEmail && userWithEmail.id !== id) {
         throw AppError.conflict('Email já está em uso');
       }
     }

     normalized.email = emailNormalizado;
   }

   if (input.senha) {
     const passwordVO = Password.create(input.senha, true);
     
     if (passwordVO.isCommon) {
       throw AppError.badRequest('Senha muito comum');
     }

     normalized.senha = input.senha;
   }

   if (input.dataNascimento) {
     this.validateBirthDate(input.dataNascimento);
     normalized.dataNascimento = input.dataNascimento;
   }

   return normalized;
 }

 /**
  * Deleta dados associados do usuário
  */
 private async deleteUserData(userId: string): Promise<void> {
   try {
     // Deletar itens de alimentos
     if (this.foodItemRepository) {
       const foodItems = await this.foodItemRepository.findByUserId(userId);
       await Promise.all(
         foodItems.map(item => this.foodItemRepository!.delete(item.id))
       );
     }

     // Deletar favoritos
     if (this.favoritaRepository) {
       await this.favoritaRepository.deleteAllByUserId(userId);
     }

     // TODO: Deletar outros dados relacionados (se houver)
   } catch (error) {
     console.error('Erro ao deletar dados do usuário:', error);
     // Não lançar erro aqui para permitir que a deleção do usuário continue
   }
 }
}