/**
* Tipos relacionados a Analytics
*/

/**
* Categoria de evento
*/
export type EventCategory =
    | 'Navigation'
    | 'User Action'
    | 'Form'
    | 'Error'
    | 'Performance'
    | 'Engagement';

/**
* Evento de analytics
*/
export interface AnalyticsEvent {
    category: EventCategory;
    action: string;
    label?: string;
    value?: number;
    userId?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}

/**
* Página view
*/
export interface PageView {
    page: string;
    title: string;
    path: string;
    referrer?: string;
    timestamp: Date;
}

/**
* Ação do usuário
*/
export interface UserAction {
    action: string;
    target?: string;
    value?: any;
    timestamp: Date;
}

/**
* Métricas de performance
*/
export interface PerformanceMetrics {
    pageLoadTime: number;
    domContentLoaded: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
    timeToInteractive?: number;
}

/**
* Sessão de usuário
*/
export interface UserSession {
    sessionId: string;
    userId?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    pageViews: number;
    actions: number;
}

/**
* Funil de conversão
*/
export interface ConversionFunnel {
    step: string;
    count: number;
    percentage: number;
    dropoff?: number;
}