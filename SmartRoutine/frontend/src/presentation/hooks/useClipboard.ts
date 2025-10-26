import { useState, useCallback } from 'react';
import { clipboardService } from '@/infrastructure/external/ClipboardService';

/**
* Hook para clipboard
*/
export function useClipboard(resetDelay: number = 2000) {
    const [copied, setCopied] = useState(false);

    /**
     * Copia texto
     */
    const copy = useCallback(async (text: string): Promise<boolean> => {
        const success = await clipboardService.copyText(text);

        if (success) {
            setCopied(true);

            // Reset após delay
            setTimeout(() => {
                setCopied(false);
            }, resetDelay);
        }

        return success;
    }, [resetDelay]);

    /**
     * Copia JSON
     */
    const copyJSON = useCallback(async (data: any): Promise<boolean> => {
        return await copy(JSON.stringify(data, null, 2));
    }, [copy]);

    /**
     * Reset manual
     */
    const reset = useCallback(() => {
        setCopied(false);
    }, []);

    return {
        copied,
        copy,
        copyJSON,
        reset
    };
}