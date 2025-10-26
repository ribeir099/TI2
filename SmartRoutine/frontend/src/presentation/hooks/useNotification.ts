import { useContext } from 'react';
import { NotificationContext, NotificationContextData } from '@/presentation/contexts/NotificationContext';

/**
* Hook para acessar contexto de notificações
*/
export const useNotification = (): NotificationContextData => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
    }

    return context;
};