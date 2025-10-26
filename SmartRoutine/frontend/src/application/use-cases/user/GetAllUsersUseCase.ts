import { IUserRepository, UserFilters } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de paginação
*/
export interface PaginationOptions {
 page: number;
 limit: number;
}

/**
* Resultado paginado
*/
export interface PaginatedUsers {
 users: User[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
 hasNext: boolean;
 hasPrevious: boolean;
}

/**
* Use Case: Obter Todos os Usuários
* 
* Responsabilidade:
* - Listar usuários do sistema
* - Aplicar filtros
* - Paginar resultados
* - Ordenar listagem
*/
export class GetAllUsersUseCase {
 constructor(private readonly userRepository: IUserRepository) {}

 /**
  * Lista todos os usuários
  * 
  * @returns Promise<User[]> - Lista de usuários
  */
 async execute(): Promise<User[]> {
   try {
     return await this.userRepository.findAll();
   } catch (error) {
     console.error('Erro no GetAllUsersUseCase:', error);
     throw AppError.internal('Erro ao listar usuários');
   }
 }

 /**
  * Lista usuários com paginação
  * 
  * @param options - Opções de paginação
  * @returns Promise<PaginatedUsers> - Resultado paginado
  */
 async executeWithPagination(options: PaginationOptions): Promise<PaginatedUsers> {
   try {
     // Validar opções
     this.validatePaginationOptions(options);

     // Buscar todos os usuários
     const allUsers = await this.userRepository.findAll();

     // Calcular paginação
     const total = allUsers.length;
     const totalPages = Math.ceil(total / options.limit);
     const startIndex = (options.page - 1) * options.limit;
     const endIndex = startIndex + options.limit;

     // Paginar
     const users = allUsers.slice(startIndex, endIndex);

     return {
       users,
       total,
       page: options.page,
       limit: options.limit,
       totalPages,
       hasNext: options.page < totalPages,
       hasPrevious: options.page > 1
     };
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao listar usuários paginados');
   }
 }

 /**
  * Lista usuários com filtros
  * 
  * @param filters - Filtros a aplicar
  * @returns Promise<User[]> - Usuários filtrados
  */
 async executeWithFilters(filters: UserFilters): Promise<User[]> {
   try {
     return await this.userRepository.findByFilters(filters);
   } catch (error) {
     throw AppError.internal('Erro ao listar usuários com filtros');
   }
 }

 /**
  * Lista usuários por idade mínima
  * 
  * @param idadeMinima - Idade mínima
  * @returns Promise<User[]> - Usuários maiores que idade mínima
  */
 async executeByMinimumAge(idadeMinima: number): Promise<User[]> {
   try {
     if (idadeMinima < 0) {
       throw AppError.badRequest('Idade mínima não pode ser negativa');
     }

     if (idadeMinima > 150) {
       throw AppError.badRequest('Idade mínima inválida');
     }

     return await this.userRepository.findByMinimumAge(idadeMinima);
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao buscar usuários por idade');
   }
 }

 /**
  * Conta total de usuários
  * 
  * @returns Promise<number> - Total de usuários
  */
 async count(): Promise<number> {
   try {
     return await this.userRepository.count();
   } catch (error) {
     return 0;
   }
 }

 /**
  * Lista usuários ativos (com atividade recente)
  * Nota: Requer campo de última atividade no banco
  */
 async executeActiveUsers(diasInatividade: number = 30): Promise<User[]> {
   try {
     // TODO: Implementar quando houver campo de última atividade
     // Por enquanto, retorna todos
     return await this.execute();
   } catch (error) {
     return [];
   }
 }

 /**
  * Busca usuários por nome
  */
 async executeByName(nome: string): Promise<User[]> {
   try {
     if (!nome || nome.trim().length < 2) {
       return [];
     }

     return await this.userRepository.findByFilters({ nome: nome.trim() });
   } catch (error) {
     return [];
   }
 }

 /**
  * Ordena usuários
  */
 sortUsers(
   users: User[],
   campo: 'nome' | 'email' | 'idade' | 'dataNascimento',
   ordem: 'asc' | 'desc' = 'asc'
 ): User[] {
   return [...users].sort((a, b) => {
     let comparison = 0;

     switch (campo) {
       case 'nome':
         comparison = a.nome.localeCompare(b.nome);
         break;
       case 'email':
         comparison = a.email.localeCompare(b.email);
         break;
       case 'idade':
         comparison = a.idade - b.idade;
         break;
       case 'dataNascimento':
         comparison = new Date(a.dataNascimento).getTime() - new Date(b.dataNascimento).getTime();
         break;
     }

     return ordem === 'asc' ? comparison : -comparison;
   });
 }

 /**
  * Valida opções de paginação
  */
 private validatePaginationOptions(options: PaginationOptions): void {
   if (!options) {
     throw AppError.badRequest('Opções de paginação são obrigatórias');
   }

   if (options.page < 1) {
     throw AppError.badRequest('Página deve ser maior ou igual a 1');
   }

   if (options.limit < 1) {
     throw AppError.badRequest('Limite deve ser maior ou igual a 1');
   }

   if (options.limit > 100) {
     throw AppError.badRequest('Limite máximo é 100');
   }
 }
}