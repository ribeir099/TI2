import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import smartRoutineLogo from '@/assets/logo.png';
import { ROUTES } from '@/shared/constants/routes';

/**
* Props do AuthLayout
*/
interface AuthLayoutProps {
    children: ReactNode;
    showBackButton?: boolean;
    showLogo?: boolean;
    backgroundImage?: string;
}

/**
* Layout de Autenticação
* 
* Usado para páginas de login, signup, forgot password, etc
* 
* Características:
* - Centralizado
* - Design limpo
* - Background opcional
* - Logo no topo
*/
export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    showBackButton = true,
    showLogo = true,
    backgroundImage
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header Simples */}
            <header className="w-full border-b bg-card">
                <div className="container flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    {showLogo && (
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                            <span className="font-semibold text-lg">SmartRoutine</span>
                        </div>
                    )}

                    {/* Back Button */}
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            ← Voltar ao início
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main
                className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8"
                style={
                    backgroundImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }
                        : undefined
                }
            >
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer Simples */}
            <footer className="border-t py-4">
                <div className="container px-4">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} SmartRoutine. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};