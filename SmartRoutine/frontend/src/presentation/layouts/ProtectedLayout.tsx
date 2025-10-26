import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/presentation/hooks/useAuth';
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner';
import { ROUTES } from '@/shared/constants/routes';

/**
* Props do ProtectedLayout
*/
interface ProtectedLayoutProps {
    children: ReactNode;
    redirectTo?: string;
    requiredRole?: string;
}

/**
* Layout Protegido (HOC)
* 
* Verifica autenticação antes de renderizar conteúdo
* Redireciona para login se não autenticado
*/
export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
    children,
    redirectTo = ROUTES.LOGIN
}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Não autenticado - redirecionar para login
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Autenticado - renderizar children
    return <>{children}</>;
};