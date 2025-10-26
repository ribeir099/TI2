import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { AppError } from '@/shared/errors/AppError';
import { LoginInputDTO } from '@/application/dto/UserDTO';

/**
* Use Case: Login de Usuário
* 
* Responsabilidade:
* - Autenticar usuário com email e senha
* - Validar credenciais
* - Retornar usuário autenticado
* 
* Princípios SOLID:
* - SRP: Única responsabilidade (login)
* - DIP: Depende de abstração (IUserRepository)
*/
export class LoginUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Executa o caso de uso de login
     * 
     * @param input - Email e senha do usuário
     * @returns Promise<User> - Usuário autenticado
     * @throws AppError - Se credenciais inválidas
     */
    async execute(input: LoginInputDTO): Promise<User> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Validar e normalizar email
            const emailVO = Email.create(input.email);

            // Validar senha
            this.validatePassword(input.senha);

            // Tentar autenticar
            const user = await this.userRepository.login(
                emailVO.getValue(),
                input.senha
            );

            if (!user) {
                throw AppError.unauthorized('Email ou senha inválidos');
            }

            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            // Log do erro original (em produção, usar logger apropriado)
            console.error('Erro no LoginUseCase:', error);

            throw AppError.internal('Erro ao realizar login. Tente novamente.');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: LoginInputDTO): void {
        if (!input) {
            throw AppError.badRequest('Dados de login são obrigatórios');
        }

        if (!input.email || input.email.trim().length === 0) {
            throw AppError.badRequest('Email é obrigatório');
        }

        if (!input.senha || input.senha.length === 0) {
            throw AppError.badRequest('Senha é obrigatória');
        }
    }

    /**
     * Valida senha
     */
    private validatePassword(senha: string): void {
        if (senha.length < 6) {
            throw AppError.badRequest('Senha deve ter pelo menos 6 caracteres');
        }

        if (senha.length > 128) {
            throw AppError.badRequest('Senha muito longa');
        }
    }

    /**
     * Verifica se email existe antes de tentar login
     * Útil para feedback ao usuário
     */
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const emailVO = Email.create(email);
            return await this.userRepository.existsByEmail(emailVO.getValue());
        } catch (error) {
            return false;
        }
    }
}