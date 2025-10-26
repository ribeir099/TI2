import { AppError } from '@/shared/errors/AppError';

/**
* Status da conta
*/
export enum AccountStatus {
 ACTIVE = 'active',
 DEACTIVATED = 'deactivated',
 SUSPENDED = 'suspended',
 DELETED = 'deleted'
}

/**
* Use Case: Desativar Conta de Usuário
* 
* Responsabilidade:
* - Desativar conta temporariamente
* - Manter dados preservados
* - Permitir reativação
* 
* Nota: Requer campo 'status' na tabela de usuários
*/
export class DeactivateUserAccountUseCase {
 /**
  * Desativa conta
  * 
  * @param userId - ID do usuário
  * @param reason - Motivo da desativação
  * @returns Promise<void>
  */
 async execute(userId: string, reason?: string): Promise<void> {
   try {
     // Validar entrada
     if (!userId || userId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // TODO: Implementar quando houver campo 'status' na tabela
     // await this.userRepository.updateStatus(userId, AccountStatus.DEACTIVATED, reason);

     // Por enquanto, apenas log
     console.log(`Conta ${userId} desativada. Motivo: ${reason || 'Não especificado'}`);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao desativar conta');
   }
 }

 /**
  * Reativa conta
  */
 async reactivate(userId: string): Promise<void> {
   try {
     if (!userId || userId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // TODO: Implementar quando houver campo 'status'
     // await this.userRepository.updateStatus(userId, AccountStatus.ACTIVE);

     console.log(`Conta ${userId} reativada`);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao reativar conta');
   }
 }

 /**
  * Verifica status da conta
  */
 async getAccountStatus(userId: string): Promise<AccountStatus> {
   try {
     // TODO: Implementar quando houver campo 'status'
     // return await this.userRepository.getStatus(userId);

     return AccountStatus.ACTIVE;
   } catch (error) {
     return AccountStatus.ACTIVE;
   }
 }

 /**
  * Verifica se conta está ativa
  */
 async isActive(userId: string): Promise<boolean> {
   const status = await this.getAccountStatus(userId);
   return status === AccountStatus.ACTIVE;
 }
}