import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import {
  LoginInputDTO,
  LoginResponseDTO,
  UserOutputDTO,
  UserDTOMapper
} from '@/application/dto/UserDTO';
import { JWTPayload, DecodedToken, TokenPair } from '@/application/dto/AuthDTO';
import { TokenStorage } from '@/infrastructure/storage/TokenStorage';
import { AppError } from '@/shared/errors/AppError';
import { Email } from '@/domain/value-objects/Email';

// Use Cases
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { SignupUseCase } from '@/application/use-cases/auth/SignupUseCase';
import { LogoutUseCase } from '@/application/use-cases/auth/LogoutUseCase';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import { ValidateTokenUseCase } from '@/application/use-cases/auth/ValidateTokenUseCase';
import { VerifySessionUseCase } from '@/application/use-cases/auth/VerifySessionUseCase';
import { GenerateTokensUseCase } from '@/application/use-cases/auth/GenerateTokensUseCase';
import { ChangePasswordUseCase, ChangePasswordInput } from '@/application/use-cases/auth/ChangePasswordUseCase';

/**
* Serviço de Autenticação (com JWT)
* 
* Orquestra os Use Cases de autenticação
*/
export class AuthService {
  // Use Cases
  private loginUseCase: LoginUseCase;
  private signupUseCase: SignupUseCase;
  private logoutUseCase: LogoutUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;
  private validateTokenUseCase: ValidateTokenUseCase;
  private verifySessionUseCase: VerifySessionUseCase;
  private generateTokensUseCase: GenerateTokensUseCase;
  private changePasswordUseCase: ChangePasswordUseCase;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenStorage: TokenStorage
  ) {
    // Inicializar Use Cases
    this.loginUseCase = new LoginUseCase(userRepository);
    this.signupUseCase = new SignupUseCase(userRepository);
    this.logoutUseCase = new LogoutUseCase(tokenStorage);
    this.refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenStorage);
    this.validateTokenUseCase = new ValidateTokenUseCase(userRepository);
    this.verifySessionUseCase = new VerifySessionUseCase(userRepository, tokenStorage);
    this.generateTokensUseCase = new GenerateTokensUseCase();
    this.changePasswordUseCase = new ChangePasswordUseCase(userRepository);
  }

  /**
   * Realiza login e retorna tokens JWT
   */
  async login(input: LoginInputDTO): Promise<LoginResponseDTO> {
    try {
      // Executar use case de login
      const user = await this.loginUseCase.execute(input);

      // Gerar tokens
      const tokenPair = this.generateTokensUseCase.execute(user);

      // Salvar tokens
      this.tokenStorage.setToken(tokenPair.accessToken);
      this.tokenStorage.setRefreshToken(tokenPair.refreshToken);
      this.tokenStorage.setUser(user.toDTO());

      return {
        user: UserDTOMapper.toOutputDTO(user),
        token: tokenPair.accessToken,
        expiresIn: tokenPair.expiresIn
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao realizar login');
    }
  }

  /**
   * Realiza cadastro e retorna tokens JWT
   */
  async signup(input: any): Promise<LoginResponseDTO> {
    try {
      // Executar use case de signup
      const user = await this.signupUseCase.execute(input);

      // Gerar tokens
      const tokenPair = this.generateTokensUseCase.execute(user);

      // Salvar tokens
      this.tokenStorage.setToken(tokenPair.accessToken);
      this.tokenStorage.setRefreshToken(tokenPair.refreshToken);
      this.tokenStorage.setUser(user.toDTO());

      return {
        user: UserDTOMapper.toOutputDTO(user),
        token: tokenPair.accessToken,
        expiresIn: tokenPair.expiresIn
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao criar conta');
    }
  }

  /**
   * Realiza logout
   */
  async logout(userId?: string): Promise<void> {
    await this.logoutUseCase.execute(userId);
  }

  /**
   * Logout síncrono
   */
  logoutSync(): void {
    this.logoutUseCase.executeSync();
  }

  /**
   * Verifica se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.verifySessionUseCase.quickCheck();
  }

  /**
   * Obtém usuário atual
   */
  async getCurrentUser(): Promise<UserOutputDTO | null> {
    const user = await this.verifySessionUseCase.execute();
    return user ? UserDTOMapper.toOutputDTO(user) : null;
  }

  /**
   * Obtém ID do usuário atual
   */
  getCurrentUserId(): string | null {
    return this.verifySessionUseCase.getUserIdFromSession();
  }

  /**
   * Renova access token
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      const tokenPair = await this.refreshTokenUseCase.execute(undefined, false);

      this.tokenStorage.setToken(tokenPair.accessToken);

      return tokenPair.accessToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * Renova ambos os tokens (rotation)
   */
  async refreshTokens(): Promise<TokenPair | null> {
    try {
      const tokenPair = await this.refreshTokenUseCase.execute(undefined, true);

      this.tokenStorage.setToken(tokenPair.accessToken);
      this.tokenStorage.setRefreshToken(tokenPair.refreshToken);

      return tokenPair;
    } catch (error) {
      return null;
    }
  }

  /**
   * Valida token
   */
  async validateToken(token: string): Promise<boolean> {
    return await this.validateTokenUseCase.quickValidate(token);
  }

  /**
   * Obtém informações do token
   */
  getTokenInfo(): {
    isValid: boolean;
    isExpired: boolean;
    expiresAt: Date | null;
    timeRemaining: number;
    userId: string | null;
  } {
    const token = this.tokenStorage.getToken();

    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        timeRemaining: 0,
        userId: null
      };
    }

    const info = this.validateTokenUseCase.getTokenInfo(token);
    const timeRemaining = this.validateTokenUseCase.getTimeRemaining(token);

    return {
      isValid: true,
      isExpired: !this.validateTokenUseCase.quickValidate(token),
      expiresAt: info.expiresAt,
      timeRemaining,
      userId: info.userId
    };
  }

  /**
   * Verifica se sessão está expirando
   */
  isSessionExpiringSoon(minutesThreshold: number = 5): boolean {
    return this.verifySessionUseCase.isSessionExpiringSoon(minutesThreshold);
  }

  /**
   * Obtém tempo restante da sessão
   */
  getSessionTimeRemaining(): number {
    return this.verifySessionUseCase.getSessionTimeRemaining();
  }

  /**
   * Verifica disponibilidade de email
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    return await this.signupUseCase.isEmailAvailable(email);
  }

  /**
   * Valida força da senha
   */
  validatePasswordStrength(password: string) {
    return this.signupUseCase.validatePasswordStrength(password);
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(input: ChangePasswordInput): Promise<void> {
    await this.changePasswordUseCase.execute(input);
  }

  /**
   * Valida força da nova senha
   */
  validateNewPasswordStrength(password: string) {
    return this.changePasswordUseCase.validateNewPasswordStrength(password);
  }

  /**
   * Verifica se tem sessão ativa
   */
  hasActiveSession(): boolean {
    return this.logoutUseCase.hasActiveSession();
  }
}