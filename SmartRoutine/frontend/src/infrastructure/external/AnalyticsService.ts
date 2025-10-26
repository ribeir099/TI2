/**
* Evento de analytics
*/
export interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    userId?: string;
}

/**
* Propriedades personalizadas
*/
export interface CustomProperties {
    [key: string]: string | number | boolean;
}

/**
* Serviço de Analytics (Simulado)
* 
* Responsabilidades:
* - Tracking de eventos
* - Métricas de uso
* - Analytics de comportamento
* 
* Em produção integrar com:
* - Google Analytics
* - Mixpanel
* - Amplitude
* - PostHog
*/
export class AnalyticsService {
    private isEnabled: boolean;
    private userId: string | null = null;

    constructor() {
        this.isEnabled = import.meta.env.PROD; // Apenas em produção
    }

    /**
     * Inicializa analytics
     */
    init(userId?: string): void {
        if (userId) {
            this.userId = userId;
        }

        if (this.isEnabled) {
            console.log('📊 Analytics inicializado');
        }
    }

    /**
     * Define ID do usuário
     */
    setUserId(userId: string): void {
        this.userId = userId;
    }

    /**
     * Remove ID do usuário
     */
    clearUserId(): void {
        this.userId = null;
    }

    /**
     * Tracka evento
     */
    trackEvent(event: AnalyticsEvent): void {
        if (!this.isEnabled) return;

        console.log('📊 Event:', {
            ...event,
            userId: event.userId || this.userId,
            timestamp: new Date().toISOString()
        });

        // Em produção: enviar para serviço de analytics
        // gtag('event', event.action, { ... });
        // mixpanel.track(event.action, { ... });
    }

    /**
     * Tracka page view
     */
    trackPageView(pageName: string, properties?: CustomProperties): void {
        this.trackEvent({
            category: 'Navigation',
            action: 'Page View',
            label: pageName,
            userId: this.userId || undefined
        });
    }

    /**
     * Tracka ação de usuário
     */
    trackUserAction(action: string, label?: string, value?: number): void {
        this.trackEvent({
            category: 'User Action',
            action,
            label,
            value,
            userId: this.userId || undefined
        });
    }

    /**
     * Tracka erro
     */
    trackError(error: Error, context?: string): void {
        this.trackEvent({
            category: 'Error',
            action: error.name,
            label: context || error.message,
            userId: this.userId || undefined
        });

        console.error('📊 Error tracked:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context
        });
    }

    /**
     * Tracka timing (performance)
     */
    trackTiming(category: string, variable: string, timeMs: number): void {
        this.trackEvent({
            category: 'Timing',
            action: variable,
            label: category,
            value: timeMs,
            userId: this.userId || undefined
        });
    }

    /**
     * Eventos pré-definidos
     */

    // Alimentos
    trackFoodAdded(category: string): void {
        this.trackUserAction('Food Added', category);
    }

    trackFoodDeleted(): void {
        this.trackUserAction('Food Deleted');
    }

    trackFoodUpdated(): void {
        this.trackUserAction('Food Updated');
    }

    // Receitas
    trackRecipeViewed(recipeId: number): void {
        this.trackUserAction('Recipe Viewed', recipeId.toString());
    }

    trackRecipeCreated(source: 'manual' | 'ai'): void {
        this.trackUserAction('Recipe Created', source);
    }

    trackRecipeFavorited(recipeId: number): void {
        this.trackUserAction('Recipe Favorited', recipeId.toString());
    }

    trackRecipeUnfavorited(recipeId: number): void {
        this.trackUserAction('Recipe Unfavorited', recipeId.toString());
    }

    // Autenticação
    trackLogin(method: 'email' | 'social'): void {
        this.trackUserAction('Login', method);
    }

    trackSignup(method: 'email' | 'social'): void {
        this.trackUserAction('Signup', method);
    }

    trackLogout(): void {
        this.trackUserAction('Logout');
    }

    // Exportações
    trackExport(type: 'pdf' | 'csv' | 'json'): void {
        this.trackUserAction('Export', type);
    }

    // Busca
    trackSearch(query: string, resultsCount: number): void {
        this.trackUserAction('Search', query, resultsCount);
    }

    // IA
    trackAIGeneration(success: boolean): void {
        this.trackUserAction('AI Generation', success ? 'success' : 'failure');
    }

    /**
     * Habilita/desabilita analytics
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    /**
     * Verifica se está habilitado
     */
    isAnalyticsEnabled(): boolean {
        return this.isEnabled;
    }
}

// Singleton instance
export const analyticsService = new AnalyticsService();