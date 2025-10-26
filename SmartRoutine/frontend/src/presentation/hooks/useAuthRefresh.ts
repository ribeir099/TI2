import { useEffect, useRef } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { tokenStorage } from '@/infrastructure/storage/TokenStorage';

/**
* Hook para renovação automática de tokens
* 
* Verifica periodicamente se o token precisa ser renovado
* e executa o refresh automaticamente antes de expirar
*/
export const useAuthRefresh = () => {
    const { isAuthenticated, refreshToken, logout } = useAuth();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Se não está autenticado, não fazer nada
        if (!isAuthenticated) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Verificar a cada minuto
        intervalRef.current = setInterval(async () => {
            try {
                // Obter tempo restante do token
                const timeRemaining = getTokenTimeRemaining();

                // Se token expira em menos de 5 minutos, renovar
                if (timeRemaining <= 5 && timeRemaining > 0) {
                    console.log('🔄 Token expirando em breve, renovando...');
                    await refreshToken();
                }

                // Se token já expirou, fazer logout
                if (timeRemaining <= 0) {
                    console.log('❌ Token expirado, fazendo logout...');
                    logout();
                }
            } catch (error) {
                console.error('Erro ao verificar/renovar token:', error);
                // Não fazer logout em caso de erro na verificação
            }
        }, 60000); // 60 segundos = 1 minuto

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAuthenticated, refreshToken, logout]);

    /**
     * Calcula tempo restante do token em minutos
     */
    function getTokenTimeRemaining(): number {
        try {
            const token = tokenStorage.getToken();
            if (!token) return 0;

            // Decodificar token (sem verificar assinatura)
            const base64Url = token.split('.')[1];
            if (!base64Url) return 0;

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);

            if (!payload.exp) return 0;

            const now = Math.floor(Date.now() / 1000);
            const remaining = payload.exp - now;

            // Converter segundos para minutos
            return Math.floor(remaining / 60);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return 0;
        }
    }
};