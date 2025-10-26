import React from 'react';
import { Alignment, ComponentSize, ComponentVariant, NotificationType, Position } from './general.types';
import { InputType } from 'zlib';

/**
* Tipos relacionados a Componentes
*/

/**
* Props básicas de componente
*/
export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    id?: string;
    testId?: string;
}

/**
* Props de componente com ref
*/
export interface ComponentWithRef<T = HTMLElement> extends BaseComponentProps {
    ref?: React.Ref<T>;
}

/**
* Props de componente com loading
*/
export interface LoadableComponentProps extends BaseComponentProps {
    isLoading?: boolean;
    loadingText?: string;
}

/**
* Props de componente com erro
*/
export interface ErrorableComponentProps extends BaseComponentProps {
    error?: string | Error | null;
    onErrorDismiss?: () => void;
}

/**
* Props de modal/dialog
*/
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
}

/**
* Props de card
*/
export interface CardProps extends BaseComponentProps {
    title?: string;
    description?: string;
    image?: string;
    footer?: React.ReactNode;
    header?: React.ReactNode;
    hoverable?: boolean;
    clickable?: boolean;
    onClick?: () => void;
}

/**
* Props de lista
*/
export interface ListProps<T> extends BaseComponentProps {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T, index: number) => string;
    emptyMessage?: string;
    loading?: boolean;
    onItemClick?: (item: T) => void;
}

/**
* Props de tabela
*/
export interface TableProps<T> extends BaseComponentProps {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    selectable?: boolean;
    selectedRows?: T[];
    onSelectionChange?: (rows: T[]) => void;
}

/**
* Coluna de tabela
*/
export interface TableColumn<T = any> {
    key: string;
    label: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    accessor?: keyof T | ((row: T) => any);
}

/**
* Props de formulário
*/
export interface FormProps extends BaseComponentProps {
    onSubmit: (values: any) => void | Promise<void>;
    initialValues?: any;
    validationSchema?: any;
    loading?: boolean;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
    showCancelButton?: boolean;
}

/**
* Props de input
*/
export interface InputProps extends BaseComponentProps {
    name: string;
    label?: string;
    type?: InputType;
    value?: any;
    defaultValue?: any;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: string;
    helperText?: string;
    onChange?: (value: any) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}

/**
* Props de button
*/
export interface ButtonProps extends BaseComponentProps {
    type?: 'button' | 'submit' | 'reset';
    variant?: ComponentVariant;
    size?: ComponentSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
* Props de badge
*/
export interface BadgeProps extends BaseComponentProps {
    variant?: ComponentVariant;
    size?: ComponentSize;
    dot?: boolean;
    count?: number;
    max?: number;
    showZero?: boolean;
}

/**
* Props de toast/notification
*/
export interface ToastProps {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose?: () => void;
}

/**
* Props de skeleton
*/
export interface SkeletonProps extends BaseComponentProps {
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
}

/**
* Props de avatar
*/
export interface AvatarProps extends BaseComponentProps {
    src?: string;
    alt?: string;
    size?: ComponentSize;
    name?: string;
    fallback?: string;
    onClick?: () => void;
}

/**
* Props de dropdown
*/
export interface DropdownProps extends BaseComponentProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    position?: Position;
    align?: Alignment;
}

/**
* Item de dropdown
*/
export interface DropdownItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
    separator?: boolean;
}