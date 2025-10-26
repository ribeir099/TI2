import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import smartRoutineLogo from '@/assets/logo.png';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

/**
* Props do FullWidthLayout
*/
interface FullWidthLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
}

/**
* Layout de Largura Total
* 
* Usado para páginas que precisam de toda a largura
* (ex: landing page, páginas de marketing)
* 
* Características:
* - Sem container
* - Full width
* - Header transparente (opcional)
*/
export const FullWidthLayout: React.FC<FullWidthLayoutProps> = ({
    children,
    showHeader = true,
    showFooter = true
}) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            {showHeader && (
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="container flex h-16 items-center justify-between px-4">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                            <span className="font-semibold">SmartRoutine</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
                                    Ir para o App
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>
                                        Entrar
                                    </Button>
                                    <Button onClick={() => navigate(ROUTES.SIGNUP)}>
                                        Criar Conta
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content - Full Width */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            {showFooter && (
                <footer className="border-t bg-card">
                    <div className="container py-8 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                                    <span className="font-semibold">SmartRoutine</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Gerencie sua despensa e descubra receitas incríveis.
                                </p>
                            </div>

                            {/* Links */}
                            <div>
                                <h3 className="font-semibold mb-4">Produto</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Recursos
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Preços
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            FAQ
                                        </Button>
                                    </li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-semibold mb-4">Empresa</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Sobre
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Blog
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Contato
                                        </Button>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h3 className="font-semibold mb-4">Legal</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Privacidade
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Termos
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" className="h-auto p-0 text-muted-foreground">
                                            Cookies
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <Separator className="my-6" />
                        <p className="text-center text-sm text-muted-foreground">
                            © {new Date().getFullYear()} SmartRoutine. Todos os direitos reservados.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
};