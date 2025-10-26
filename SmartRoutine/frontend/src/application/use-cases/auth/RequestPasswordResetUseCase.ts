import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-objects/Email';
import { GenerateTokensUseCase } from './GenerateTokensUseCase';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Solicitar Reset de Senha
* 
* Responsabilidade:
* - Gerar token de reset de senha
* - Enviar email com link de reset (TODO: implementar email service)
*/
export class RequestPasswordResetUseCase {
    private generateTokensUseCase: GenerateTokensUseCase;

    constructor(private readonly userRepository: IUserRepository) {
        this.generateTokensUseCase = new GenerateTokensUseCase();
    }

    /**
     * Solicita reset de senha
     * 
     * @param email - Email do usuário
     * @returns Promise<{ token: string; expiresAt: Date }> - Token e expiração
     */
    async execute(email: string): Promise<{ token: string; expiresAt: Date }> {
        try {
            // Validar email
            const emailVO = Email.create(email);

            // Buscar usuário
            const user = await this.userRepository.findByEmail(emailVO.getValue());

            if (!user) {
                // Por segurança, não revelar se email existe ou não
                // Retornar sucesso mesmo se email não existir
                throw AppError.notFound('Se o email existir, você receberá instruções de reset');
            }

            // Gerar token temporário de reset (válido por 1 hora)
            const resetToken = this.generateTokensUseCase.generateTemporaryToken(
                user.id,
                'password-reset',
                '1h'
            );

            const expiresAt = this.generateTokensUseCase.calculateExpirationDate('1h');

            // TODO: Enviar email com link de reset
            // await emailService.sendPasswordResetEmail(user.email, resetToken);

            return {
                token: resetToken,
                expiresAt
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no RequestPasswordResetUseCase:', error);
            throw AppError.internal('Erro ao solicitar reset de senha');
        }
    }

    /**
     * Valida token de reset de senha
     */
    async validateResetToken(token: string): Promise<{ isValid: boolean; userId: string | null }> {
        try {
            // TODO: Implementar validação de token temporário
            // const decoded = await this.validateTokenUseCase.execute(token, false);

            return {
                isValid: false,
                userId: null
            };
        } catch (error) {
            return {
                isValid: false,
                userId: null
            };
        }
    }
}