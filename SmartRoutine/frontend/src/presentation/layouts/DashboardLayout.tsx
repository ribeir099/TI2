import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import smartRoutineLogo from '@/assets/logo.png';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Home,
    Package,
    ChefHat,
    Heart,
    Settings,
    BarChart3,
    Calendar,
    ShoppingCart,
    BookOpen
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

/**
* Props do DashboardLayout
*/
interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    actions?: ReactNode;
}

/**
* Layout de Dashboard (com sidebar fixa)
* 
* Layout alternativo com sidebar sempre visível
* Melhor para telas maiores
*/
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    title,
    description,
    actions
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        {
            title: 'Geral',
            items: [
                { name: 'Painel', path: ROUTES.DASHBOARD, icon: Home },
                { name: 'Estatísticas', path: ROUTES.STATISTICS, icon: BarChart3 }
            ]
        },
        {
            title: 'Despensa',
            items: [
                { name: 'Meus Alimentos', path: ROUTES.PANTRY, icon: Package },
                { name: 'Lista de Compras', path: '/shopping-list', icon: ShoppingCart },
                { name: 'Calendário', path: '/calendar', icon: Calendar }
            ]
        },
        {
            title: 'Receitas',
            items: [
                { name: 'Explorar', path: ROUTES.RECIPES, icon: ChefHat },
                { name: 'Favoritas', path: ROUTES.FAVORITES, icon: Heart },
                { name: 'Minhas Receitas', path: '/my-recipes', icon: BookOpen }
            ]
        },
        {
            title: 'Conta',
            items: [
                { name: 'Configurações', path: ROUTES.SETTINGS, icon: Settings }
            ]
        }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r bg-card lg:block">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center border-b px-6">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(ROUTES.DASHBOARD)}
                        >
                            <img src={smartRoutineLogo} alt="SmartRoutine" className="h-8 w-8" />
                            <span className="font-semibold">SmartRoutine</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 px-4 py-4">
                        {sidebarItems.map((section, index) => (
                            <div key={section.title} className="pb-4">
                                {index > 0 && <Separator className="my-4" />}

                                <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </h4>

                                <div className="space-y-1">
                                    {section.items.map(item => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);

                                        return (
                                            <Button
                                                key={item.path}
                                                variant={active ? 'secondary' : 'ghost'}
                                                onClick={() => navigate(item.path)}
                                                className={cn(
                                                    'w-full justify-start',
                                                    active && 'bg-secondary'
                                                )}
                                            >
                                                <Icon className="mr-2 h-4 w-4" />
                                                {item.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Page Header */}
                {(title || actions) && (
                    <header className="border-b bg-card">
                        <div className="flex h-16 items-center justify-between px-6">
                            <div>
                                {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                                {description && (
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                )}
                            </div>
                            {actions && <div className="flex items-center gap-2">{actions}</div>}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};