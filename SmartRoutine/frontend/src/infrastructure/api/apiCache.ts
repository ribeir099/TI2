/**
* Entrada do cache
*/
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

/**
* Opções de cache
*/
export interface CacheOptions {
    ttl?: number; // Time to live em milissegundos
    key?: string; // Chave customizada
}

/**
* Cache simples para requisições de API
*/
export class ApiCache {
    private cache: Map<string, CacheEntry<any>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutos
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    /**
     * Obtém item do cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Verificar se expirou
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Salva item no cache
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const timestamp = Date.now();
        const expiresAt = timestamp + (ttl || this.defaultTTL);

        this.cache.set(key, {
            data,
            timestamp,
            expiresAt
        });
    }

    /**
     * Remove item do cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Limpa todo o cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Limpa entradas expiradas
     */
    clearExpired(): number {
        const now = Date.now();
        let cleared = 0;

        this.cache.forEach((entry, key) => {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                cleared++;
            }
        });

        return cleared;
    }

    /**
     * Verifica se tem item no cache
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        // Verificar se expirou
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Obtém estatísticas do cache
     */
    getStats(): {
        size: number;
        expired: number;
        hitRate: number;
    } {
        const size = this.cache.size;
        const expired = Array.from(this.cache.values()).filter(
            entry => Date.now() > entry.expiresAt
        ).length;

        return {
            size,
            expired,
            hitRate: 0 // TODO: Implementar contador de hits/misses
        };
    }

    /**
     * Gera chave de cache a partir de URL e params
     */
    generateKey(url: string, params?: any): string {
        const paramsString = params ? JSON.stringify(params) : '';
        return `${url}:${paramsString}`;
    }
}

// Singleton instance
export const apiCache = new ApiCache();