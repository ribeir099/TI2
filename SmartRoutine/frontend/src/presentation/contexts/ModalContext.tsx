import React, { createContext, useState, useCallback, ReactNode } from 'react';

/**
* Estado de um modal
*/
interface ModalState {
    id: string;
    isOpen: boolean;
    data?: any;
}

/**
* Dados do contexto de modais
*/
export interface ModalContextData {
    modals: Record<string, ModalState>;
    openModal: (id: string, data?: any) => void;
    closeModal: (id: string) => void;
    closeAllModals: () => void;
    isModalOpen: (id: string) => boolean;
    getModalData: <T = any>(id: string) => T | undefined;
    toggleModal: (id: string, data?: any) => void;
}

/**
* Context de Modais
*/
export const ModalContext = createContext<ModalContextData>({} as ModalContextData);

/**
* Props do Provider
*/
interface ModalProviderProps {
    children: ReactNode;
}

/**
* Provider de Modais
* 
* Responsabilidades:
* - Gerenciar estado de múltiplos modais
* - Controlar abertura/fechamento
* - Passar dados para modais
*/
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modals, setModals] = useState<Record<string, ModalState>>({});

    /**
     * Abre modal
     */
    const openModal = useCallback((id: string, data?: any) => {
        setModals(prev => ({
            ...prev,
            [id]: {
                id,
                isOpen: true,
                data
            }
        }));
    }, []);

    /**
     * Fecha modal
     */
    const closeModal = useCallback((id: string) => {
        setModals(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                isOpen: false,
                data: undefined
            }
        }));
    }, []);

    /**
     * Fecha todos os modais
     */
    const closeAllModals = useCallback(() => {
        setModals(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(id => {
                updated[id] = {
                    ...updated[id],
                    isOpen: false,
                    data: undefined
                };
            });
            return updated;
        });
    }, []);

    /**
     * Verifica se modal está aberto
     */
    const isModalOpen = useCallback((id: string): boolean => {
        return modals[id]?.isOpen || false;
    }, [modals]);

    /**
     * Obtém dados do modal
     */
    const getModalData = useCallback(<T = any,>(id: string): T | undefined => {
        return modals[id]?.data as T;
    }, [modals]);

    /**
     * Toggle modal
     */
    const toggleModal = useCallback((id: string, data?: any) => {
        if (isModalOpen(id)) {
            closeModal(id);
        } else {
            openModal(id, data);
        }
    }, [isModalOpen, closeModal, openModal]);

    const value: ModalContextData = {
        modals,
        openModal,
        closeModal,
        closeAllModals,
        isModalOpen,
        getModalData,
        toggleModal
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};