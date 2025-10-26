/**
* Tipo de notificação
*/
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
* Opções de notificação
*/
export interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    data?: any;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

/**
* Serviço de Notificações
* 
* Responsabilidades:
* - Notificações do navegador (Web Notifications API)
* - Push notifications
* - Permissões
* - Gerenciamento de notificações
*/
export class NotificationService {
    private permission: NotificationPermission = 'default';

    constructor() {
        if (this.isSupported()) {
            this.permission = Notification.permission;
        }
    }

    /**
     * Verifica se notificações são suportadas
     */
    isSupported(): boolean {
        return 'Notification' in window;
    }

    /**
     * Verifica se tem permissão
     */
    hasPermission(): boolean {
        return this.permission === 'granted';
    }

    /**
     * Solicita permissão
     */
    async requestPermission(): Promise<boolean> {
        if (!this.isSupported()) {
            console.warn('Notificações não são suportadas neste navegador');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (error) {
            console.error('Erro ao solicitar permissão de notificação:', error);
            return false;
        }
    }

    /**
     * Envia notificação
     */
    async send(options: NotificationOptions): Promise<Notification | null> {
        if (!this.isSupported()) {
            console.warn('Notificações não suportadas');
            return null;
        }

        if (!this.hasPermission()) {
            const granted = await this.requestPermission();
            if (!granted) {
                console.warn('Permissão de notificação negada');
                return null;
            }
        }

        try {
            const notification = new Notification(options.title, {
                body: options.body,
                icon: options.icon || '/logo.png',
                badge: options.badge,
                tag: options.tag,
                requireInteraction: options.requireInteraction,
                silent: options.silent,
                data: options.data,
            });

            // Auto-fechar após 5 segundos (se não requireInteraction)
            if (!options.requireInteraction) {
                setTimeout(() => notification.close(), 5000);
            }

            return notification;
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            return null;
        }
    }

    /**
     * Envia notificação de vencimento
     */
    async sendExpirationNotification(itemName: string, daysUntilExpiry: number): Promise<void> {
        const title = daysUntilExpiry === 0
            ? '⚠️ Item vence hoje!'
            : `⚠️ Item vence em ${daysUntilExpiry} dia(s)`;

        await this.send({
            title,
            body: `${itemName} está próximo do vencimento. Não esqueça de consumir!`,
            tag: 'expiration',
            requireInteraction: true,
            icon: '/icons/warning.png'
        });
    }

    /**
     * Envia notificação de nova receita
     */
    async sendNewRecipeNotification(recipeTitle: string): Promise<void> {
        await this.send({
            title: '🍳 Nova Receita Sugerida!',
            body: `Confira: ${recipeTitle}`,
            tag: 'new-recipe',
            icon: '/icons/recipe.png'
        });
    }

    /**
     * Envia notificação de sucesso
     */
    async sendSuccessNotification(message: string): Promise<void> {
        await this.send({
            title: '✅ Sucesso',
            body: message,
            tag: 'success',
            silent: true
        });
    }

    /**
     * Envia notificação de erro
     */
    async sendErrorNotification(message: string): Promise<void> {
        await this.send({
            title: '❌ Erro',
            body: message,
            tag: 'error',
            requireInteraction: true
        });
    }

    /**
     * Agenda notificação
     */
    async scheduleNotification(
        options: NotificationOptions,
        delayMs: number
    ): Promise<number> {
        return window.setTimeout(async () => {
            await this.send(options);
        }, delayMs);
    }

    /**
     * Cancela notificação agendada
     */
    cancelScheduledNotification(timeoutId: number): void {
        clearTimeout(timeoutId);
    }

    /**
     * Fecha todas as notificações com tag
     */
    closeByTag(tag: string): void {
        // Nota: Não há API nativa para isso
        // Seria necessário manter referências às notificações
        console.log(`Fechando notificações com tag: ${tag}`);
    }

    /**
     * Verifica status da permissão
     */
    getPermissionStatus(): NotificationPermission {
        return this.permission;
    }

    /**
     * Reseta permissão (usuário precisa revogar manualmente no browser)
     */
    async resetPermission(): Promise<void> {
        console.log('Para resetar permissões, vá em: Configurações do navegador > Notificações');
    }
}

// Singleton instance
export const notificationService = new NotificationService();