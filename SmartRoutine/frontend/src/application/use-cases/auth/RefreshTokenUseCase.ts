import jwt from 'jsonwebtoken';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { TokenStorage } from '@/infrastructure/storage/TokenStorage';
import { JWTPayload, TokenPair } from '@/application/dto/AuthDTO';
import { JWT_CONFIG, TokenType } from '@/shared/constants/jwt.config';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Renovar Access Token
* 
* Responsabilidade:
* - Validar refresh token
* - Gerar novo access token
* - Opcionalmente gerar novo refresh token (rotation)
*/
export class RefreshTokenUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenStorage: TokenStorage
    ) { }

    /**
     * Executa a renovação do access token
     * 
     * @param refreshToken - Refresh token válido
     * @param rotateRefreshToken - Se true, gera novo refresh token também
     * @returns Promise<TokenPair> - Novo par de tokens
     * @throws AppError - Se refresh token inválido
     */
    async execute(
        refreshToken?: string,
        rotateRefreshToken: boolean = false
    ): Promise<TokenPair> {
        try {
            // Obter refresh token (do parâmetro ou storage)
            const token = refreshToken || this.tokenStorage.getRefreshToken();

            if (!token) {
                throw AppError.unauthorized('Refresh token não encontrado');
            }

            // Verificar e decodificar refresh token
            const decoded = this.verifyRefreshToken(token);

            // Buscar usuário
            const userId = decoded.sub;
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw AppError.unauthorized('Usuário não encontrado');
            }

            // Gerar novo access token
            const newAccessToken = this.generateAccessToken(user);

            // Gerar novo refresh token se rotation estiver ativado
            const newRefreshToken = rotateRefreshToken
                ? this.generateRefreshToken(user)
                : token;

            // Calcular expiresIn
            const expiresIn = this.parseExpirationToSeconds(JWT_CONFIG.ACCESS_TOKEN_EXPIRATION);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof jwt.TokenExpiredError) {
                throw AppError.unauthorized('Refresh token expirado. Faça login novamente.');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw AppError.unauthorized('Refresh token inválido');
            }

            console.error('Erro no RefreshTokenUseCase:', error);
            throw AppError.internal('Erro ao renovar token');
        }
    }

    /**
     * Verifica e valida refresh token
     */
    private verifyRefreshToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
                issuer: JWT_CONFIG.ISSUER,
                audience: JWT_CONFIG.AUDIENCE,
                algorithms: [JWT_CONFIG.ALGORITHM]
            }) as JWTPayload;

            // Verificar se é refresh token
            if (decoded.type !== TokenType.REFRESH) {
                throw AppError.unauthorized('Token não é um refresh token');
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw AppError.unauthorized('Refresh token expirado');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw AppError.unauthorized('Refresh token inválido');
            }

            throw error;
        }
    }

    /**
     * Gera novo access token
     */
    private generateAccessToken(user: User): string {
        const payload: JWTPayload = {
            sub: user.id,
            email: user.email,
            nome: user.nome,
            type: TokenType.ACCESS
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, {
            expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRATION,
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
            algorithm: JWT_CONFIG.ALGORITHM
        });
    }

    /**
     * Gera novo refresh token
     */
    private generateRefreshToken(user: User): string {
        const payload: JWTPayload = {
            sub: user.id,
            email: user.email,
            nome: user.nome,
            type: TokenType.REFRESH
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, {
            expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRATION,
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
            algorithm: JWT_CONFIG.ALGORITHM
        });
    }

    /**
     * Converte string de expiração para segundos
     */
    private parseExpirationToSeconds(expiration: string): number {
        const regex = /^(\d+)([smhd])$/;
        const match = expiration.match(regex);

        if (!match) {
            return 24 * 60 * 60; // Default: 24 horas
        }

        const value = parseInt(match[1]);
        const unit = match[2];

        const multipliers: Record<string, number> = {
            s: 1,
            m: 60,
            h: 60 * 60,
            d: 24 * 60 * 60
        };

        return value * (multipliers[unit] || 1);
    }

    /**
     * Verifica se refresh token está próximo de expirar (menos de 1 dia)
     */
    isRefreshTokenExpiringSoon(token: string): boolean {
        try {
            const decoded = jwt.decode(token) as JWTPayload;
            if (!decoded.exp) return false;

            const now = Math.floor(Date.now() / 1000);
            const timeRemaining = decoded.exp - now;
            const oneDayInSeconds = 24 * 60 * 60;

            return timeRemaining <= oneDayInSeconds && timeRemaining > 0;
        } catch (error) {
            return false;
        }
    }
}