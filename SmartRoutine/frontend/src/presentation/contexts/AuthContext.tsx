import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/domain/entities/User';
import { UserOutputDTO, LoginInputDTO, CreateUserInputDTO } from '@/application/dto/UserDTO';
import { AuthService } from '@/application/services/AuthService';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { tokenStorage } from '@/infrastructure/storage/TokenStorage';
import { AppError } from '@/shared/errors/AppError';

/**
* Dados do contexto de autenticação
*/
export interface AuthContextData {
    user: UserOutputDTO | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (input: LoginInputDTO) => Promise<void>;
    signup: (input: CreateUserInputDTO) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    updateUser: (data: Partial<UserOutputDTO>) => void;
}

/**
* Context de Autenticação
*/
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
* Props do Provider
*/
interface AuthProviderProps {
    children: ReactNode;
}

/**
* Provider de Autenticação
* 
* Responsabilidades:
* - Gerenciar estado de autenticação
* - Login/Logout
* - Verificar sessão
* - Refresh token automático
*/
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserOutputDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar AuthService
    const authService = new AuthService(
        new UserRepository(apiClient),
        tokenStorage
    );

    /**
     * Verifica sessão existente ao carregar
     */
    useEffect(() => {
        const checkSession = async () => {
            try {
                setIsLoading(true);

                // Verificar se tem token
                if (!tokenStorage.hasToken()) {
                    setIsLoading(false);
                    return;
                }

                // Verificar se token está válido
                const isValid = authService.isAuthenticated();

                if (!isValid) {
                    // Token inválido - limpar sessão
                    tokenStorage.clearAll();
                    setIsLoading(false);
                    return;
                }

                // Carregar dados do usuário do storage
                const storedUser = tokenStorage.getUser();

                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                tokenStorage.clearAll();
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    /**
     * Login
     */
    const login = useCallback(async (input: LoginInputDTO): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await authService.login(input);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Signup
     */
    const signup = useCallback(async (input: CreateUserInputDTO): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await authService.signup(input);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no signup:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Logout
     */
    const logout = useCallback(() => {
        try {
            authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }, []);

    /**
     * Refresh token
     */
    const refreshToken = useCallback(async (): Promise<void> => {
        try {
            await authService.refreshAccessToken();

            // Atualizar dados do usuário se necessário
            const storedUser = tokenStorage.getUser();
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            // Se falhar, fazer logout
            logout();
            throw error;
        }
    }, [logout]);

    /**
     * Atualiza dados do usuário
     */
    const updateUser = useCallback((data: Partial<UserOutputDTO>) => {
        if (!user) return;

        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        tokenStorage.setUser(updatedUser);
    }, [user]);

    const value: AuthContextData = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshToken,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};