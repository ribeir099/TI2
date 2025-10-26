/**
* Tipos Comuns Reutilizáveis
*/

import { ComponentVariant } from "./general.types";

/**
* Coordenadas geográficas
*/
export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

/**
* Endereço
*/
export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

/**
* Range genérico
*/
export interface Range<T = number> {
    min: T;
    max: T;
}

/**
* Point (2D)
*/
export interface Point {
    x: number;
    y: number;
}

/**
* Size/Dimensions
*/
export interface Size {
    width: number;
    height: number;
}

/**
* Rectangle
*/
export interface Rectangle extends Point, Size { }

/**
* Timespan
*/
export interface TimeSpan {
    start: Date | string;
    end: Date | string;
}

/**
* DateRange
*/
export interface DateRange {
    startDate: string;
    endDate: string;
}

/**
* KeyValue pair
*/
export interface KeyValue<K = string, V = any> {
    key: K;
    value: V;
}

/**
* LabelValue pair (para selects)
*/
export interface LabelValue<T = string> {
    label: string;
    value: T;
}

/**
* MenuItem
*/
export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    path?: string;
    onClick?: () => void;
    children?: MenuItem[];
    disabled?: boolean;
    badge?: string | number;
}

/**
* Breadcrumb
*/
export interface Breadcrumb {
    label: string;
    path: string;
    isActive?: boolean;
}

/**
* Tab
*/
export interface Tab {
    id: string;
    label: string;
    content?: React.ReactNode;
    icon?: string;
    disabled?: boolean;
    badge?: string | number;
}

/**
* Action button
*/
export interface Action {
    label: string;
    onClick: () => void;
    icon?: string;
    variant?: ComponentVariant;
    disabled?: boolean;
    loading?: boolean;
}

/**
* Metadata genérico
*/
export interface Metadata {
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    version?: number;
}

/**
* Timestamps
*/
export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

/**
* Soft delete
*/
export interface SoftDelete {
    deletedAt: string | null;
    deletedBy?: string | null;
}

/**
* Auditable
*/
export interface Auditable extends Timestamps {
    createdBy: string;
    updatedBy: string;
}