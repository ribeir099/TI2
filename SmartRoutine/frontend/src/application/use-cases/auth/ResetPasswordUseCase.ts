import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Password } from '@/domain/value-objects/Password';
import { ValidateTokenUseCase } from './ValidateTokenUseCase';
import { AppError } from '@/shared/errors/AppError';

/**
* Input para reset de senha
*/
export interface ResetPasswordInput {
    token: string;
    novaSenha: string;
    confirmacaoNovaSenha: string;
}

/**
* Use Case: Resetar Senha
* 
* Responsabilidade:
* - Validar token de reset
* - Resetar senha do usuário
* - Invalidar token de reset usado
*/
export class ResetPasswordUseCase {
    private validateTokenUseCase: ValidateTokenUseCase;

    constructor(private readonly userRepository: IUserRepository) {
        this.validateTokenUseCase = new ValidateTokenUseCase(userRepository);
    }

    /**
     * Executa reset de senha
     * 
     * @param input - Token e nova senha
     * @returns Promise<void>
     * @throws AppError - Se token inválido ou senha fraca
     */
    async execute(input: ResetPasswordInput): Promise<void> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Validar token de reset
            const tokenInfo = this.validateTokenUseCase.getTokenInfo(input.token);

            if (!tokenInfo.userId) {
                throw AppError.unauthorized('Token de reset inválido');
            }

            // Verificar se token é do tipo temporário
            if (tokenInfo.type !== 'temporary') {
                throw AppError.unauthorized('Token inválido para reset de senha');
            }

            // Buscar usuário
            const user = await this.userRepository.findById(tokenInfo.userId);

            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Validar nova senha
            const newPasswordVO = Password.create(input.novaSenha, true);

            // Verificar se senha não é comum
            if (newPasswordVO.isCommon) {
                throw AppError.badRequest('Senha muito comum. Escolha uma senha mais segura.');
            }

            // Atualizar senha
            await this.userRepository.update(tokenInfo.userId, {
                senha: input.novaSenha
            });

            // TODO: Invalidar token de reset usado
            // await this.invalidateResetToken(input.token);

            // TODO: Invalidar todos os outros tokens do usuário (por segurança)
            // await this.invalidateAllUserTokens(tokenInfo.userId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ResetPasswordUseCase:', error);
            throw AppError.internal('Erro ao resetar senha');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: ResetPasswordInput): void {
        if (!input) {
            throw AppError.badRequest('Dados de reset são obrigatórios');
        }

        if (!input.token || input.token.trim().length === 0) {
            throw AppError.badRequest('Token de reset é obrigatório');
        }

        if (!input.novaSenha || input.novaSenha.length === 0) {
            throw AppError.badRequest('Nova senha é obrigatória');
        }

        if (!input.confirmacaoNovaSenha || input.confirmacaoNovaSenha.length === 0) {
            throw AppError.badRequest('Confirmação de senha é obrigatória');
        }

        // Verificar se senhas coincidem
        if (input.novaSenha !== input.confirmacaoNovaSenha) {
            throw AppError.badRequest('Senha e confirmação não coincidem');
        }

        // Validar comprimento
        if (input.novaSenha.length < 6) {
            throw AppError.badRequest('Senha deve ter pelo menos 6 caracteres');
        }

        if (input.novaSenha.length > 128) {
            throw AppError.badRequest('Senha muito longa (máximo 128 caracteres)');
        }
    }
}