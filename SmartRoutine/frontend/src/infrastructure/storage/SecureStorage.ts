import { LocalStorage } from './LocalStorage';

/**
* Storage com criptografia simples (XOR)
* 
* Nota: Para produção real, use bibliotecas de criptografia robustas
* como crypto-js ou Web Crypto API
* 
* Responsabilidades:
* - Armazenamento criptografado
* - Proteção de dados sensíveis
* - Ofuscação básica
*/
export class SecureStorage {
    private localStorage: LocalStorage;
    private encryptionKey: string;

    constructor(encryptionKey?: string) {
        this.localStorage = new LocalStorage('smartroutine_secure_');
        this.encryptionKey = encryptionKey || this.generateKey();
    }

    /**
     * Salva item criptografado
     */
    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            const encrypted = this.encrypt(serialized);

            this.localStorage.set(key, encrypted);
        } catch (error) {
            console.error('Erro ao salvar item seguro:', error);
            throw error;
        }
    }

    /**
     * Obtém item descriptografado
     */
    get<T>(key: string): T | null {
        try {
            const encrypted = this.localStorage.get<string>(key);

            if (!encrypted) return null;

            const decrypted = this.decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Erro ao obter item seguro:', error);
            return null;
        }
    }

    /**
     * Remove item
     */
    remove(key: string): void {
        this.localStorage.remove(key);
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
        this.localStorage.clear();
    }

    // ==================== CRIPTOGRAFIA ====================

    /**
     * Criptografa string (XOR simples)
     * AVISO: Use criptografia real em produção!
     */
    private encrypt(text: string): string {
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
            result += String.fromCharCode(charCode);
        }

        // Converter para base64
        return btoa(result);
    }

    /**
     * Descriptografa string
     */
    private decrypt(encryptedText: string): string {
        try {
            // Decodificar de base64
            const decoded = atob(encryptedText);
            let result = '';

            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(charCode);
            }

            return result;
        } catch (error) {
            throw new Error('Erro ao descriptografar dados');
        }
    }

    /**
     * Gera chave de criptografia
     */
    private generateKey(): string {
        return 'smartroutine-encryption-key-' + Date.now();
    }

    /**
     * Atualiza chave de criptografia
     * AVISO: Isso invalidará todos os dados armazenados!
     */
    updateEncryptionKey(newKey: string): void {
        // Descriptografar todos os dados com chave antiga
        const keys = this.localStorage.getAllKeys();
        const data: Record<string, any> = {};

        keys.forEach(fullKey => {
            const key = fullKey.replace('smartroutine_secure_', '');
            const value = this.get(key);
            if (value !== null) {
                data[key] = value;
            }
        });

        // Atualizar chave
        this.encryptionKey = newKey;

        // Re-criptografar todos os dados
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

// Singleton instance
export const secureStorage = new SecureStorage();