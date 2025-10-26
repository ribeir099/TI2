import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Usuário por ID
* 
* Responsabilidade:
* - Buscar usuário específico
* - Validar existência
* - Retornar dados completos
*/
export class GetUserByIdUseCase {
 constructor(private readonly userRepository: IUserRepository) {}

 /**
  * Busca usuário por ID
  * 
  * @param id - ID do usuário
  * @returns Promise<User> - Usuário encontrado
  * @throws AppError - Se usuário não existir
  */
 async execute(id: string): Promise<User> {
   try {
     // Validar ID
     if (!id || id.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     // Buscar usuário
     const user = await this.userRepository.findById(id);

     if (!user) {
       throw AppError.notFound('Usuário não encontrado');
     }

     return user;
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no GetUserByIdUseCase:', error);
     throw AppError.internal('Erro ao buscar usuário');
   }
 }

 /**
  * Busca usuário ou retorna null
  * 
  * @param id - ID do usuário
  * @returns Promise<User | null> - Usuário ou null
  */
 async executeOrNull(id: string): Promise<User | null> {
   try {
     return await this.execute(id);
   } catch (error) {
     return null;
   }
 }

 /**
  * Verifica se usuário existe
  * 
  * @param id - ID do usuário
  * @returns Promise<boolean> - true se existe
  */
 async exists(id: string): Promise<boolean> {
   try {
     if (!id || id.trim().length === 0) {
       return false;
     }

     return await this.userRepository.existsById(id);
   } catch (error) {
     return false;
   }
 }

 /**
  * Busca informações básicas do usuário
  */
 async executeBasicInfo(id: string): Promise<{
   id: string;
   nome: string;
   email: string;
   iniciais: string;
 } | null> {
   try {
     const user = await this.execute(id);

     return {
       id: user.id,
       nome: user.nome,
       email: user.email,
       iniciais: user.iniciais
     };
   } catch (error) {
     return null;
   }
 }

 /**
  * Verifica se usuário é maior de idade
  */
 async isAdult(id: string): Promise<boolean> {
   try {
     const user = await this.execute(id);
     return user.isMaiorDeIdade;
   } catch (error) {
     return false;
   }
 }
}