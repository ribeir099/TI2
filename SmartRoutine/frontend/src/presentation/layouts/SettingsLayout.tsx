import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/components/ui/utils';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Database,
    CreditCard,
    Users
} from 'lucide-react';

/**
* Props do SettingsLayout
*/
interface SettingsLayoutProps {
    children: ReactNode;
}

/**
* Layout de Configurações
* 
* Layout específico para páginas de configurações
* Com sidebar de navegação entre seções
*/
export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const settingsSections = [
        {
            title: 'Geral',
            items: [
                {
                    name: 'Perfil',
                    path: '/settings/profile',
                    icon: User,
                    description: 'Gerencie suas informações pessoais'
                },
                {
                    name: 'Conta',
                    path: '/settings/account',
                    icon: Shield,
                    description: 'Segurança e acesso'
                }
            ]
        },
        {
            title: 'Preferências',
            items: [
                {
                    name: 'Aparência',
                    path: '/settings/appearance',
                    icon: Palette,
                    description: 'Tema e personalização'
                },
                {
                    name: 'Notificações',
                    path: '/settings/notifications',
                    icon: Bell,
                    description: 'Gerencie suas notificações'
                },
                {
                    name: 'Idioma',
                    path: '/settings/language',
                    icon: Globe,
                    description: 'Idioma e região'
                }
            ]
        },
        {
            title: 'Dados',
            items: [
                {
                    name: 'Privacidade',
                    path: '/settings/privacy',
                    icon: Shield,
                    description: 'Controle de privacidade'
                },
                {
                    name: 'Dados',
                    path: '/settings/data',
                    icon: Database,
                    description: 'Exportar e importar dados'
                }
            ]
        },
        {
            title: 'Plano',
            items: [
                {
                    name: 'Assinatura',
                    path: '/settings/subscription',
                    icon: CreditCard,
                    description: 'Gerencie sua assinatura'
                },
                {
                    name: 'Membros',
                    path: '/settings/members',
                    icon: Users,
                    description: 'Compartilhar acesso'
                }
            ]
        }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="container py-6 lg:py-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Configurações</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas preferências e configurações da conta
                    </p>
                </div>

                <Separator />

                {/* Layout com Sidebar */}
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    {/* Sidebar de Navegação */}
                    <aside className="lg:w-1/5">
                        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            {settingsSections.map((section) => (
                                <div key={section.title} className="pb-4">
                                    <h4 className="mb-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {section.title}
                                    </h4>
                                    {section.items.map((item) => {
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
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 lg:max-w-3xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};