import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { NotificationType } from '@/shared/types';

/**
* Notificação
*/
export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
}

/**
* Dados do contexto de notificações
*/
export interface NotificationContextData {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}

/**
* Context de Notificações
*/
export const NotificationContext = createContext<NotificationContextData>(
    {} as NotificationContextData
);

/**
* Props do Provider
*/
interface NotificationProviderProps {
    children: ReactNode;
    maxNotifications?: number;
    defaultDuration?: number;
}

/**
* Provider de Notificações
* 
* Responsabilidades:
* - Gerenciar notificações/toasts
* - Auto-remover após duração
* - Limitar quantidade visível
*/
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    maxNotifications = 3,
    defaultDuration = 5000
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    /**
     * Adiciona notificação
     */
    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const duration = notification.duration ?? defaultDuration;

        const newNotification: Notification = {
            ...notification,
            id
        };

        setNotifications(prev => {
            const updated = [...prev, newNotification];

            // Limitar quantidade de notificações
            if (updated.length > maxNotifications) {
                return updated.slice(-maxNotifications);
            }

            return updated;
        });

        // Auto-remover após duração (se duration > 0)
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [defaultDuration, maxNotifications]);

    /**
     * Remove notificação
     */
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    /**
     * Limpa todas as notificações
     */
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /**
     * Atalhos para tipos de notificação
     */
    const success = useCallback((message: string, title?: string) => {
        addNotification({ type: 'success', message, title });
    }, [addNotification]);

    const error = useCallback((message: string, title?: string) => {
        addNotification({ type: 'error', message, title });
    }, [addNotification]);

    const warning = useCallback((message: string, title?: string) => {
        addNotification({ type: 'warning', message, title });
    }, [addNotification]);

    const info = useCallback((message: string, title?: string) => {
        addNotification({ type: 'info', message, title });
    }, [addNotification]);

    const value: NotificationContextData = {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        success,
        error,
        warning,
        info
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};