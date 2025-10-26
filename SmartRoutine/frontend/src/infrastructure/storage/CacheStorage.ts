import { LocalStorage } from './LocalStorage';

/**
* Entrada do cache com TTL
*/
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
    accessCount: number;
    lastAccess: number;
}

/**
* Estatísticas do cache
*/
export interface CacheStatistics {
    totalEntries: number;
    totalSize: number;
    hitRate: number;
    missRate: number;
    expiredEntries: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
}

/**
* Cache persistente com TTL e LRU
* 
* Responsabilidades:
* - Cache de dados da API
* - Expiração automática (TTL)
* - LRU (Least Recently Used)
* - Estatísticas de uso
*/
export class CacheStorage {
    private localStorage: LocalStorage;
    private defaultTTL: number;
    private maxEntries: number;
    private hits: number = 0;
    private misses: number = 0;

    constructor(
        defaultTTL: number = 5 * 60 * 1000, // 5 minutos
        maxEntries: number = 100
    ) {
        this.localStorage = new LocalStorage('smartroutine_cache_');
        this.defaultTTL = defaultTTL;
        this.maxEntries = maxEntries;
    }

    /**
     * Salva no cache
     */
    set<T>(key: string, data: T, ttl?: number): void {
        try {
            const expiresAt = Date.now() + (ttl || this.defaultTTL);

            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                expiresAt,
                accessCount: 0,
                lastAccess: Date.now()
            };

            // Verificar limite de entradas
            this.enforceMaxEntries();

            this.localStorage.set(key, entry);
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
        }
    }

    /**
     * Obtém do cache
     */
    get<T>(key: string): T | null {
        try {
            const entry = this.localStorage.get<CacheEntry<T>>(key);

            if (!entry) {
                this.misses++;
                return null;
            }

            // Verificar expiração
            if (Date.now() > entry.expiresAt) {
                this.localStorage.remove(key);
                this.misses++;
                return null;
            }

            // Atualizar estatísticas de acesso
            entry.accessCount++;
            entry.lastAccess = Date.now();
            this.localStorage.set(key, entry);

            this.hits++;
            return entry.data;
        } catch (error) {
            console.error('Erro ao obter do cache:', error);
            this.misses++;
            return null;
        }
    }

    /**
     * Obtém ou executa função se não existir (memoização)
     */
    async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        // Tentar obter do cache
        const cached = this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        // Executar função e cachear resultado
        const data = await fetchFn();
        this.set(key, data, ttl);

        return data;
    }

    /**
     * Remove do cache
     */
    remove(key: string): void {
        this.localStorage.remove(key);
    }

    /**
     * Verifica se existe no cache
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Limpa todo o cache
     */
    clear(): void {
        this.localStorage.clear();
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Limpa entradas expiradas
     */
    clearExpired(): number {
        let cleared = 0;
        const keys = this.localStorage.getAllKeys();

        keys.forEach(fullKey => {
            try {
                const key = fullKey.replace('smartroutine_cache_', '');
                const entry = this.localStorage.get<CacheEntry<any>>(key);

                if (entry && Date.now() > entry.expiresAt) {
                    this.localStorage.remove(key);
                    cleared++;
                }
            } catch (error) {
                // Item corrompido, remover
                this.localStorage.remove(fullKey);
                cleared++;
            }
        });

        return cleared;
    }

    /**
     * Invalida cache por padrão
     */
    invalidateByPattern(pattern: string | RegExp): number {
        let invalidated = 0;
        const keys = this.localStorage.getAllKeys();

        keys.forEach(fullKey => {
            const key = fullKey.replace('smartroutine_cache_', '');

            const matches = typeof pattern === 'string'
                ? key.includes(pattern)
                : pattern.test(key);

            if (matches) {
                this.localStorage.remove(key);
                invalidated++;
            }
        });

        return invalidated;
    }

    /**
     * Atualiza TTL de uma entrada
     */
    updateTTL(key: string, ttl: number): boolean {
        try {
            const entry = this.localStorage.get<CacheEntry<any>>(key);

            if (!entry) return false;

            entry.expiresAt = Date.now() + ttl;
            this.localStorage.set(key, entry);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém estatísticas do cache
     */
    getStatistics(): CacheStatistics {
        const keys = this.localStorage.getAllKeys();
        const entries: CacheEntry<any>[] = [];

        keys.forEach(fullKey => {
            try {
                const key = fullKey.replace('smartroutine_cache_', '');
                const entry = this.localStorage.get<CacheEntry<any>>(key);
                if (entry) {
                    entries.push(entry);
                }
            } catch (error) {
                // Ignorar entradas corrompidas
            }
        });

        const totalEntries = entries.length;
        const totalSize = this.localStorage.getUsedSpace();
        const totalRequests = this.hits + this.misses;
        const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
        const missRate = totalRequests > 0 ? (this.misses / totalRequests) * 100 : 0;
        const expiredEntries = entries.filter(e => Date.now() > e.expiresAt).length;

        let oldestEntry: Date | null = null;
        let newestEntry: Date | null = null;

        if (entries.length > 0) {
            const timestamps = entries.map(e => e.timestamp);
            oldestEntry = new Date(Math.min(...timestamps));
            newestEntry = new Date(Math.max(...timestamps));
        }

        return {
            totalEntries,
            totalSize,
            hitRate: Math.round(hitRate),
            missRate: Math.round(missRate),
            expiredEntries,
            oldestEntry,
            newestEntry
        };
    }

    /**
     * Reseta estatísticas
     */
    resetStatistics(): void {
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Força limite de entradas (LRU)
     */
    private enforceMaxEntries(): void {
        const keys = this.localStorage.getAllKeys();

        if (keys.length >= this.maxEntries) {
            // Obter todas as entradas com último acesso
            const entries: Array<{ key: string; lastAccess: number }> = [];

            keys.forEach(fullKey => {
                try {
                    const key = fullKey.replace('smartroutine_cache_', '');
                    const entry = this.localStorage.get<CacheEntry<any>>(key);

                    if (entry) {
                        entries.push({ key, lastAccess: entry.lastAccess });
                    }
                } catch (error) {
                    // Ignorar
                }
            });

            // Ordenar por último acesso (LRU)
            entries.sort((a, b) => a.lastAccess - b.lastAccess);

            // Remover 10% mais antigas
            const toRemove = Math.ceil(entries.length * 0.1);
            entries.slice(0, toRemove).forEach(({ key }) => {
                this.localStorage.remove(key);
            });
        }
    }
}

// Singleton instance
export const cacheStorage = new CacheStorage();