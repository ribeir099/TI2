/**
* Tipos relacionados à Navegação
*/

/**
* Rota da aplicação
*/
export interface Route {
    path: string;
    name: string;
    component?: React.ComponentType;
    exact?: boolean;
    protected?: boolean;
    roles?: string[];
    children?: Route[];
    meta?: RouteMeta;
}

/**
* Metadados da rota
*/
export interface RouteMeta {
    title?: string;
    description?: string;
    icon?: string;
    showInMenu?: boolean;
    order?: number;
    breadcrumb?: string;
}

/**
* Parâmetros de navegação
*/
export interface NavigationParams {
    pathname: string;
    search?: string;
    hash?: string;
    state?: any;
}

/**
* Item de navegação
*/
export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    badge?: string | number;
    active?: boolean;
    disabled?: boolean;
    children?: NavigationItem[];
}

/**
* Link de navegação
*/
export interface NavLink {
    to: string;
    label: string;
    icon?: string;
    exact?: boolean;
    external?: boolean;
}

/**
* Histórico de navegação
*/
export interface NavigationHistory {
    entries: NavigationEntry[];
    currentIndex: number;
}

/**
* Entrada de histórico
*/
export interface NavigationEntry {
    pathname: string;
    search: string;
    timestamp: Date;
}