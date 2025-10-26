import { useEffect, useRef } from 'react';
import { APP_NAME } from '@/shared/constants/config';

/**
* Hook para atualizar título do documento
* 
* @param title - Título da página
* @param retainOnUnmount - Se deve manter título ao desmontar (padrão: false)
*/
export function useDocumentTitle(title: string, retainOnUnmount: boolean = false): void {
    const previousTitle = useRef(document.title);

    useEffect(() => {
        document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
    }, [title]);

    useEffect(() => {
        return () => {
            if (!retainOnUnmount) {
                document.title = previousTitle.current;
            }
        };
    }, [retainOnUnmount]);
}