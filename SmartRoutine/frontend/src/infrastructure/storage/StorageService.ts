import { LocalStorage } from './LocalStorage';
import { SessionStorage } from './SessionStorage';
import { CacheStorage } from './CacheStorage';

/**
* Tipo de storage
*/
export type StorageType = 'local' | 'session' | 'cache';

/**
* Serviço unificado de armazenamento
* 
* Responsabilidades:
* - Interface unificada para todos os tipos de storage
* - Abstração de implementação
* - Migração de dados
* - Sincronização
*/
export class StorageService {
    private localStorage: LocalStorage;
    private sessionStorage: SessionStorage;
    private cacheStorage: CacheStorage;

    constructor() {
        this.localStorage = new LocalStorage();
        this.sessionStorage = new SessionStorage();
        this.cacheStorage = new CacheStorage();
    }

    /**
     * Salva item no storage especificado
     */
    set<T>(type: StorageType, key: string, value: T, ttl?: number): void {
        switch (type) {
            case 'local':
                this.localStorage.set(key, value, ttl ? { expiresIn: ttl } : undefined);
                break;
            case 'session':
                this.sessionStorage.set(key, value);
                break;
            case 'cache':
                this.cacheStorage.set(key, value, ttl);
                break;
        }
    }

    /**
     * Obtém item do storage
     */
    get<T>(type: StorageType, key: string): T | null {
        switch (type) {
            case 'local':
                return this.localStorage.get<T>(key);
            case 'session':
                return this.sessionStorage.get<T>(key);
            case 'cache':
                return this.cacheStorage.get<T>(key);
        }
    }

    /**
     * Remove item
     */
    remove(type: StorageType, key: string): void {
        switch (type) {
            case 'local':
                this.localStorage.remove(key);
                break;
            case 'session':
                this.sessionStorage.remove(key);
                break;
            case 'cache':
                this.cacheStorage.remove(key);
                break;
        }
    }

    /**
     * Verifica se item existe
     */
    has(type: StorageType, key: string): boolean {
        switch (type) {
            case 'local':
                return this.localStorage.has(key);
            case 'session':
                return this.sessionStorage.has(key);
            case 'cache':
                return this.cacheStorage.has(key);
        }
    }

    /**
     * Limpa storage
     */
    clear(type: StorageType): void {
        switch (type) {
            case 'local':
                this.localStorage.clear();
                break;
            case 'session':
                this.sessionStorage.clear();
                break;
            case 'cache':
                this.cacheStorage.clear();
                break;
        }
    }

    /**
     * Limpa todos os storages
     */
    clearAll(): void {
        this.localStorage.clear();
        this.sessionStorage.clear();
        this.cacheStorage.clear();
    }

    /**
     * Migra dados de um storage para outro
     */
    migrate(
        fromType: StorageType,
        toType: StorageType,
        keys?: string[]
    ): void {
        const keysToMigrate = keys || this.getAllKeys(fromType);

        keysToMigrate.forEach(key => {
            const value = this.get(fromType, key);

            if (value !== null) {
                this.set(toType, key, value);
            }
        });
    }

    /**
     * Sincroniza dados entre storages
     */
    sync(sourceType: StorageType, targetType: StorageType): void {
        const sourceKeys = this.getAllKeys(sourceType);

        sourceKeys.forEach(key => {
            const value = this.get(sourceType, key);

            if (value !== null) {
                this.set(targetType, key, value);
            }
        });
    }

    /**
     * Lista todas as chaves de um storage
     */
    getAllKeys(type: StorageType): string[] {
        switch (type) {
            case 'local':
                return this.localStorage.getAllKeys().map(k =>
                    k.replace('smartroutine_', '')
                );
            case 'session':
                return this.sessionStorage.getAllKeys().map(k =>
                    k.replace('smartroutine_session_', '')
                );
            case 'cache':
                return this.cacheStorage['localStorage'].getAllKeys().map(k =>
                    k.replace('smartroutine_cache_', '')
                );
        }
    }

    /**
     * Obtém estatísticas de todos os storages
     */
    getAllStatistics(): {
        local: { count: number; size: string };
        session: { count: number };
        cache: any;
    } {
        return {
            local: {
                count: this.localStorage.count(),
                size: this.localStorage.getUsedSpaceFormatted()
            },
            session: {
                count: this.sessionStorage.count()
            },
            cache: this.cacheStorage.getStatistics()
        };
    }

    /**
     * Limpa dados expirados de todos os storages
     */
    clearAllExpired(): number {
        const localCleared = this.localStorage.clearExpired();
        const cacheCleared = this.cacheStorage.clearExpired();

        return localCleared + cacheCleared;
    }

    /**
     * Exporta todos os dados
     */
    exportAll(): {
        local: string;
        session: string;
        timestamp: string;
    } {
        return {
            local: this.localStorage.export(),
            session: JSON.stringify(this.sessionStorage.getAll(), null, 2),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Importa dados
     */
    importAll(data: { local?: string; session?: string }): void {
        if (data.local) {
            this.localStorage.import(data.local);
        }

        if (data.session) {
            const sessionData = JSON.parse(data.session);
            Object.entries(sessionData).forEach(([key, value]) => {
                this.sessionStorage.set(key, value);
            });
        }
    }
}

// Singleton instance
export const storageService = new StorageService();