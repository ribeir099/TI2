import jwt from 'jsonwebtoken';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { JWTPayload, DecodedToken } from '@/application/dto/AuthDTO';
import { JWT_CONFIG } from '@/shared/constants/jwt.config';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Validar Token JWT
* 
* Responsabilidade:
* - Validar assinatura do token
* - Verificar expiração
* - Verificar integridade dos dados
* - Verificar se usuário ainda existe
*/
export class ValidateTokenUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Executa a validação completa do token
     * 
     * @param token - Token JWT a ser validado
     * @param checkUserExists - Se deve verificar se usuário existe no DB
     * @returns Promise<DecodedToken> - Token decodificado com informações
     * @throws AppError - Se token inválido
     */
    async execute(token: string, checkUserExists: boolean = true): Promise<DecodedToken> {
        try {
            if (!token || token.trim().length === 0) {
                throw AppError.unauthorized('Token não fornecido');
            }

            // Verificar e decodificar token
            const decodedToken = this.verifyAndDecodeToken(token);

            // Se token expirado
            if (decodedToken.isExpired) {
                throw AppError.unauthorized('Token expirado');
            }

            // Se token inválido
            if (!decodedToken.isValid) {
                throw AppError.unauthorized('Token inválido');
            }

            // Verificar se usuário ainda existe (opcional)
            if (checkUserExists) {
                const userId = decodedToken.payload.sub;
                const userExists = await this.userRepository.existsById(userId);

                if (!userExists) {
                    throw AppError.unauthorized('Usuário não encontrado');
                }
            }

            return decodedToken;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof jwt.TokenExpiredError) {
                throw AppError.unauthorized('Token expirado');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw AppError.unauthorized('Token inválido');
            }

            console.error('Erro no ValidateTokenUseCase:', error);
            throw AppError.internal('Erro ao validar token');
        }
    }

    /**
     * Valida token de forma rápida (sem consultar banco)
     */
    async quickValidate(token: string): Promise<boolean> {
        try {
            const decoded = this.verifyAndDecodeToken(token);
            return decoded.isValid && !decoded.isExpired;
        } catch (error) {
            return false;
        }
    }

    /**
     * Extrai usuário do token (sem validar no banco)
     */
    async extractUser(token: string): Promise<User | null> {
        try {
            const decoded = await this.execute(token, false);

            if (!decoded.isValid || decoded.isExpired) {
                return null;
            }

            // Buscar usuário completo
            const userId = decoded.payload.sub;
            return await this.userRepository.findById(userId);
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtém informações do token sem validar
     */
    getTokenInfo(token: string): {
        userId: string | null;
        email: string | null;
        nome: string | null;
        type: string | null;
        expiresAt: Date | null;
        issuedAt: Date | null;
    } {
        try {
            const decoded = jwt.decode(token) as JWTPayload;

            if (!decoded) {
                return {
                    userId: null,
                    email: null,
                    nome: null,
                    type: null,
                    expiresAt: null,
                    issuedAt: null
                };
            }

            return {
                userId: decoded.sub,
                email: decoded.email,
                nome: decoded.nome,
                type: decoded.type,
                expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
                issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null
            };
        } catch (error) {
            return {
                userId: null,
                email: null,
                nome: null,
                type: null,
                expiresAt: null,
                issuedAt: null
            };
        }
    }

    /**
     * Verifica se token pertence a um usuário específico
     */
    isTokenFromUser(token: string, userId: string): boolean {
        try {
            const info = this.getTokenInfo(token);
            return info.userId === userId;
        } catch (error) {
            return false;
        }
    }

    /**
     * Calcula tempo restante do token em minutos
     */
    getTimeRemaining(token: string): number {
        try {
            const info = this.getTokenInfo(token);
            if (!info.expiresAt) return 0;

            const now = new Date();
            const remaining = info.expiresAt.getTime() - now.getTime();

            return Math.max(0, Math.floor(remaining / (60 * 1000)));
        } catch (error) {
            return 0;
        }
    }

    /**
     * Verifica se token está próximo de expirar
     */
    isExpiringSoon(token: string, minutesThreshold: number = 5): boolean {
        const remaining = this.getTimeRemaining(token);
        return remaining > 0 && remaining <= minutesThreshold;
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Verifica assinatura e decodifica token
     */
    private verifyAndDecodeToken(token: string): DecodedToken {
        try {
            const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
                issuer: JWT_CONFIG.ISSUER,
                audience: JWT_CONFIG.AUDIENCE,
                algorithms: [JWT_CONFIG.ALGORITHM]
            }) as JWTPayload;

            const now = Math.floor(Date.now() / 1000);
            const isExpired = decoded.exp ? decoded.exp < now : false;
            const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date();
            const issuedAt = decoded.iat ? new Date(decoded.iat * 1000) : new Date();

            return {
                payload: decoded,
                isValid: true,
                isExpired,
                expiresAt,
                issuedAt
            };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                const decoded = jwt.decode(token) as JWTPayload;

                return {
                    payload: decoded,
                    isValid: false,
                    isExpired: true,
                    expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : new Date(),
                    issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : new Date()
                };
            }

            throw error;
        }
    }
}