import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Theme, Language, Density } from '@/shared/types';

/**
* Estado da UI
*/
export interface UIState {
    theme: Theme;
    language: Language;
    density: Density;
    sidebarCollapsed: boolean;
    sidebarOpen: boolean;
}

/**
* Dados do contexto de UI
*/
export interface UIContextData extends UIState {
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;
    setDensity: (density: Density) => void;
    toggleSidebar: () => void;
    collapseSidebar: () => void;
    expandSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    resetUI: () => void;
}

/**
* Context de UI
*/
export const UIContext = createContext<UIContextData>({} as UIContextData);

/**
* Props do Provider
*/
interface UIProviderProps {
    children: ReactNode;
    defaultState?: Partial<UIState>;
}

/**
* Provider de Estado da UI
* 
* Responsabilidades:
* - Gerenciar estado global da UI
* - Preferências visuais
* - Estado de componentes globais (sidebar, etc)
*/
export const UIProvider: React.FC<UIProviderProps> = ({
    children,
    defaultState
}) => {
    const [state, setState] = useState<UIState>({
        theme: defaultState?.theme || 'auto',
        language: defaultState?.language || 'pt-BR',
        density: defaultState?.density || 'comfortable',
        sidebarCollapsed: defaultState?.sidebarCollapsed || false,
        sidebarOpen: defaultState?.sidebarOpen || false
    });

    /**
     * Define tema
     */
    const setTheme = useCallback((theme: Theme) => {
        setState(prev => ({ ...prev, theme }));
    }, []);

    /**
     * Define idioma
     */
    const setLanguage = useCallback((language: Language) => {
        setState(prev => ({ ...prev, language }));
    }, []);

    /**
     * Define densidade
     */
    const setDensity = useCallback((density: Density) => {
        setState(prev => ({ ...prev, density }));
    }, []);

    /**
     * Toggle sidebar collapsed
     */
    const toggleSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
    }, []);

    /**
     * Colapsa sidebar
     */
    const collapseSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarCollapsed: true }));
    }, []);

    /**
     * Expande sidebar
     */
    const expandSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarCollapsed: false }));
    }, []);

    /**
     * Abre sidebar (mobile)
     */
    const openSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarOpen: true }));
    }, []);

    /**
     * Fecha sidebar (mobile)
     */
    const closeSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarOpen: false }));
    }, []);

    /**
     * Reseta UI para padrão
     */
    const resetUI = useCallback(() => {
        setState({
            theme: 'auto',
            language: 'pt-BR',
            density: 'comfortable',
            sidebarCollapsed: false,
            sidebarOpen: false
        });
    }, []);

    // Persistir preferências
    useEffect(() => {
        try {
            localStorage.setItem('ui_preferences', JSON.stringify(state));
        } catch (error) {
            console.error('Erro ao salvar preferências de UI:', error);
        }
    }, [state]);

    const value: UIContextData = {
        ...state,
        setTheme,
        setLanguage,
        setDensity,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
        openSidebar,
        closeSidebar,
        resetUI
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};