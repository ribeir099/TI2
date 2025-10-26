import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Obter Usuário por Email
* 
* Responsabilidade:
* - Buscar usuário por email
* - Validar formato de email
* - Verificar existência
*/
export class GetUserByEmailUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Busca usuário por email
     * 
     * @param email - Email do usuário
     * @returns Promise<User> - Usuário encontrado
     * @throws AppError - Se usuário não existir
     */
    async execute(email: string): Promise<User> {
        try {
            // Validar email
            const emailVO = Email.create(email);

            // Buscar usuário
            const user = await this.userRepository.findByEmail(emailVO.getValue());

            if (!user) {
                throw AppError.notFound('Usuário não encontrado com este email');
            }

            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GetUserByEmailUseCase:', error);
            throw AppError.internal('Erro ao buscar usuário por email');
        }
    }

    /**
     * Busca usuário ou retorna null
     */
    async executeOrNull(email: string): Promise<User | null> {
        try {
            return await this.execute(email);
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se email existe no sistema
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const emailVO = Email.create(email);
            return await this.userRepository.existsByEmail(emailVO.getValue());
        } catch (error) {
            return false;
        }
    }

    /**
     * Busca ID do usuário por email
     */
    async getUserId(email: string): Promise<string | null> {
        try {
            const user = await this.execute(email);
            return user.id;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se email pertence a um usuário específico
     */
    async isEmailFromUser(email: string, userId: string): Promise<boolean> {
        try {
            const user = await this.executeOrNull(email);
            return user ? user.id === userId : false;
        } catch (error) {
            return false;
        }
    }
}