import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Theme } from '@/shared/types';
import { preferencesStorage } from '@/infrastructure/storage/PreferencesStorage';
import { useAuth } from '@/presentation/hooks/useAuth';

/**
* Dados do contexto de tema
*/
export interface ThemeContextData {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isDark: boolean;
    isLight: boolean;
    isAuto: boolean;
    effectiveTheme: 'light' | 'dark';
}

/**
* Context de Tema
*/
export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

/**
* Props do Provider
*/
interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

/**
* Provider de Tema
* 
* Responsabilidades:
* - Gerenciar tema da aplicação
* - Sincronizar com preferências do sistema
* - Persistir preferência do usuário
* - Aplicar tema no DOM
*/
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'auto',
    storageKey = 'theme'
}) => {
    const { user } = useAuth();
    const [theme, setThemeState] = useState<Theme>(() => {
        // Tentar carregar do localStorage
        try {
            if (user) {
                const prefs = preferencesStorage.getPreferences(user.id);
                return prefs.interface.tema;
            }

            const stored = localStorage.getItem(storageKey);
            return (stored as Theme) || defaultTheme;
        } catch (error) {
            return defaultTheme;
        }
    });

    /**
     * Determina tema efetivo (resolvendo 'auto')
     */
    const getEffectiveTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
        if (currentTheme === 'auto') {
            // Detectar preferência do sistema
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
            }
            return 'light';
        }
        return currentTheme;
    }, []);

    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(
        () => getEffectiveTheme(theme)
    );

    /**
     * Aplica tema no DOM
     */
    useEffect(() => {
        const root = window.document.documentElement;
        const effective = getEffectiveTheme(theme);

        root.classList.remove('light', 'dark');
        root.classList.add(effective);

        setEffectiveTheme(effective);
    }, [theme, getEffectiveTheme]);

    /**
     * Monitora mudanças na preferência do sistema (quando theme = 'auto')
     */
    useEffect(() => {
        if (theme !== 'auto') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            setEffectiveTheme(e.matches ? 'dark' : 'light');

            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(e.matches ? 'dark' : 'light');
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            // Fallback para navegadores antigos
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, [theme]);

    /**
     * Define tema
     */
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);

        // Salvar preferência
        try {
            if (user) {
                preferencesStorage.updatePreference(user.id, 'interface', {
                    tema: newTheme,
                    idioma: 'pt-BR',
                    densidade: 'confortavel'
                });
            }

            localStorage.setItem(storageKey, newTheme);
        } catch (error) {
            console.error('Erro ao salvar tema:', error);
        }
    }, [user, storageKey]);

    /**
     * Alterna tema (light <-> dark)
     */
    const toggleTheme = useCallback(() => {
        const effective = getEffectiveTheme(theme);
        setTheme(effective === 'dark' ? 'light' : 'dark');
    }, [theme, getEffectiveTheme, setTheme]);

    const value: ThemeContextData = {
        theme,
        setTheme,
        toggleTheme,
        isDark: effectiveTheme === 'dark',
        isLight: effectiveTheme === 'light',
        isAuto: theme === 'auto',
        effectiveTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};