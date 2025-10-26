import { TokenStorage } from '@/infrastructure/storage/TokenStorage';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Logout de Usuário
* 
* Responsabilidade:
* - Encerrar sessão do usuário
* - Limpar tokens e dados de sessão
* - Invalidar tokens (em produção, adicionar à blacklist)
*/
export class LogoutUseCase {
    constructor(private readonly tokenStorage: TokenStorage) { }

    /**
     * Executa o caso de uso de logout
     * 
     * @param userId - ID do usuário (opcional, para blacklist)
     * @returns Promise<void>
     */
    async execute(userId?: string): Promise<void> {
        try {
            // Em produção, adicionar tokens à blacklist no backend
            if (userId) {
                await this.invalidateUserTokens(userId);
            }

            // Limpar storage local
            this.tokenStorage.clearAll();
        } catch (error) {
            // Log do erro mas não falha o logout
            console.error('Erro no LogoutUseCase:', error);

            // Mesmo com erro, limpar dados locais
            this.tokenStorage.clearAll();
        }
    }

    /**
     * Executa logout síncrono (sem invalidação no backend)
     */
    executeSync(): void {
        try {
            this.tokenStorage.clearAll();
        } catch (error) {
            console.error('Erro no logout síncrono:', error);
            // Força limpeza mesmo com erro
            this.tokenStorage.clearAll();
        }
    }

    /**
     * Invalida tokens do usuário no backend (implementar em produção)
     */
    private async invalidateUserTokens(userId: string): Promise<void> {
        // TODO: Implementar chamada para backend adicionar tokens à blacklist
        // Exemplo:
        // await apiClient.post('/auth/invalidate-tokens', { userId });

        // Por enquanto, apenas log
        console.log(`Invalidando tokens do usuário ${userId}`);
    }

    /**
     * Verifica se há sessão ativa antes de fazer logout
     */
    hasActiveSession(): boolean {
        return this.tokenStorage.hasActiveSession();
    }
}