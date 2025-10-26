import { useContext } from 'react';
import { AuthContext, AuthContextData } from '@/presentation/contexts/AuthContext';

/**
* Hook para acessar contexto de autenticação
* 
* @throws Error se usado fora do AuthProvider
* @returns AuthContextData
*/
export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};

/**
* Hook para verificar se está autenticado
*/
export const useIsAuthenticated = (): boolean => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
};

/**
* Hook para obter usuário atual
*/
export const useCurrentUser = () => {
    const { user } = useAuth();
    return user;
};

/**
* Hook para obter ID do usuário atual
*/
export const useCurrentUserId = (): string | null => {
    const { user } = useAuth();
    return user?.id || null;
};