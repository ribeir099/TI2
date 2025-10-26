import { useState, useEffect } from 'react';
import { storageQuotaManager, QuotaInfo } from '@/infrastructure/storage';

/**
* Hook para monitorar quota de armazenamento
*/
export function useStorageQuota() {
    const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuotaInfo = async () => {
            try {
                const info = await storageQuotaManager.getQuotaInfo();
                setQuotaInfo(info);
            } catch (error) {
                console.error('Erro ao carregar quota:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuotaInfo();

        // Atualizar a cada minuto
        const interval = setInterval(loadQuotaInfo, 60000);

        return () => clearInterval(interval);
    }, []);

    return {
        quotaInfo,
        isLoading,
        isNearLimit: quotaInfo?.isNearLimit || false,
        isCritical: quotaInfo?.isCritical || false,
        percentageUsed: quotaInfo?.percentageUsed || 0,
        formattedUsage: quotaInfo ? storageQuotaManager.formatBytes(quotaInfo.usage) : '0 B',
        formattedQuota: quotaInfo ? storageQuotaManager.formatBytes(quotaInfo.quota) : '0 B'
    };
}