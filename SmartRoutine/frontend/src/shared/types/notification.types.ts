/**
* Tipos relacionados a Notificações
*/

import { Action } from "sonner";
import { NotificationType, ComponentVariant, AlertType } from "./general.types";

/**
* Notificação
*/
export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    timestamp: Date;
    read?: boolean;
    action?: NotificationAction;
    metadata?: any;
}

/**
* Ação de notificação
*/
export interface NotificationAction {
    label: string;
    onClick: () => void;
    variant?: ComponentVariant;
}

/**
* Configurações de notificação
*/
export interface NotificationSettings {
    enabled: boolean;
    types: {
        email: boolean;
        push: boolean;
        inApp: boolean;
    };
    preferences: {
        expiration: boolean;
        newRecipes: boolean;
        favorites: boolean;
        system: boolean;
    };
}

/**
* Toast notification
*/
export interface Toast extends Notification {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    dismissible?: boolean;
}

/**
* Push notification
*/
export interface PushNotification {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    silent?: boolean;
}

/**
* Alerta
*/
export interface Alert {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    dismissible?: boolean;
    actions?: Action[];
}