/**
* Tipos relacionados a Filtros
*/

/**
* Operador de filtro
*/
export type FilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'in'
    | 'notIn'
    | 'between';

/**
* Condição de filtro
*/
export interface FilterCondition<T = any> {
    field: string;
    operator: FilterOperator;
    value: T;
}

/**
* Grupo de filtros (AND/OR)
*/
export interface FilterGroup {
    operator: 'AND' | 'OR';
    conditions: (FilterCondition | FilterGroup)[];
}

/**
* Filtro aplicado
*/
export interface AppliedFilter {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    label: string;
}

/**
* Opções de filtro
*/
export interface FilterOptions {
    filters: AppliedFilter[];
    addFilter: (filter: AppliedFilter) => void;
    removeFilter: (id: string) => void;
    clearFilters: () => void;
    updateFilter: (id: string, updates: Partial<AppliedFilter>) => void;
}

/**
* Preset de filtro
*/
export interface FilterPreset {
    id: string;
    name: string;
    filters: AppliedFilter[];
    isDefault?: boolean;
}

/**
* Campo filtrável
*/
export interface FilterableField {
    field: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    operators: FilterOperator[];
    options?: typeof Option[];
}