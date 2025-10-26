import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Home,
    Package,
    ChefHat,
    Settings,
    User,
    LogOut,
    Bell,
    Menu,
    AlertTriangle,
    Heart
} from 'lucide-react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useFoodItems } from '@/presentation/hooks/useFoodItems';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import smartRoutineLogo from '@/assets/logo.png';
import { ROUTES } from '@/shared/constants/routes';

/**
* Props do MainLayout
*/
interface MainLayoutProps {
    children: ReactNode;
    showSidebar?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
}

/**
* Layout Principal da Aplicação
* 
* Usado para páginas protegidas (dashboard, pantry, recipes, etc)
* 
* Inclui:
* - Header com navegação
* - Sidebar (opcional)
* - Footer
* - Notificações
* - Breadcrumbs
*/
export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    showSidebar = false,
    showHeader = true,
    showFooter = false
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { expiringItems } = useFoodItems();
    const { favoriteCount } = useFavorites();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Itens de navegação
     */
    const navigationItems = [
        {
            name: 'Painel',
            path: ROUTES.DASHBOARD,
            icon: Home
        },
        {
            name: 'Despensa',
            path: ROUTES.PANTRY,
            icon: Package,
            badge: expiringItems.length > 0 ? expiringItems.length : undefined
        },
        {
            name: 'Receitas',
            path: ROUTES.RECIPES,
            icon: ChefHat
        },
        {
            name: 'Favoritas',
            path: ROUTES.FAVORITES,
            icon: Heart,
            badge: favoriteCount > 0 ? favoriteCount : undefined
        }
    ];

    /**
     * Verifica se rota está ativa
     */
    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    /**
     * Handle logout
     */
    const handleLogout = async () => {
        try {
            logout();
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    /**
     * Renderiza item de navegação
     */
    const renderNavItem = (item: typeof navigationItems[0]) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
            <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                }}
                className="w-full justify-start relative"
            >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
                {item.badge && (
                    <Badge
                        variant="destructive"
                        className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        {item.badge}
                    </Badge>
                )}
            </Button>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            {showHeader && (
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="container flex h-16 items-center justify-between px-4">
                        {/* Logo e Menu Mobile */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu */}
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild className="lg:hidden">
                                    <Button variant="ghost" size="sm">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 px-2">
                                            <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                                            <span className="font-semibold text-lg">SmartRoutine</span>
                                        </div>

                                        <nav className="flex flex-col gap-2">
                                            {navigationItems.map(item => renderNavItem(item))}
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                            >
                                <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                                <span className="font-semibold text-lg hidden sm:inline">SmartRoutine</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {navigationItems.map(item => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Button
                                        key={item.path}
                                        variant={active ? 'default' : 'ghost'}
                                        onClick={() => navigate(item.path)}
                                        className="relative"
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                        {item.badge && (
                                            <Badge
                                                variant="destructive"
                                                className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            {/* Alertas de Vencimento */}
                            {expiringItems.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(ROUTES.PANTRY)}
                                    className="relative"
                                >
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {expiringItems.length}
                                    </Badge>
                                </Button>
                            )}

                            {/* Notificações */}
                            <Button variant="ghost" size="sm">
                                <Bell className="h-5 w-5" />
                            </Button>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt={user?.nome} />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {user?.iniciais || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.nome}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.emailMascarado}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS)}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configurações</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {showSidebar ? (
                    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                        {/* Sidebar */}
                        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
                            <div className="h-full py-6 pr-6 lg:py-8">
                                <nav className="flex flex-col gap-2">
                                    {navigationItems.map(item => renderNavItem(item))}
                                </nav>
                            </div>
                        </aside>

                        {/* Page Content */}
                        <div className="flex-1 py-6 lg:py-8">
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="container py-6 lg:py-8">
                        {children}
                    </div>
                )}
            </main>

            {/* Footer */}
            {showFooter && (
                <footer className="border-t py-6 md:py-8">
                    <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-2">
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="h-6 w-6" />
                            <span className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} SmartRoutine. Todos os direitos reservados.
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="link" size="sm" className="text-muted-foreground">
                                Sobre
                            </Button>
                            <Button variant="link" size="sm" className="text-muted-foreground">
                                Privacidade
                            </Button>
                            <Button variant="link" size="sm" className="text-muted-foreground">
                                Termos
                            </Button>
                            <Button variant="link" size="sm" className="text-muted-foreground">
                                Suporte
                            </Button>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};