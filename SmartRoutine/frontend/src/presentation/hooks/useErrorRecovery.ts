import { useState, useCallback } from 'react';
import { ErrorRecovery, RecoveryStrategy } from '@/shared/errors/ErrorRecovery';

/**
* Hook para recuperação de erros
*/
export const useErrorRecovery = () => {
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryStrategy, setRecoveryStrategy] = useState<RecoveryStrategy | null>(null);

    /**
     * Tenta recuperar de erro
     */
    const recover = useCallback(async (error: unknown): Promise<boolean> => {
        setIsRecovering(true);

        try {
            const strategy = ErrorRecovery.getRecoveryStrategy(error);
            setRecoveryStrategy(strategy);

            const recovered = await ErrorRecovery.attemptRecovery(error);

            if (!recovered) {
                setIsRecovering(false);
            }

            return recovered;
        } catch (recoveryError) {
            console.error('Erro na recuperação:', recoveryError);
            setIsRecovering(false);
            return false;
        }
    }, []);

    /**
     * Reseta estado de recuperação
     */
    const reset = useCallback(() => {
        setIsRecovering(false);
        setRecoveryStrategy(null);
    }, []);

    return {
        isRecovering,
        recoveryStrategy,
        recover,
        reset,
        canRecover: recoveryStrategy?.canRecover || false
    };
};