import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { TokenStorage } from '@/infrastructure/storage/TokenStorage';
import { ValidateTokenUseCase } from './ValidateTokenUseCase';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Verificar Sessão Ativa
* 
* Responsabilidade:
* - Verificar se há sessão ativa
* - Validar tokens da sessão
* - Recuperar usuário autenticado
*/
export class VerifySessionUseCase {
    private validateTokenUseCase: ValidateTokenUseCase;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenStorage: TokenStorage
    ) {
        this.validateTokenUseCase = new ValidateTokenUseCase(userRepository);
    }

    /**
     * Executa verificação de sessão
     * 
     * @returns Promise<User | null> - Usuário autenticado ou null
     */
    async execute(): Promise<User | null> {
        try {
            // Verificar se há token
            const token = this.tokenStorage.getToken();
            if (!token) {
                return null;
            }

            // Validar token
            const decoded = await this.validateTokenUseCase.execute(token, true);

            if (!decoded.isValid || decoded.isExpired) {
                // Limpar sessão inválida
                this.tokenStorage.clearAll();
                return null;
            }

            // Buscar usuário
            const userId = decoded.payload.sub;
            const user = await this.userRepository.findById(userId);

            if (!user) {
                // Usuário não existe mais - limpar sessão
                this.tokenStorage.clearAll();
                return null;
            }

            return user;
        } catch (error) {
            // Em caso de erro, limpar sessão e retornar null
            this.tokenStorage.clearAll();
            return null;
        }
    }

    /**
     * Verifica sessão de forma rápida (sem consultar banco)
     */
    async quickCheck(): Promise<boolean> {
        try {
            const token = this.tokenStorage.getToken();
            if (!token) return false;

            return await this.validateTokenUseCase.quickValidate(token);
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém ID do usuário da sessão sem validação completa
     */
    getUserIdFromSession(): string | null {
        try {
            const token = this.tokenStorage.getToken();
            if (!token) return null;

            const info = this.validateTokenUseCase.getTokenInfo(token);
            return info.userId;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica se sessão está ativa e válida
     */
    async isSessionActive(): Promise<boolean> {
        const user = await this.execute();
        return user !== null;
    }

    /**
     * Obtém tempo de sessão restante em minutos
     */
    getSessionTimeRemaining(): number {
        try {
            const token = this.tokenStorage.getToken();
            if (!token) return 0;

            return this.validateTokenUseCase.getTimeRemaining(token);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Verifica se sessão está próxima de expirar
     */
    isSessionExpiringSoon(minutesThreshold: number = 5): boolean {
        const remaining = this.getSessionTimeRemaining();
        return remaining > 0 && remaining <= minutesThreshold;
    }
}