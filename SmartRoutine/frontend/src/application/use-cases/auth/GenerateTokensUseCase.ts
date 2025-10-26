import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/domain/entities/User';
import { JWTPayload, TokenPair } from '@/application/dto/AuthDTO';
import { JWT_CONFIG, TokenType } from '@/shared/constants/jwt.config';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Gerar Tokens JWT
* 
* Responsabilidade:
* - Gerar access token
* - Gerar refresh token
* - Gerar tokens temporários
* - Calcular expiração
*/
export class GenerateTokensUseCase {
    /**
     * Gera par completo de tokens (access + refresh)
     * 
     * @param user - Usuário para gerar tokens
     * @returns TokenPair - Par de tokens gerados
     */
    execute(user: User): TokenPair {
        try {
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            const expiresIn = this.parseExpirationToSeconds(JWT_CONFIG.ACCESS_TOKEN_EXPIRATION);

            return {
                accessToken,
                refreshToken,
                expiresIn
            };
        } catch (error) {
            console.error('Erro no GenerateTokensUseCase:', error);
            throw AppError.internal('Erro ao gerar tokens');
        }
    }

    /**
     * Gera apenas access token
     */
    generateAccessToken(user: User): string {
        const payload: JWTPayload = {
            sub: user.id,
            email: user.email,
            nome: user.nome,
            type: TokenType.ACCESS
        };

        const options: SignOptions = {
            expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRATION,
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
            algorithm: JWT_CONFIG.ALGORITHM
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, options);
    }

    /**
     * Gera apenas refresh token
     */
    generateRefreshToken(user: User): string {
        const payload: JWTPayload = {
            sub: user.id,
            email: user.email,
            nome: user.nome,
            type: TokenType.REFRESH
        };

        const options: SignOptions = {
            expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRATION,
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
            algorithm: JWT_CONFIG.ALGORITHM
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, options);
    }

    /**
     * Gera token temporário (para verificação de email, reset de senha, etc)
     */
    generateTemporaryToken(
        userId: string,
        purpose: 'email-verification' | 'password-reset' | 'account-activation',
        expiresIn: string = '1h'
    ): string {
        const payload = {
            sub: userId,
            type: 'temporary',
            purpose
        };

        const options: SignOptions = {
            expiresIn,
            issuer: JWT_CONFIG.ISSUER,
            algorithm: JWT_CONFIG.ALGORITHM
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, options);
    }

    /**
     * Gera token de API (para integrações)
     */
    generateApiToken(
        userId: string,
        scopes: string[],
        expiresIn: string = '30d'
    ): string {
        const payload = {
            sub: userId,
            type: 'api',
            scopes
        };

        const options: SignOptions = {
            expiresIn,
            issuer: JWT_CONFIG.ISSUER,
            algorithm: JWT_CONFIG.ALGORITHM
        };

        return jwt.sign(payload, JWT_CONFIG.SECRET, options);
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
     * Calcula data de expiração
     */
    calculateExpirationDate(expiresIn: string): Date {
        const seconds = this.parseExpirationToSeconds(expiresIn);
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + seconds);
        return expirationDate;
    }
}