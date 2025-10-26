/**
* Payload do JWT
*/
export interface JWTPayload {
 sub: string;           // Subject (user ID)
 email: string;         // Email do usuário
 nome: string;          // Nome do usuário
 type: 'access' | 'refresh';
 iat?: number;          // Issued at
 exp?: number;          // Expiration time
 iss?: string;          // Issuer
 aud?: string;          // Audience
}

/**
* Token decodificado
*/
export interface DecodedToken {
 payload: JWTPayload;
 isValid: boolean;
 isExpired: boolean;
 expiresAt: Date;
 issuedAt: Date;
}

/**
* Par de tokens
*/
export interface TokenPair {
 accessToken: string;
 refreshToken: string;
 expiresIn: number;
}