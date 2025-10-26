/**
* Tipos relacionados a Contexts (React)
*/

import { Theme } from "./general.types";

/**
* Auth Context
*/
export interface AuthContextData {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    updateUser: (data: any) => Promise<void>;
}

/**
* Theme Context
*/
export interface ThemeContextData {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isDark: boolean;
    isLight: boolean;
}

/**
* Notification Context
*/
export interface NotificationContextData {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}

/**
* Modal Context
*/
export interface ModalContextData {
    openModal: (id: string, data?: any) => void;
    closeModal: (id: string) => void;
    closeAllModals: () => void;
    isModalOpen: (id: string) => boolean;
    getModalData: (id: string) => any;
}

/**
* Loading Context
*/
export interface LoadingContextData {
    isLoading: boolean;
    loadingMessage: string | null;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
}