import {
    IUserRepository,
    CreateUserData,
    UpdateUserData,
    UserFilters
} from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Implementação do Repositório de Usuários
* 
* Responsabilidades:
* - Comunicação com API de usuários
* - Conversão de DTOs para Entities
* - Tratamento de erros HTTP
*/
export class UserRepository implements IUserRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todos os usuários
     */
    async findAll(): Promise<User[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.USER.LIST);
            return data.map(dto => User.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar usuários');
        }
    }

    /**
     * Busca usuário por ID
     */
    async findById(id: string): Promise<User | null> {
        try {
            const data = await this.apiClient.get(ENDPOINTS.USER.BY_ID(id));
            return User.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar usuário por ID');
        }
    }

    /**
     * Busca usuário por email
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            // Se API tiver endpoint específico para email
            const data = await this.apiClient.get(ENDPOINTS.USER.BY_EMAIL(email));
            return User.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }

            // Fallback: buscar todos e filtrar
            try {
                const allUsers = await this.findAll();
                const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                return user || null;
            } catch (fallbackError) {
                return null;
            }
        }
    }

    /**
     * Busca usuários com filtros
     */
    async findByFilters(filters: UserFilters): Promise<User[]> {
        try {
            // Se API suportar filtros via query params
            const params = this.buildFilterParams(filters);
            const data = await this.apiClient.get<any[]>(ENDPOINTS.USER.BASE, { params });
            return data.map(dto => User.fromDTO(dto));
        } catch (error) {
            // Fallback: buscar todos e filtrar client-side
            try {
                const allUsers = await this.findAll();
                return this.filterUsersClientSide(allUsers, filters);
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar usuários com filtros');
            }
        }
    }

    /**
     * Cria novo usuário
     */
    async create(userData: CreateUserData): Promise<User> {
        try {
            const payload = {
                nome: userData.nome,
                email: userData.email,
                senha: userData.senha,
                dataNascimento: userData.dataNascimento
            };

            const data = await this.apiClient.post(ENDPOINTS.USER.CREATE, payload);

            // Se API retorna apenas mensagem, buscar o usuário criado
            if (data.message && !data.id) {
                // Buscar usuário recém criado por email
                const user = await this.findByEmail(userData.email);
                if (!user) {
                    throw new Error('Usuário criado mas não encontrado');
                }
                return user;
            }

            return User.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 409) {
                throw AppError.conflict('Email já cadastrado');
            }
            throw this.handleError(error, 'Erro ao criar usuário');
        }
    }

    /**
     * Atualiza usuário
     */
    async update(id: string, userData: UpdateUserData): Promise<User> {
        try {
            const payload = {
                ...(userData.nome && { nome: userData.nome }),
                ...(userData.email && { email: userData.email }),
                ...(userData.senha && { senha: userData.senha }),
                ...(userData.dataNascimento && { dataNascimento: userData.dataNascimento })
            };

            await this.apiClient.put(ENDPOINTS.USER.UPDATE(id), payload);

            // Buscar usuário atualizado
            const updatedUser = await this.findById(id);
            if (!updatedUser) {
                throw AppError.notFound('Usuário não encontrado após atualização');
            }

            return updatedUser;
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Usuário não encontrado');
            }
            if (error instanceof AppError && error.statusCode === 409) {
                throw AppError.conflict('Email já está em uso');
            }
            throw this.handleError(error, 'Erro ao atualizar usuário');
        }
    }

    /**
     * Deleta usuário
     */
    async delete(id: string): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.USER.DELETE(id));
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Usuário não encontrado');
            }
            throw this.handleError(error, 'Erro ao deletar usuário');
        }
    }

    /**
     * Verifica se email existe
     */
    async existsByEmail(email: string): Promise<boolean> {
        try {
            const user = await this.findByEmail(email);
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se usuário existe por ID
     */
    async existsById(id: string): Promise<boolean> {
        try {
            const user = await this.findById(id);
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Autentica usuário (login)
     */
    async login(email: string, senha: string): Promise<User> {
        try {
            const payload = { email, senha };
            const data = await this.apiClient.post(ENDPOINTS.AUTH.LOGIN, payload);
            return User.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 401) {
                throw AppError.unauthorized('Email ou senha inválidos');
            }
            throw this.handleError(error, 'Erro ao fazer login');
        }
    }

    /**
     * Conta total de usuários
     */
    async count(): Promise<number> {
        try {
            const users = await this.findAll();
            return users.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Busca usuários por idade mínima
     */
    async findByMinimumAge(idadeMinima: number): Promise<User[]> {
        try {
            const allUsers = await this.findAll();
            return allUsers.filter(user => user.idade >= idadeMinima);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar usuários por idade');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Constrói parâmetros de filtro
     */
    private buildFilterParams(filters: UserFilters): Record<string, any> {
        const params: Record<string, any> = {};

        if (filters.nome) params.nome = filters.nome;
        if (filters.email) params.email = filters.email;
        if (filters.dataNascimentoInicio) params.dataNascimentoInicio = filters.dataNascimentoInicio;
        if (filters.dataNascimentoFim) params.dataNascimentoFim = filters.dataNascimentoFim;

        return params;
    }

    /**
     * Filtra usuários no client-side
     */
    private filterUsersClientSide(users: User[], filters: UserFilters): User[] {
        return users.filter(user => {
            if (filters.nome && !user.nome.toLowerCase().includes(filters.nome.toLowerCase())) {
                return false;
            }

            if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
                return false;
            }

            if (filters.dataNascimentoInicio) {
                const inicio = new Date(filters.dataNascimentoInicio);
                const nascimento = new Date(user.dataNascimento);
                if (nascimento < inicio) return false;
            }

            if (filters.dataNascimentoFim) {
                const fim = new Date(filters.dataNascimentoFim);
                const nascimento = new Date(user.dataNascimento);
                if (nascimento > fim) return false;
            }

            return true;
        });
    }

    /**
     * Trata erros
     */
    private handleError(error: any, defaultMessage: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        console.error(defaultMessage, error);
        return AppError.internal(defaultMessage);
    }
}