import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { AppError } from '@/shared/errors/AppError';
import { CreateUserInputDTO } from '@/application/dto/UserDTO';

/**
* Use Case: Cadastro de Usuário
* 
* Responsabilidade:
* - Criar novo usuário no sistema
* - Validar dados de cadastro
* - Verificar duplicidade de email
* - Garantir segurança da senha
*/
export class SignupUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Executa o caso de uso de cadastro
     * 
     * @param input - Dados do novo usuário
     * @returns Promise<User> - Usuário criado
     * @throws AppError - Se dados inválidos ou email já existe
     */
    async execute(input: CreateUserInputDTO): Promise<User> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Validar e normalizar email
            const emailVO = Email.create(input.email);

            // Validar senha
            const passwordVO = Password.create(input.senha, true);

            // Validar data de nascimento
            this.validateBirthDate(input.dataNascimento);

            // Verificar se email já existe
            const existingUser = await this.userRepository.findByEmail(emailVO.getValue());

            if (existingUser) {
                throw AppError.conflict('Email já cadastrado. Tente fazer login ou use outro email.');
            }

            // Criar usuário
            const user = await this.userRepository.create({
                nome: input.nome.trim(),
                email: emailVO.getValue(),
                senha: input.senha, // Em produção, hash seria feito aqui ou no repository
                dataNascimento: input.dataNascimento
            });

            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            // Log do erro original
            console.error('Erro no SignupUseCase:', error);

            throw AppError.internal('Erro ao criar conta. Tente novamente.');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: CreateUserInputDTO): void {
        if (!input) {
            throw AppError.badRequest('Dados de cadastro são obrigatórios');
        }

        // Validar nome
        if (!input.nome || input.nome.trim().length === 0) {
            throw AppError.badRequest('Nome é obrigatório');
        }

        if (input.nome.trim().length < 3) {
            throw AppError.badRequest('Nome deve ter pelo menos 3 caracteres');
        }

        if (input.nome.trim().length > 100) {
            throw AppError.badRequest('Nome muito longo (máximo 100 caracteres)');
        }

        // Validar se nome tem pelo menos um sobrenome
        const partesNome = input.nome.trim().split(' ').filter(p => p.length > 0);
        if (partesNome.length < 2) {
            throw AppError.badRequest('Informe nome completo (nome e sobrenome)');
        }

        // Validar email
        if (!input.email || input.email.trim().length === 0) {
            throw AppError.badRequest('Email é obrigatório');
        }

        // Validar senha
        if (!input.senha || input.senha.length === 0) {
            throw AppError.badRequest('Senha é obrigatória');
        }

        // Validar data de nascimento
        if (!input.dataNascimento) {
            throw AppError.badRequest('Data de nascimento é obrigatória');
        }
    }

    /**
     * Valida data de nascimento
     */
    private validateBirthDate(dataNascimento: string): void {
        const birthDate = new Date(dataNascimento);
        const today = new Date();

        // Verificar se data é válida
        if (isNaN(birthDate.getTime())) {
            throw AppError.badRequest('Data de nascimento inválida');
        }

        // Não pode ser no futuro
        if (birthDate > today) {
            throw AppError.badRequest('Data de nascimento não pode ser no futuro');
        }

        // Calcular idade
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Verificar idade mínima (13 anos - COPPA compliance)
        if (age < 13) {
            throw AppError.badRequest('Você deve ter pelo menos 13 anos para se cadastrar');
        }

        // Verificar idade máxima razoável (120 anos)
        if (age > 120) {
            throw AppError.badRequest('Data de nascimento inválida');
        }
    }

    /**
     * Verifica disponibilidade de email
     */
    async isEmailAvailable(email: string): Promise<boolean> {
        try {
            const emailVO = Email.create(email);
            return !(await this.userRepository.existsByEmail(emailVO.getValue()));
        } catch (error) {
            return false;
        }
    }

    /**
     * Valida força da senha antes de criar conta
     */
    validatePasswordStrength(password: string): {
        isStrong: boolean;
        strength: number;
        strengthLabel: string;
        suggestions: string[];
    } {
        try {
            const passwordVO = Password.create(password, false);

            return {
                isStrong: passwordVO.isStrong,
                strength: passwordVO.strength,
                strengthLabel: passwordVO.strengthLabel,
                suggestions: passwordVO.suggestions
            };
        } catch (error) {
            return {
                isStrong: false,
                strength: 0,
                strengthLabel: 'Inválida',
                suggestions: [error instanceof Error ? error.message : 'Senha inválida']
            };
        }
    }

    /**
     * Verifica se senha é comum/fraca
     */
    isCommonPassword(password: string): boolean {
        return Password.isCommonPassword(password);
    }
}
