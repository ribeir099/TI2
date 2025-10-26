import { LocalStorage } from './LocalStorage';
import { SessionStorage } from './SessionStorage';
import { CacheStorage } from './CacheStorage';
import { SecureStorage } from './SecureStorage';

/**
* Evento de storage
*/
export interface StorageEvent {
    key: string;
    oldValue: any;
    newValue: any;
    timestamp: Date;
    type: 'set' | 'remove' | 'clear';
}

/**
* Listener de eventos
*/
export type StorageEventListener = (event: StorageEvent) => void;

/**
* Gerenciador centralizado de armazenamento
* 
* Responsabilidades:
* - Gerenciar múltiplos storages
* - Monitorar mudanças
* - Manutenção automática
* - Health checks
* - Sincronização entre abas
*/
export class StorageManager {
    [x: string]: any;
    private localStorage: LocalStorage;
    private sessionStorage: SessionStorage;
    private cacheStorage: CacheStorage;
    private secureStorage: SecureStorage;
    private listeners: StorageEventListener[] = [];
    private maintenanceInterval?: NodeJS.Timeout;

    constructor() {
        this.localStorage = new LocalStorage();
        this.sessionStorage = new SessionStorage();
        this.cacheStorage = new CacheStorage();
        this.secureStorage = new SecureStorage();

        // Iniciar manutenção automática
        this.startMaintenance();

        // Escutar eventos de storage (sincronização entre abas)
        this.setupStorageListener();
    }

    /**
     * Obtém storage por tipo
     */
    getStorage(type: 'local' | 'session' | 'cache' | 'secure') {
        switch (type) {
            case 'local':
                return this.localStorage;
            case 'session':
                return this.sessionStorage;
            case 'cache':
                return this.cacheStorage;
            case 'secure':
                return this.secureStorage;
        }
    }

    /**
     * Adiciona listener de eventos
     */
    addEventListener(listener: StorageEventListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remove listener de eventos
     */
    removeEventListener(listener: StorageEventListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Emite evento
     */
    private emitEvent(event: StorageEvent): void {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Erro ao notificar listener:', error);
            }
        });
    }

    /**
     * Inicia manutenção automática
     */
    private startMaintenance(): void {
        // Executar manutenção a cada 10 minutos
        this.maintenanceInterval = setInterval(() => {
            this.runMaintenance();
        }, 10 * 60 * 1000);

        // Executar manutenção inicial
        this.runMaintenance();
    }

    /**
     * Executa manutenção
     */
    runMaintenance(): void {
        try {
            // Limpar dados expirados
            const localCleared = this.localStorage.clearExpired();
            const cacheCleared = this.cacheStorage.clearExpired();

            if (localCleared > 0 || cacheCleared > 0) {
                console.log(`🧹 Manutenção: ${localCleared + cacheCleared} itens expirados removidos`);
            }

            // Verificar quota
            const quotaUsage = this.localStorage.getQuotaUsagePercentage();
            if (quotaUsage > 90) {
                console.warn(`⚠️ Quota de armazenamento alta: ${quotaUsage}%`);
            }
        } catch (error) {
            console.error('Erro na manutenção:', error);
        }
    }

    /**
     * Para manutenção automática
     */
    stopMaintenance(): void {
        if (this.maintenanceInterval) {
            clearInterval(this.maintenanceInterval);
        }
    }

    /**
     * Obtém estatísticas gerais
     */
    getStatistics() {
        return {
            local: {
                count: this.localStorage.count(),
                size: this.localStorage.getUsedSpaceFormatted(),
                quotaUsage: this.localStorage.getQuotaUsagePercentage()
            },
            session: {
                count: this.sessionStorage.count()
            },
            cache: this.cacheStorage.getStatistics()
        };
    }

    /**
     * Health check de todos os storages
     */
    healthCheck(): {
        local: boolean;
        session: boolean;
        overall: boolean;
    } {
        const localAvailable = this.localStorage.isAvailable();
        const sessionAvailable = this.sessionStorage.isAvailable();

        return {
            local: localAvailable,
            session: sessionAvailable,
            overall: localAvailable && sessionAvailable
        };
    }

    /**
     * Exporta todos os dados
     */
    exportAll(): string {
        const data = {
            local: JSON.parse(this.localStorage.export()),
            session: this.sessionStorage.getAll(),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data, null, 2);
    }

    /**
     * Importa todos os dados
     */
    importAll(jsonData: string): void {
        try {
            const data = JSON.parse(jsonData);

            if (data.local) {
                Object.entries(data.local).forEach(([key, value]) => {
                    this.localStorage.set(key, value);
                });
            }

            if (data.session) {
                Object.entries(data.session).forEach(([key, value]) => {
                    this.sessionStorage.set(key, value);
                });
            }
        } catch (error) {
            throw new Error('Erro ao importar dados: JSON inválido');
        }
    }

    /**
     * Limpa todos os dados da aplicação
     */
    clearAllAppData(): void {
        this.localStorage.clear();
        this.sessionStorage.clear();
        this.cacheStorage.clear();
        this.secureStorage.clear();

        console.log('🧹 Todos os dados da aplicação foram limpos');
    }

    /**
     * Escuta eventos de storage (sincronização entre abas)
     */
    private setupStorageListener(): void {
        if (typeof window === 'undefined') return;

        window.addEventListener('storage', (event) => {
            if (!event.key || !event.key.startsWith('smartroutine_')) {
                return;
            }

            const key = event.key.replace(/^smartroutine_/, '');

            let oldValue: any = null;
            let newValue: any = null;

            try {
                if (event.oldValue) {
                    oldValue = JSON.parse(event.oldValue);
                }
                if (event.newValue) {
                    newValue = JSON.parse(event.newValue);
                }
            } catch (error) {
                // Valores não são JSON
            }

            this.emitEvent({
                key,
                oldValue: oldValue?.value,
                newValue: newValue?.value,
                timestamp: new Date(),
                type: newValue ? 'set' : 'remove'
            });
        });
    }

    /**
     * Destroy (cleanup)
     */
    destroy(): void {
        this.stopMaintenance();
        this.listeners = [];
    }
}

// Singleton instance
export const storageManager = new StorageManager();