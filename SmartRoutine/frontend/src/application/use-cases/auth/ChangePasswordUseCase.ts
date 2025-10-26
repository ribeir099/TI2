import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Password } from '@/domain/value-objects/Password';
import { AppError } from '@/shared/errors/AppError';

/**
* Input para alteração de senha
*/
export interface ChangePasswordInput {
    userId: string;
    senhaAtual: string;
    novaSenha: string;
    confirmacaoNovaSenha: string;
}

/**
* Use Case: Alterar Senha
* 
* Responsabilidade:
* - Alterar senha do usuário
* - Validar senha atual
* - Validar nova senha
* - Garantir segurança
*/
export class ChangePasswordUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Executa alteração de senha
     * 
     * @param input - Dados para alteração de senha
     * @returns Promise<void>
     * @throws AppError - Se validações falharem
     */
    async execute(input: ChangePasswordInput): Promise<void> {
        try {
            // Validar entrada
            this.validateInput(input);

            // Buscar usuário
            const user = await this.userRepository.findById(input.userId);

            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // TODO: Verificar senha atual (depende de como está implementado no backend)
            // Por enquanto, assumir que o backend faz essa validação

            // Validar nova senha
            const newPasswordVO = Password.create(input.novaSenha, true);

            // Verificar se nova senha é diferente da atual
            if (input.senhaAtual === input.novaSenha) {
                throw AppError.badRequest('Nova senha deve ser diferente da senha atual');
            }

            // Verificar se nova senha não é comum
            if (newPasswordVO.isCommon) {
                throw AppError.badRequest('Senha muito comum. Escolha uma senha mais segura.');
            }

            // Atualizar senha
            await this.userRepository.update(input.userId, {
                senha: input.novaSenha
            });

            // TODO: Em produção, invalidar todos os tokens do usuário
            // await this.invalidateAllUserTokens(input.userId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ChangePasswordUseCase:', error);
            throw AppError.internal('Erro ao alterar senha');
        }
    }

    /**
     * Valida dados de entrada
     */
    private validateInput(input: ChangePasswordInput): void {
        if (!input) {
            throw AppError.badRequest('Dados de alteração de senha são obrigatórios');
        }

        if (!input.userId || input.userId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!input.senhaAtual || input.senhaAtual.length === 0) {
            throw AppError.badRequest('Senha atual é obrigatória');
        }

        if (!input.novaSenha || input.novaSenha.length === 0) {
            throw AppError.badRequest('Nova senha é obrigatória');
        }

        if (!input.confirmacaoNovaSenha || input.confirmacaoNovaSenha.length === 0) {
            throw AppError.badRequest('Confirmação de senha é obrigatória');
        }

        // Verificar se senhas coincidem
        if (input.novaSenha !== input.confirmacaoNovaSenha) {
            throw AppError.badRequest('Nova senha e confirmação não coincidem');
        }

        // Validar comprimento mínimo
        if (input.novaSenha.length < 6) {
            throw AppError.badRequest('Nova senha deve ter pelo menos 6 caracteres');
        }

        // Validar comprimento máximo
        if (input.novaSenha.length > 128) {
            throw AppError.badRequest('Nova senha muito longa (máximo 128 caracteres)');
        }
    }

    /**
     * Valida força da nova senha
     */
    validateNewPasswordStrength(novaSenha: string): {
        isStrong: boolean;
        strength: number;
        suggestions: string[];
    } {
        try {
            const passwordVO = Password.create(novaSenha, false);

            return {
                isStrong: passwordVO.isStrong,
                strength: passwordVO.strength,
                suggestions: passwordVO.suggestions
            };
        } catch (error) {
            return {
                isStrong: false,
                strength: 0,
                suggestions: [error instanceof Error ? error.message : 'Senha inválida']
            };
        }
    }
}