import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { UpdateUserInputDTO } from '@/application/dto/UserDTO';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Atualizar Usuário
* 
* Responsabilidade:
* - Atualizar dados do usuário
* - Validar alterações
* - Verificar duplicidade de email
* - Validar senha se alterada
*/
export class UpdateUserUseCase {
 constructor(private readonly userRepository: IUserRepository) {}

 /**
  * Executa atualização de usuário
  * 
  * @param id - ID do usuário
  * @param input - Dados a serem atualizados
  * @returns Promise<User> - Usuário atualizado
  * @throws AppError - Se validações falharem
  */
 async execute(id: string, input: UpdateUserInputDTO): Promise<User> {
   try {
     // Validar ID
     if (!id || id.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // Validar entrada
     this.validateInput(input);

     // Verificar se usuário existe
     const existingUser = await this.userRepository.findById(id);
     if (!existingUser) {
       throw AppError.notFound('Usuário não encontrado');
     }

     // Normalizar dados
     const normalizedInput = await this.normalizeAndValidateInput(id, input, existingUser);

     // Atualizar usuário
     const user = await this.userRepository.update(id, normalizedInput);

     return user;
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no UpdateUserUseCase:', error);
     throw AppError.internal('Erro ao atualizar usuário');
   }
 }

 /**
  * Atualiza apenas o nome
  */
 async updateName(id: string, nome: string): Promise<User> {
   try {
     if (!nome || nome.trim().length < 3) {
       throw AppError.badRequest('Nome deve ter pelo menos 3 caracteres');
     }

     const partes = nome.trim().split(' ').filter(p => p.length > 0);
     if (partes.length < 2) {
       throw AppError.badRequest('Informe nome completo (nome e sobrenome)');
     }

     return await this.execute(id, { nome });
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar nome');
   }
 }

 /**
  * Atualiza apenas o email
  */
 async updateEmail(id: string, email: string): Promise<User> {
   try {
     const emailVO = Email.create(email);
     return await this.execute(id, { email: emailVO.getValue() });
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar email');
   }
 }

 /**
  * Atualiza apenas a data de nascimento
  */
 async updateBirthDate(id: string, dataNascimento: string): Promise<User> {
   try {
     this.validateBirthDate(dataNascimento);
     return await this.execute(id, { dataNascimento });
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao atualizar data de nascimento');
   }
 }

 /**
  * Verifica se pode atualizar (permissões)
  */
 async canUpdate(requestingUserId: string, targetUserId: string): Promise<{
   canUpdate: boolean;
   reason?: string;
 }> {
   try {
     // Usuário só pode atualizar seus próprios dados
     // Ou ser admin (implementar lógica de admin se necessário)
     if (requestingUserId !== targetUserId) {
       return {
         canUpdate: false,
         reason: 'Você só pode atualizar seus próprios dados'
       };
     }

     // Verificar se usuário existe
     const exists = await this.userRepository.existsById(targetUserId);
     if (!exists) {
       return {
         canUpdate: false,
         reason: 'Usuário não encontrado'
       };
     }

     return { canUpdate: true };
   } catch (error) {
     return { canUpdate: false, reason: 'Erro ao verificar permissões' };
   }
 }

 // ==================== MÉTODOS PRIVADOS ====================

 /**
  * Valida dados de entrada
  */
 private validateInput(input: UpdateUserInputDTO): void {
   if (!input || Object.keys(input).length === 0) {
     throw AppError.badRequest('Nenhum dado para atualizar');
   }

   // Validar nome se fornecido
   if (input.nome !== undefined) {
     if (input.nome.trim().length === 0) {
       throw AppError.badRequest('Nome não pode ser vazio');
     }

     if (input.nome.trim().length < 3) {
       throw AppError.badRequest('Nome deve ter pelo menos 3 caracteres');
     }

     if (input.nome.length > 100) {
       throw AppError.badRequest('Nome muito longo (máximo 100 caracteres)');
     }

     // Verificar se tem sobrenome
     const partes = input.nome.trim().split(' ').filter(p => p.length > 0);
     if (partes.length < 2) {
       throw AppError.badRequest('Informe nome completo (nome e sobrenome)');
     }
   }

   // Validar email se fornecido
   if (input.email !== undefined) {
     if (input.email.trim().length === 0) {
       throw AppError.badRequest('Email não pode ser vazio');
     }

     if (!Email.isValid(input.email)) {
       throw AppError.badRequest('Email inválido');
     }
   }

   // Validar senha se fornecida
   if (input.senha !== undefined) {
     if (input.senha.length < 6) {
       throw AppError.badRequest('Senha deve ter pelo menos 6 caracteres');
     }

     if (input.senha.length > 128) {
       throw AppError.badRequest('Senha muito longa (máximo 128 caracteres)');
     }
   }

   // Validar data de nascimento se fornecida
   if (input.dataNascimento !== undefined) {
     this.validateBirthDate(input.dataNascimento);
   }
 }

 /**
  * Valida data de nascimento
  */
 private validateBirthDate(dataNascimento: string): void {
   const birthDate = new Date(dataNascimento);
   const today = new Date();

   if (isNaN(birthDate.getTime())) {
     throw AppError.badRequest('Data de nascimento inválida');
   }

   if (birthDate > today) {
     throw AppError.badRequest('Data de nascimento não pode ser no futuro');
   }

   // Calcular idade
   let age = today.getFullYear() - birthDate.getFullYear();
   const monthDiff = today.getMonth() - birthDate.getMonth();
   
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
     age--;
   }

   if (age < 13) {
     throw AppError.badRequest('Idade mínima é 13 anos');
   }

   if (age > 120) {
     throw AppError.badRequest('Data de nascimento inválida');
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

   // Normalizar nome
   if (input.nome) {
     normalized.nome = input.nome.trim();
   }

   // Normalizar e validar email
   if (input.email) {
     const emailVO = Email.create(input.email);
     const emailNormalizado = emailVO.getValue();

     // Verificar se email mudou
     if (emailNormalizado !== existingUser.email) {
       // Verificar se novo email já existe
       const userWithEmail = await this.userRepository.findByEmail(emailNormalizado);
       
       if (userWithEmail && userWithEmail.id !== id) {
         throw AppError.conflict('Email já está em uso por outro usuário');
       }
     }

     normalized.email = emailNormalizado;
   }

   // Validar senha se fornecida
   if (input.senha) {
     const passwordVO = Password.create(input.senha, true);
     
     if (passwordVO.isCommon) {
       throw AppError.badRequest('Senha muito comum. Escolha uma senha mais segura.');
     }

     normalized.senha = input.senha;
   }

   // Data de nascimento
   if (input.dataNascimento) {
     normalized.dataNascimento = input.dataNascimento;
   }

   return normalized;
 }
}