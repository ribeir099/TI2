import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';

/**
* DTO para entrada de criação de usuário
*/
export interface CreateUserInputDTO {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
}

/**
* DTO para entrada de atualização de usuário
*/
export interface UpdateUserInputDTO {
    nome?: string;
    email?: string;
    senha?: string;
    dataNascimento?: string;
}

/**
* DTO para entrada de login
*/
export interface LoginInputDTO {
    email: string;
    senha: string;
}

/**
* DTO para saída de usuário (sem senha)
*/
export interface UserOutputDTO {
    id: string;
    nome: string;
    email: string;
    dataNascimento: string;
    dataCriacao?: string;
    primeiroNome: string;
    iniciais: string;
    idade: number;
    emailMascarado: string;
}

/**
* DTO resumido de usuário (para listagens)
*/
export interface UserSummaryDTO {
    id: string;
    nome: string;
    email: string;
    iniciais: string;
}

/**
* DTO para resposta de login
*/
export interface LoginResponseDTO {
    user: UserOutputDTO;
    token?: string;
    expiresIn?: number;
}

/**
* DTO para perfil do usuário
*/
export interface UserProfileDTO {
    id: string;
    nome: string;
    primeiroNome: string;
    sobrenome: string;
    email: string;
    emailMascarado: string;
    dataNascimento: string;
    dataNascimentoFormatada: string;
    idade: number;
    isMaiorDeIdade: boolean;
    iniciais: string;
    dataCriacao?: string;
}

/**
* DTO para filtros de busca de usuários
*/
export interface UserFiltersDTO {
    nome?: string;
    email?: string;
    idadeMinima?: number;
    idadeMaxima?: number;
    dataNascimentoInicio?: string;
    dataNascimentoFim?: string;
}

/**
* Mapper/Transformer para User
*/
export class UserDTOMapper {
    /**
     * Converte User Entity para UserOutputDTO
     */
    static toOutputDTO(user: User): UserOutputDTO {
        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            dataNascimento: user.dataNascimento,
            dataCriacao: user.dataCriacao,
            primeiroNome: user.primeiroNome,
            iniciais: user.iniciais,
            idade: user.idade,
            emailMascarado: user.emailMascarado
        };
    }

    /**
     * Converte User Entity para UserSummaryDTO
     */
    static toSummaryDTO(user: User): UserSummaryDTO {
        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            iniciais: user.iniciais
        };
    }

    /**
     * Converte User Entity para UserProfileDTO
     */
    static toProfileDTO(user: User): UserProfileDTO {
        return {
            id: user.id,
            nome: user.nome,
            primeiroNome: user.primeiroNome,
            sobrenome: user.sobrenome,
            email: user.email,
            emailMascarado: user.emailMascarado,
            dataNascimento: user.dataNascimento,
            dataNascimentoFormatada: user.dataNascimentoFormatada,
            idade: user.idade,
            isMaiorDeIdade: user.isMaiorDeIdade,
            iniciais: user.iniciais,
            dataCriacao: user.dataCriacao
        };
    }

    /**
     * Converte array de Users para array de UserOutputDTO
     */
    static toOutputDTOList(users: User[]): UserOutputDTO[] {
        return users.map(user => UserDTOMapper.toOutputDTO(user));
    }

    /**
     * Converte array de Users para array de UserSummaryDTO
     */
    static toSummaryDTOList(users: User[]): UserSummaryDTO[] {
        return users.map(user => UserDTOMapper.toSummaryDTO(user));
    }

    /**
     * Valida CreateUserInputDTO
     */
    static validateCreateInput(dto: CreateUserInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.nome || dto.nome.trim().length < 3) {
            errors.push('Nome deve ter pelo menos 3 caracteres');
        }

        if (!dto.email || !Email.isValid(dto.email)) {
            errors.push('Email inválido');
        }

        if (!dto.senha || dto.senha.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        if (!dto.dataNascimento) {
            errors.push('Data de nascimento é obrigatória');
        } else {
            const dataNasc = new Date(dto.dataNascimento);
            const hoje = new Date();
            if (dataNasc > hoje) {
                errors.push('Data de nascimento não pode ser no futuro');
            }
        }

        return errors;
    }

    /**
     * Valida UpdateUserInputDTO
     */
    static validateUpdateInput(dto: UpdateUserInputDTO): string[] {
        const errors: string[] = [];

        if (dto.nome !== undefined && dto.nome.trim().length < 3) {
            errors.push('Nome deve ter pelo menos 3 caracteres');
        }

        if (dto.email !== undefined && !Email.isValid(dto.email)) {
            errors.push('Email inválido');
        }

        if (dto.senha !== undefined && dto.senha.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        if (dto.dataNascimento !== undefined) {
            const dataNasc = new Date(dto.dataNascimento);
            const hoje = new Date();
            if (dataNasc > hoje) {
                errors.push('Data de nascimento não pode ser no futuro');
            }
        }

        return errors;
    }

    /**
     * Valida LoginInputDTO
     */
    static validateLoginInput(dto: LoginInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.email || !Email.isValid(dto.email)) {
            errors.push('Email inválido');
        }

        if (!dto.senha || dto.senha.length === 0) {
            errors.push('Senha é obrigatória');
        }

        return errors;
    }
}
