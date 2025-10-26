/**
* Item armazenado com metadados
*/
interface StorageItem<T> {
    value: T;
    timestamp: number;
}

/**
* Wrapper para sessionStorage
* 
* Responsabilidades:
* - Armazenamento temporário (sessão do navegador)
* - Serialização automática
* - Type-safe
* - Útil para dados temporários
*/
export class SessionStorage {
    [x: string]: any;
    private prefix: string;

    constructor(prefix: string = 'smartroutine_session_') {
        this.prefix = prefix;

        if (!this.isAvailable()) {
            console.warn('sessionStorage não está disponível');
        }
    }

    /**
     * Verifica se sessionStorage está disponível
     */
    isAvailable(): boolean {
        try {
            const test = '__session_storage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Salva item
     */
    set<T>(key: string, value: T): void {
        if (!this.isAvailable()) {
            throw new Error('sessionStorage não está disponível');
        }

        try {
            const item: StorageItem<T> = {
                value,
                timestamp: Date.now()
            };

            const serialized = JSON.stringify(item);
            const fullKey = this.getFullKey(key);

            sessionStorage.setItem(fullKey, serialized);
        } catch (error) {
            console.error(`Erro ao salvar item ${key}:`, error);
            throw error;
        }
    }

    /**
     * Obtém item
     */
    get<T>(key: string): T | null {
        if (!this.isAvailable()) return null;

        try {
            const fullKey = this.getFullKey(key);
            const serialized = sessionStorage.getItem(fullKey);

            if (!serialized) return null;

            const item: StorageItem<T> = JSON.parse(serialized);
            return item.value;
        } catch (error) {
            console.error(`Erro ao obter item ${key}:`, error);
            return null;
        }
    }

    /**
     * Remove item
     */
    remove(key: string): void {
        if (!this.isAvailable()) return;

        try {
            const fullKey = this.getFullKey(key);
            sessionStorage.removeItem(fullKey);
        } catch (error) {
            console.error(`Erro ao remover item ${key}:`, error);
        }
    }

    /**
     * Verifica se item existe
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Limpa todos os itens
     */
    clear(): void {
        if (!this.isAvailable()) return;

        try {
            const keys = this.getAllKeys();
            keys.forEach(key => sessionStorage.removeItem(key));
        } catch (error) {
            console.error('Erro ao limpar sessionStorage:', error);
        }
    }

    /**
     * Lista todas as chaves
     */
    getAllKeys(): string[] {
        if (!this.isAvailable()) return [];

        try {
            const keys: string[] = [];

            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }

            return keys;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtém todos os itens
     */
    getAll(): Record<string, any> {
        if (!this.isAvailable()) return {};

        const items: Record<string, any> = {};
        const keys = this.getAllKeys();

        keys.forEach(fullKey => {
            try {
                const serialized = sessionStorage.getItem(fullKey);
                if (serialized) {
                    const item: StorageItem<any> = JSON.parse(serialized);
                    const key = fullKey.replace(this.prefix, '');
                    items[key] = item.value;
                }
            } catch (error) {
                console.error(`Erro ao obter item ${fullKey}:`, error);
            }
        });

        return items;
    }

    /**
     * Conta total de itens
     */
    count(): number {
        return this.getAllKeys().length;
    }

    /**
     * Obtém chave completa
     */
    private getFullKey(key: string): string {
        return `${this.prefix}${key}`;
    }
}

// Singleton instance
export const sessionStorage = new SessionStorage();