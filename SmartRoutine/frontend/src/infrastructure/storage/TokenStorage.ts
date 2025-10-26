import { LocalStorage } from "./LocalStorage";

/**
* Chaves de armazenamento
*/
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'smartroutine_access_token',
  REFRESH_TOKEN: 'smartroutine_refresh_token',
  USER_DATA: 'smartroutine_user_data',
  TOKEN_EXPIRY: 'smartroutine_token_expiry',
  REMEMBER_ME: 'smartroutine_remember_me'
} as const;

/**
* Dados do token
*/
export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
}

/**
* Gerenciador de Tokens e Dados de Autenticação
* 
* Responsabilidades:
* - Armazenar tokens JWT
* - Gerenciar dados de sessão
* - Controlar expiração
* - Limpeza de dados
*/
export class TokenStorage {
  private localStorage: LocalStorage;

  constructor() {
    this.localStorage = new LocalStorage();
  }

  // ==================== ACCESS TOKEN ====================

  /**
   * Salva access token
   */
  setToken(token: string): void {
    try {
      this.localStorage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar access token:', error);
    }
  }

  /**
   * Obtém access token
   */
  getToken(): string | null {
    try {
      return this.localStorage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Erro ao obter access token:', error);
      return null;
    }
  }

  /**
   * Remove access token
   */
  removeToken(): void {
    try {
      this.localStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Erro ao remover access token:', error);
    }
  }

  /**
   * Verifica se tem access token
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  // ==================== REFRESH TOKEN ====================

  /**
   * Salva refresh token
   */
  setRefreshToken(token: string): void {
    try {
      this.localStorage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar refresh token:', error);
    }
  }

  /**
   * Obtém refresh token
   */
  getRefreshToken(): string | null {
    try {
      return this.localStorage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Erro ao obter refresh token:', error);
      return null;
    }
  }

  /**
   * Remove refresh token
   */
  removeRefreshToken(): void {
    try {
      this.localStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Erro ao remover refresh token:', error);
    }
  }

  /**
   * Verifica se tem refresh token
   */
  hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  }

  // ==================== USER DATA ====================

  /**
   * Salva dados do usuário
   */
  setUser(user: any): void {
    try {
      this.localStorage.set(STORAGE_KEYS.USER_DATA, user);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  }

  /**
   * Obtém dados do usuário
   */
  getUser<T = any>(): T | null {
    try {
      return this.localStorage.get<T>(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  /**
   * Remove dados do usuário
   */
  clearUser(): void {
    try {
      this.localStorage.remove(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Erro ao remover dados do usuário:', error);
    }
  }

  /**
   * Verifica se tem dados do usuário
   */
  hasUser(): boolean {
    return this.getUser() !== null;
  }

  // ==================== TOKEN EXPIRY ====================

  /**
   * Define data de expiração do token
   */
  setTokenExpiry(expiresAt: number): void {
    try {
      this.localStorage.set(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt);
    } catch (error) {
      console.error('Erro ao salvar expiração do token:', error);
    }
  }

  /**
   * Obtém data de expiração do token
   */
  getTokenExpiry(): number | null {
    try {
      return this.localStorage.get<number>(STORAGE_KEYS.TOKEN_EXPIRY);
    } catch (error) {
      console.error('Erro ao obter expiração do token:', error);
      return null;
    }
  }

  /**
   * Verifica se token está expirado
   */
  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiry();

    if (!expiresAt) return false;

    return Date.now() > expiresAt;
  }

  /**
   * Obtém tempo restante até expiração (em ms)
   */
  getTimeUntilExpiry(): number {
    const expiresAt = this.getTokenExpiry();

    if (!expiresAt) return 0;

    return Math.max(0, expiresAt - Date.now());
  }

  // ==================== REMEMBER ME ====================

  /**
   * Define remember me
   */
  setRememberMe(remember: boolean): void {
    try {
      this.localStorage.set(STORAGE_KEYS.REMEMBER_ME, remember);
    } catch (error) {
      console.error('Erro ao salvar remember me:', error);
    }
  }

  /**
   * Obtém remember me
   */
  getRememberMe(): boolean {
    try {
      return this.localStorage.get<boolean>(STORAGE_KEYS.REMEMBER_ME) || false;
    } catch (error) {
      return false;
    }
  }

  // ==================== OPERAÇÕES COMPLETAS ====================

  /**
   * Salva dados completos de autenticação
   */
  setAuthData(data: TokenData): void {
    try {
      if (data.accessToken) {
        this.setToken(data.accessToken);
      }

      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }

      if (data.expiresAt) {
        this.setTokenExpiry(data.expiresAt);
      }
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error);
    }
  }

  /**
   * Obtém dados completos de autenticação
   */
  getAuthData(): TokenData | null {
    try {
      const accessToken = this.getToken();

      if (!accessToken) return null;

      return {
        accessToken,
        refreshToken: this.getRefreshToken() || undefined,
        expiresAt: this.getTokenExpiry() || undefined,
        userId: this.getUser()?.id
      };
    } catch (error) {
      console.error('Erro ao obter dados de autenticação:', error);
      return null;
    }
  }

  /**
   * Limpa todos os dados de autenticação
   */
  clearAll(): void {
    try {
      this.removeToken();
      this.removeRefreshToken();
      this.clearUser();
      this.localStorage.remove(STORAGE_KEYS.TOKEN_EXPIRY);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
    }
  }

  /**
   * Verifica se há sessão ativa válida
   */
  hasActiveSession(): boolean {
    return (
      this.hasToken() &&
      this.hasRefreshToken() &&
      !this.isTokenExpired()
    );
  }

  /**
   * Verifica se sessão está próxima de expirar
   */
  isSessionExpiringSoon(thresholdMinutes: number = 5): boolean {
    const timeRemaining = this.getTimeUntilExpiry();
    const thresholdMs = thresholdMinutes * 60 * 1000;

    return timeRemaining > 0 && timeRemaining <= thresholdMs;
  }

  /**
   * Obtém informações da sessão
   */
  getSessionInfo(): {
    hasSession: boolean;
    isExpired: boolean;
    isExpiringSoon: boolean;
    timeRemaining: number;
    userId: string | null;
  } {
    return {
      hasSession: this.hasActiveSession(),
      isExpired: this.isTokenExpired(),
      isExpiringSoon: this.isSessionExpiringSoon(),
      timeRemaining: this.getTimeUntilExpiry(),
      userId: this.getUser()?.id || null
    };
  }
}

// Singleton instance
export const tokenStorage = new TokenStorage();