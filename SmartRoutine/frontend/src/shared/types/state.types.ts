/**
* Tipos relacionados a Estado
*/

import { SortOrder, Theme, Language, Density } from "./general.types";
import { ToastProps } from "./component.types";

/**
* Estado de loading
*/
export interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
}

/**
* Estado de erro
*/
export interface ErrorState {
    hasError: boolean;
    error: Error | null;
    errorMessage?: string;
}

/**
* Estado de sucesso
*/
export interface SuccessState {
    isSuccess: boolean;
    successMessage?: string;
}

/**
* Estado de requisição assíncrona
*/
export interface AsyncState<T = any> extends LoadingState, ErrorState {
    data: T | null;
    isSuccess: boolean;
}

/**
* Estado de modal
*/
export interface ModalState {
    isOpen: boolean;
    data?: any;
}

/**
* Estado de confirmação
*/
export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

/**
* Estado de paginação
*/
export interface PaginationState {
    page: number;
    limit: number;
    total: number;
}

/**
* Estado de ordenação
*/
export interface SortState {
    field: string;
    order: SortOrder;
}

/**
* Estado de filtro
*/
export interface FilterState<T = any> {
    filters: T;
    activeFiltersCount: number;
}

/**
* Estado de busca
*/
export interface SearchState {
    query: string;
    isSearching: boolean;
    results: any[];
}

/**
* Estado de seleção
*/
export interface SelectionState<T = any> {
    selected: T[];
    isAllSelected: boolean;
}

/**
* Estado de UI
*/
export interface UIState {
    theme: Theme;
    language: Language;
    density: Density;
    sidebarCollapsed: boolean;
    notifications: ToastProps[];
}

/**
* Estado de autenticação
*/
export interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
    isLoading: boolean;
}

/**
* Store actions
*/
export interface StoreActions<T> {
    set: (state: Partial<T>) => void;
    reset: () => void;
    update: (updater: (state: T) => Partial<T>) => void;
}