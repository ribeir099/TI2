import { User } from '../entities/User';

/**
* DTO para criação de usuário
*/
export interface CreateUserData {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
}

/**
* DTO para atualização de usuário
*/
export interface UpdateUserData {
    nome?: string;
    email?: string;
    senha?: string;
    dataNascimento?: string;
}

/**
* DTO para filtros de busca de usuários
*/
export interface UserFilters {
    nome?: string;
    email?: string;
    dataNascimentoInicio?: string;
    dataNascimentoFim?: string;
}

/**
* Interface do Repositório de Usuários
* 
* Define o contrato para operações de persistência de usuários
* A implementação concreta ficará na camada de infraestrutura
* 
* Princípios SOLID:
* - D (Dependency Inversion): Dependemos de abstração, não de implementação
* - I (Interface Segregation): Interface focada em operações de User
*/
export interface IUserRepository {
    /**
     * Lista todos os usuários do sistema
     * @returns Promise com array de usuários
     */
    findAll(): Promise<User[]>;

    /**
     * Busca um usuário por ID
     * @param id - ID do usuário
     * @returns Promise com usuário encontrado ou null
     */
    findById(id: string): Promise<User | null>;

    /**
     * Busca um usuário por email
     * @param email - Email do usuário
     * @returns Promise com usuário encontrado ou null
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Busca usuários com filtros
     * @param filters - Filtros de busca
     * @returns Promise com array de usuários que atendem os filtros
     */
    findByFilters(filters: UserFilters): Promise<User[]>;

    /**
     * Cria um novo usuário
     * @param userData - Dados do usuário a ser criado
     * @returns Promise com usuário criado
     * @throws Error se email já existir
     */
    create(userData: CreateUserData): Promise<User>;

    /**
     * Atualiza um usuário existente
     * @param id - ID do usuário
     * @param userData - Dados a serem atualizados
     * @returns Promise com usuário atualizado
     * @throws Error se usuário não existir
     */
    update(id: string, userData: UpdateUserData): Promise<User>;

    /**
     * Deleta um usuário
     * @param id - ID do usuário
     * @returns Promise<void>
     * @throws Error se usuário não existir
     */
    delete(id: string): Promise<void>;

    /**
     * Verifica se um email já está cadastrado
     * @param email - Email a ser verificado
     * @returns Promise<boolean> - true se email existe
     */
    existsByEmail(email: string): Promise<boolean>;

    /**
     * Verifica se um usuário existe por ID
     * @param id - ID do usuário
     * @returns Promise<boolean> - true se usuário existe
     */
    existsById(id: string): Promise<boolean>;

    /**
     * Autentica um usuário (login)
     * @param email - Email do usuário
     * @param senha - Senha do usuário
     * @returns Promise com usuário autenticado
     * @throws Error se credenciais inválidas
     */
    login(email: string, senha: string): Promise<User>;

    /**
     * Conta total de usuários no sistema
     * @returns Promise<number> - Total de usuários
     */
    count(): Promise<number>;

    /**
     * Busca usuários por idade mínima
     * @param idadeMinima - Idade mínima
     * @returns Promise com array de usuários
     */
    findByMinimumAge(idadeMinima: number): Promise<User[]>;
}