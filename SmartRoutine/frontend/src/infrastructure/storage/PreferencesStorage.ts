import { LocalStorage } from './LocalStorage';

/**
* Preferências da aplicação
*/
export interface AppPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US' | 'es-ES';
    density: 'comfortable' | 'compact';
    notifications: {
        email: boolean;
        push: boolean;
        expiration: boolean;
        newRecipes: boolean;
    };
    privacy: {
        publicProfile: boolean;
        showEmail: boolean;
        showRecipes: boolean;
    };
    dietary: {
        restrictions: string[];
        allergies: string[];
        preferences: string[];
    };
}

/**
* Storage específico para preferências do usuário
* 
* Responsabilidades:
* - Gerenciar preferências
* - Validar preferências
* - Migração de versões
* - Defaults
*/
export class PreferencesStorage {
    private localStorage: LocalStorage;
    private readonly PREFERENCES_KEY = 'user_preferences';
    private readonly VERSION = '1.0';

    constructor() {
        this.localStorage = new LocalStorage();
    }

    /**
     * Salva preferências
     */
    setPreferences(userId: string, preferences: Partial<AppPreferences>): void {
        try {
            const current = this.getPreferences(userId);
            const updated = this.mergePreferences(current, preferences);

            const key = `${this.PREFERENCES_KEY}_${userId}`;
            this.localStorage.set(key, {
                version: this.VERSION,
                preferences: updated,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
        }
    }

    /**
     * Obtém preferências
     */
    getPreferences(userId: string): AppPreferences {
        try {
            const key = `${this.PREFERENCES_KEY}_${userId}`;
            const stored = this.localStorage.get<any>(key);

            if (!stored) {
                return this.getDefaultPreferences();
            }

            // Verificar versão e migrar se necessário
            if (stored.version !== this.VERSION) {
                return this.migratePreferences(stored.preferences);
            }

            return stored.preferences;
        } catch (error) {
            console.error('Erro ao obter preferências:', error);
            return this.getDefaultPreferences();
        }
    }

    /**
     * Atualiza preferência específica
     */
    updatePreference<K extends keyof AppPreferences>(
        userId: string,
        key: K,
        value: AppPreferences[K]
    ): void {
        const preferences = this.getPreferences(userId);
        preferences[key] = value;
        this.setPreferences(userId, preferences);
    }

    /**
     * Reseta para padrão
     */
    resetToDefault(userId: string): void {
        const defaults = this.getDefaultPreferences();
        this.setPreferences(userId, defaults);
    }

    /**
     * Remove preferências
     */
    removePreferences(userId: string): void {
        const key = `${this.PREFERENCES_KEY}_${userId}`;
        this.localStorage.remove(key);
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Obtém preferências padrão
     */
    private getDefaultPreferences(): AppPreferences {
        return {
            theme: 'auto',
            language: 'pt-BR',
            density: 'comfortable',
            notifications: {
                email: true,
                push: false,
                expiration: true,
                newRecipes: true
            },
            privacy: {
                publicProfile: false,
                showEmail: false,
                showRecipes: true
            },
            dietary: {
                restrictions: [],
                allergies: [],
                preferences: []
            }
        };
    }

    /**
     * Mescla preferências
     */
    private mergePreferences(
        current: AppPreferences,
        updates: Partial<AppPreferences>
    ): AppPreferences {
        return {
            theme: updates.theme || current.theme,
            language: updates.language || current.language,
            density: updates.density || current.density,
            notifications: {
                ...current.notifications,
                ...(updates.notifications || {})
            },
            privacy: {
                ...current.privacy,
                ...(updates.privacy || {})
            },
            dietary: {
                ...current.dietary,
                ...(updates.dietary || {})
            }
        };
    }

    /**
     * Migra preferências de versão antiga
     */
    private migratePreferences(oldPreferences: any): AppPreferences {
        // Implementar lógica de migração conforme necessário
        const defaults = this.getDefaultPreferences();

        return {
            ...defaults,
            ...oldPreferences
        };
    }
}

// Singleton instance
export const preferencesStorage = new PreferencesStorage();