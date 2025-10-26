/**
* Informações de quota
*/
export interface QuotaInfo {
    usage: number;
    quota: number;
    available: number;
    percentageUsed: number;
    isNearLimit: boolean;
    isCritical: boolean;
}

/**
* Gerenciador de Quota de Armazenamento
* 
* Responsabilidades:
* - Monitorar uso de quota
* - Alertar quando próximo do limite
* - Liberar espaço automaticamente
*/
export class StorageQuotaManager {
    private readonly NEAR_LIMIT_THRESHOLD = 80; // 80%
    private readonly CRITICAL_THRESHOLD = 95;   // 95%

    /**
     * Obtém informações de quota (Storage API)
     */
    async getQuotaInfo(): Promise<QuotaInfo | null> {
        if (!navigator.storage || !navigator.storage.estimate) {
            return this.getEstimatedQuotaInfo();
        }

        try {
            const estimate = await navigator.storage.estimate();
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;
            const available = quota - usage;
            const percentageUsed = quota > 0 ? (usage / quota) * 100 : 0;

            return {
                usage,
                quota,
                available,
                percentageUsed: Math.round(percentageUsed),
                isNearLimit: percentageUsed >= this.NEAR_LIMIT_THRESHOLD,
                isCritical: percentageUsed >= this.CRITICAL_THRESHOLD
            };
        } catch (error) {
            console.error('Erro ao obter quota:', error);
            return this.getEstimatedQuotaInfo();
        }
    }

    /**
     * Obtém informações estimadas (fallback)
     */
    private getEstimatedQuotaInfo(): QuotaInfo {
        const ESTIMATED_QUOTA = 5 * 1024 * 1024; // 5MB
        let usage = 0;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const item = localStorage.getItem(key);
                    if (item) {
                        usage += item.length * 2; // UTF-16
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao estimar uso:', error);
        }

        const percentageUsed = (usage / ESTIMATED_QUOTA) * 100;

        return {
            usage,
            quota: ESTIMATED_QUOTA,
            available: ESTIMATED_QUOTA - usage,
            percentageUsed: Math.round(percentageUsed),
            isNearLimit: percentageUsed >= this.NEAR_LIMIT_THRESHOLD,
            isCritical: percentageUsed >= this.CRITICAL_THRESHOLD
        };
    }

    /**
     * Verifica se próximo do limite
     */
    async isNearLimit(): Promise<boolean> {
        const info = await this.getQuotaInfo();
        return info ? info.isNearLimit : false;
    }

    /**
     * Verifica se em nível crítico
     */
    async isCritical(): Promise<boolean> {
        const info = await this.getQuotaInfo();
        return info ? info.isCritical : false;
    }

    /**
     * Formata bytes para leitura humana
     */
    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    }

    /**
     * Obtém relatório de uso
     */
    async getUsageReport(): Promise<{
        quota: QuotaInfo | null;
        breakdown: {
            tokens: number;
            cache: number;
            preferences: number;
            other: number;
        };
        recommendations: string[];
    }> {
        const quota = await this.getQuotaInfo();
        const breakdown = this.calculateBreakdown();
        const recommendations = this.generateRecommendations(quota, breakdown);

        return {
            quota,
            breakdown,
            recommendations
        };
    }

    /**
     * Calcula breakdown de uso por categoria
     */
    private calculateBreakdown(): {
        tokens: number;
        cache: number;
        preferences: number;
        other: number;
    } {
        let tokens = 0;
        let cache = 0;
        let preferences = 0;
        let other = 0;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                const item = localStorage.getItem(key);
                if (!item) continue;

                const size = item.length * 2;

                if (key.includes('token')) {
                    tokens += size;
                } else if (key.includes('cache')) {
                    cache += size;
                } else if (key.includes('preferences')) {
                    preferences += size;
                } else {
                    other += size;
                }
            }
        } catch (error) {
            console.error('Erro ao calcular breakdown:', error);
        }

        return { tokens, cache, preferences, other };
    }

    /**
     * Gera recomendações baseadas no uso
     */
    private generateRecommendations(
        quota: QuotaInfo | null,
        breakdown: any
    ): string[] {
        const recommendations: string[] = [];

        if (!quota) return recommendations;

        if (quota.isCritical) {
            recommendations.push('🚨 Espaço crítico! Limpe o cache urgentemente.');
        } else if (quota.isNearLimit) {
            recommendations.push('⚠️ Espaço próximo do limite. Considere limpar dados antigos.');
        }

        if (breakdown.cache > breakdown.tokens + breakdown.preferences) {
            recommendations.push('💡 Cache está usando mais espaço. Considere limpar cache antigo.');
        }

        if (quota.percentageUsed < 50) {
            recommendations.push('✅ Espaço de armazenamento saudável.');
        }

        return recommendations;
    }
}

// Singleton instance
export const storageQuotaManager = new StorageQuotaManager();