import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

/**
* Dados do perfil
*/
export interface UpdateProfileInput {
 primeiroNome?: string;
 sobrenome?: string;
 email?: string;
 dataNascimento?: string;
 avatar?: string;
}

/**
* Use Case: Atualizar Perfil do Usuário
* 
* Responsabilidade:
* - Atualizar informações de perfil
* - Validar dados de perfil
* - Atualizar avatar (URL)
*/
export class UpdateUserProfileUseCase {
 constructor(private readonly userRepository: IUserRepository) {}

 /**
  * Atualiza perfil do usuário
  * 
  * @param userId - ID do usuário
  * @param input - Dados do perfil
  * @returns Promise<User> - Usuário atualizado
  */
 async execute(userId: string, input: UpdateProfileInput): Promise<User> {
   try {
     // Validar entrada
     this.validateInput(userId, input);

     // Verificar se usuário existe
     const existingUser = await this.userRepository.findById(userId);
     if (!existingUser) {
       throw AppError.notFound('Usuário não encontrado');
     }

     // Construir nome completo se necessário
     let nomeCompleto: string | undefined;
     if (input.primeiroNome || input.sobrenome) {
       const primeiro = input.primeiroNome || existingUser.primeiroNome;
       const sobre = input.sobrenome || existingUser.sobrenome;
       nomeCompleto = `${primeiro} ${sobre}`.trim();
     }

     // Atualizar usuário
     const user = await this.userRepository.update(userId, {
       nome: nomeCompleto,
       email: input.email,
       dataNascimento: input.dataNascimento
       // avatar seria um campo adicional no User
     });

     return user;
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no UpdateUserProfileUseCase:', error);
     throw AppError.internal('Erro ao atualizar perfil');
   }
 }

 /**
  * Atualiza apenas avatar
  */
 async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
   try {
     // Validar URL
     if (!this.isValidUrl(avatarUrl)) {
       throw AppError.badRequest('URL do avatar inválida');
     }

     // TODO: Atualizar quando User tiver campo avatar
     const user = await this.userRepository.findById(userId);
     if (!user) {
       throw AppError.notFound('Usuário não encontrado');
     }

     return user;
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar avatar');
   }
 }

 /**
  * Remove avatar (volta ao padrão)
  */
 async removeAvatar(userId: string): Promise<User> {
   try {
     const user = await this.userRepository.findById(userId);
     if (!user) {
       throw AppError.notFound('Usuário não encontrado');
     }

     // TODO: Implementar quando User tiver campo avatar
     return user;
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao remover avatar');
   }
 }

 // ==================== MÉTODOS PRIVADOS ====================

 /**
  * Valida entrada
  */
 private validateInput(userId: string, input: UpdateProfileInput): void {
   if (!userId || userId.trim().length === 0) {
     throw AppError.badRequest('ID do usuário é obrigatório');
   }

   if (!input || Object.keys(input).length === 0) {
     throw AppError.badRequest('Nenhum dado de perfil para atualizar');
   }

   // Validar primeiro nome
   if (input.primeiroNome !== undefined) {
     if (input.primeiroNome.trim().length === 0) {
       throw AppError.badRequest('Primeiro nome não pode ser vazio');
     }

     if (input.primeiroNome.trim().length < 2) {
       throw AppError.badRequest('Primeiro nome deve ter pelo menos 2 caracteres');
     }
   }

   // Validar sobrenome
   if (input.sobrenome !== undefined) {
     if (input.sobrenome.trim().length === 0) {
       throw AppError.badRequest('Sobrenome não pode ser vazio');
     }

     if (input.sobrenome.trim().length < 2) {
       throw AppError.badRequest('Sobrenome deve ter pelo menos 2 caracteres');
     }
   }

   // Validar avatar URL
   if (input.avatar !== undefined && input.avatar.length > 0) {
     if (!this.isValidUrl(input.avatar)) {
       throw AppError.badRequest('URL do avatar inválida');
     }
   }
 }

 /**
  * Valida URL
  */
 private isValidUrl(url: string): boolean {
   try {
     new URL(url);
     return true;
   } catch (error) {
     return false;
   }
 }
}