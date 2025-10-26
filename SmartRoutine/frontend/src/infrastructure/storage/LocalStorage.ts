/**
* Opções de armazenamento
*/
export interface StorageOptions {
    encrypt?: boolean;
    expiresIn?: number; // Tempo de expiração em ms
}

/**
* Item armazenado com metadados
*/
interface StorageItem<T> {
    value: T;
    timestamp: number;
    expiresAt?: number;
    encrypted?: boolean;
}

/**
* Wrapper para localStorage com funcionalidades extras
* 
* Responsabilidades:
* - Armazenamento type-safe
* - Serialização automática
* - Expiração de dados
* - Tratamento de erros
* - Quota management
*/
export class LocalStorage {
    private prefix: string;

    constructor(prefix: string = 'smartroutine_') {
        this.prefix = prefix;

        // Verificar se localStorage está disponível
        if (!this.isAvailable()) {
            console.warn('localStorage não está disponível');
        }
    }

    /**
     * Verifica se localStorage está disponível
     */
    isAvailable(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Salva item no storage
     */
    set<T>(key: string, value: T, options: StorageOptions = {}): void {
        if (!this.isAvailable()) {
            throw new Error('localStorage não está disponível');
        }

        try {
            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined,
                encrypted: options.encrypt
            };

            const serialized = JSON.stringify(item);

            // Verificar quota antes de salvar
            this.checkQuota(serialized);

            const fullKey = this.getFullKey(key);
            localStorage.setItem(fullKey, serialized);
        } catch (error) {
            if (this.isQuotaExceededError(error)) {
                console.error('Quota de armazenamento excedida');
                // Tentar limpar dados expirados
                this.clearExpired();
                // Tentar novamente
                try {
                    const item: StorageItem<T> = {
                        value,
                        timestamp: Date.now(),
                        expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined
                    };
                    localStorage.setItem(this.getFullKey(key), JSON.stringify(item));
                } catch (retryError) {
                    throw new Error('Não foi possível salvar: quota excedida');
                }
            } else {
                throw error;
            }
        }
    }

    /**
     * Obtém item do storage
     */
    get<T>(key: string): T | null {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            const fullKey = this.getFullKey(key);
            const serialized = localStorage.getItem(fullKey);

            if (!serialized) {
                return null;
            }

            const item: StorageItem<T> = JSON.parse(serialized);

            // Verificar expiração
            if (item.expiresAt && Date.now() > item.expiresAt) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.error(`Erro ao obter item ${key}:`, error);
            return null;
        }
    }

    /**
     * Remove item do storage
     */
    remove(key: string): void {
        if (!this.isAvailable()) return;

        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
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
     * Limpa todos os itens com o prefixo
     */
    clear(): void {
        if (!this.isAvailable()) return;

        try {
            const keys = this.getAllKeys();
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Erro ao limpar storage:', error);
        }
    }

    /**
     * Limpa itens expirados
     */
    clearExpired(): number {
        if (!this.isAvailable()) return 0;

        let cleared = 0;

        try {
            const keys = this.getAllKeys();

            keys.forEach(fullKey => {
                try {
                    const serialized = localStorage.getItem(fullKey);
                    if (!serialized) return;

                    const item: StorageItem<any> = JSON.parse(serialized);

                    if (item.expiresAt && Date.now() > item.expiresAt) {
                        localStorage.removeItem(fullKey);
                        cleared++;
                    }
                } catch (error) {
                    // Item corrompido, remover
                    localStorage.removeItem(fullKey);
                    cleared++;
                }
            });
        } catch (error) {
            console.error('Erro ao limpar itens expirados:', error);
        }

        return cleared;
    }

    /**
     * Lista todas as chaves com o prefixo
     */
    getAllKeys(): string[] {
        if (!this.isAvailable()) return [];

        try {
            const keys: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }

            return keys;
        } catch (error) {
            console.error('Erro ao listar chaves:', error);
            return [];
        }
    }

    /**
     * Obtém todos os itens
     */
    getAll(): Record<string, any> {
        if (!this.isAvailable()) return {};

        try {
            const items: Record<string, any> = {};
            const keys = this.getAllKeys();

            keys.forEach(fullKey => {
                try {
                    const serialized = localStorage.getItem(fullKey);
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
        } catch (error) {
            console.error('Erro ao obter todos os itens:', error);
            return {};
        }
    }

    /**
     * Conta total de itens
     */
    count(): number {
        return this.getAllKeys().length;
    }

    /**
     * Obtém tamanho usado em bytes
     */
    getUsedSpace(): number {
        if (!this.isAvailable()) return 0;

        try {
            let totalSize = 0;
            const keys = this.getAllKeys();

            keys.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    totalSize += item.length * 2; // UTF-16 = 2 bytes por char
                }
            });

            return totalSize;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Obtém tamanho usado formatado
     */
    getUsedSpaceFormatted(): string {
        const bytes = this.getUsedSpace();

        if (bytes < 1024) {
            return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
    }

    /**
     * Obtém porcentagem de quota usada (estimativa)
     */
    getQuotaUsagePercentage(): number {
        const ESTIMATED_QUOTA = 5 * 1024 * 1024; // 5MB (típico)
        const used = this.getUsedSpace();
        return Math.round((used / ESTIMATED_QUOTA) * 100);
    }

    /**
     * Exporta dados para backup
     */
    export(): string {
        const data = this.getAll();
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importa dados de backup
     */
    import(jsonData: string): void {
        try {
            const data = JSON.parse(jsonData);

            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
        } catch (error) {
            throw new Error('Erro ao importar dados: JSON inválido');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Obtém chave completa com prefixo
     */
    private getFullKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    /**
     * Verifica se erro é de quota excedida
     */
    private isQuotaExceededError(error: any): boolean {
        return (
            error instanceof DOMException &&
            (error.name === 'QuotaExceededError' ||
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        );
    }

    /**
     * Verifica quota antes de salvar
     */
    private checkQuota(data: string): void {
        const estimatedSize = data.length * 2; // UTF-16
        const currentSize = this.getUsedSpace();
        const ESTIMATED_QUOTA = 5 * 1024 * 1024; // 5MB

        if (currentSize + estimatedSize > ESTIMATED_QUOTA * 0.9) {
            console.warn('Quota de armazenamento quase cheia (>90%)');
        }
    }
}