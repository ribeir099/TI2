import { useState, useCallback } from 'react';

/**
* Hook para gerenciar estado de disclosure (modal, drawer, etc)
*/
export function useDisclosure(initialState: boolean = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return {
        isOpen,
        open,
        close,
        toggle,
        onOpen: open,
        onClose: close,
        onToggle: toggle
    };
}