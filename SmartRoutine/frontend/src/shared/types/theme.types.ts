/**
* Tipos relacionados a Tema
*/

import { Theme } from "./general.types";

/**
* Cores do tema
*/
export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
}

/**
* Configuração de tema
*/
export interface ThemeConfig {
    mode: Theme;
    colors: ThemeColors;
    radius: number;
    fontFamily: string;
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
    };
}

/**
* Preferências de tema
*/
export interface ThemePreferences {
    mode: Theme;
    accentColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    reducedMotion?: boolean;
    highContrast?: boolean;
}