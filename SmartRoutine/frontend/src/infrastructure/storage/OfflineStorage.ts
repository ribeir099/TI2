import { LocalStorage } from './LocalStorage';

/**
* Ação pendente (para sincronização offline)
*/
export interface PendingAction {
    id: string;
    type: 'create' | 'update' | 'delete';
    entity: 'user' | 'food' | 'recipe' | 'favorite';
    data: any;
    timestamp: number;
    attempts: number;
    lastAttempt?: number;
}

/**
* Storage para modo offline
* 
* Responsabilidades:
* - Armazenar ações offline
* - Sincronizar quando online
* - Queue de operações
* - Retry logic
*/
export class OfflineStorage {
    private localStorage: LocalStorage;
    private readonly QUEUE_KEY = 'offline_queue';

    constructor() {
        this.localStorage = new LocalStorage();
    }

    /**
     * Adiciona ação à fila
     */
    addAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'attempts'>): void {
        try {
            const queue = this.getQueue();

            const newAction: PendingAction = {
                ...action,
                id: this.generateId(),
                timestamp: Date.now(),
                attempts: 0
            };

            queue.push(newAction);
            this.saveQueue(queue);
        } catch (error) {
            console.error('Erro ao adicionar ação offline:', error);
        }
    }

    /**
     * Obtém fila de ações
     */
    getQueue(): PendingAction[] {
        try {
            return this.localStorage.get<PendingAction[]>(this.QUEUE_KEY) || [];
        } catch (error) {
            console.error('Erro ao obter fila offline:', error);
            return [];
        }
    }

    /**
     * Salva fila
     */
    private saveQueue(queue: PendingAction[]): void {
        this.localStorage.set(this.QUEUE_KEY, queue);
    }

    /**
     * Remove ação da fila
     */
    removeAction(actionId: string): void {
        try {
            const queue = this.getQueue();
            const filtered = queue.filter(action => action.id !== actionId);
            this.saveQueue(filtered);
        } catch (error) {
            console.error('Erro ao remover ação:', error);
        }
    }

    /**
     * Atualiza ação (incrementa tentativas)
     */
    updateAction(actionId: string): void {
        try {
            const queue = this.getQueue();
            const updated = queue.map(action => {
                if (action.id === actionId) {
                    return {
                        ...action,
                        attempts: action.attempts + 1,
                        lastAttempt: Date.now()
                    };
                }
                return action;
            });

            this.saveQueue(updated);
        } catch (error) {
            console.error('Erro ao atualizar ação:', error);
        }
    }

    /**
     * Limpa fila
     */
    clearQueue(): void {
        this.localStorage.remove(this.QUEUE_KEY);
    }

    /**
     * Conta ações pendentes
     */
    countPending(): number {
        return this.getQueue().length;
    }

    /**
     * Verifica se tem ações pendentes
     */
    hasPendingActions(): boolean {
        return this.countPending() > 0;
    }

    /**
     * Obtém ações por entidade
     */
    getActionsByEntity(entity: PendingAction['entity']): PendingAction[] {
        const queue = this.getQueue();
        return queue.filter(action => action.entity === entity);
    }

    /**
     * Obtém ações por tipo
     */
    getActionsByType(type: PendingAction['type']): PendingAction[] {
        const queue = this.getQueue();
        return queue.filter(action => action.type === type);
    }

    /**
     * Remove ações antigas (mais de 7 dias)
     */
    clearOldActions(daysOld: number = 7): number {
        try {
            const queue = this.getQueue();
            const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

            const filtered = queue.filter(action => action.timestamp > cutoffTime);
            const removed = queue.length - filtered.length;

            if (removed > 0) {
                this.saveQueue(filtered);
            }

            return removed;
        } catch (error) {
            console.error('Erro ao limpar ações antigas:', error);
            return 0;
        }
    }

    /**
     * Remove ações com muitas tentativas falhas
     */
    clearFailedActions(maxAttempts: number = 5): number {
        try {
            const queue = this.getQueue();
            const filtered = queue.filter(action => action.attempts < maxAttempts);
            const removed = queue.length - filtered.length;

            if (removed > 0) {
                this.saveQueue(filtered);
            }

            return removed;
        } catch (error) {
            console.error('Erro ao limpar ações falhas:', error);
            return 0;
        }
    }

    /**
     * Gera ID único
     */
    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}

// Singleton instance
export const offlineStorage = new OfflineStorage();