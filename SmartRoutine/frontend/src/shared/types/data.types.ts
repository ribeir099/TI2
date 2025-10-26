/**
* Tipos relacionados a Dados
*/

import { SortOrder, ID, ImportFormat, ExportFormat } from "./general.types";

/**
* Dados de criação (base)
*/
export interface CreateData {
    [key: string]: any;
}

/**
* Dados de atualização (base)
*/
export interface UpdateData {
    [key: string]: any;
}

/**
* Dados de filtro (base)
*/
export interface FilterData {
    [key: string]: any;
}

/**
* Dados de busca
*/
export interface SearchData {
    query: string;
    filters?: FilterData;
    sortBy?: string;
    sortOrder?: SortOrder;
}

/**
* Resultado de busca
*/
export interface SearchResult<T> {
    items: T[];
    total: number;
    query: string;
    hasMore: boolean;
}

/**
* Item com score (para ranking)
*/
export interface ScoredItem<T> {
    item: T;
    score: number;
}

/**
* Comparação de itens
*/
export interface Comparison<T> {
    item1: T;
    item2: T;
    differences: string[];
    similarity: number;
}

/**
* Histórico de mudanças
*/
export interface ChangeHistory<T> {
    timestamp: Date;
    field: keyof T;
    oldValue: any;
    newValue: any;
    changedBy?: string;
}

/**
* Auditoria
*/
export interface AuditLog {
    id: string;
    entityType: string;
    entityId: ID;
    action: 'create' | 'update' | 'delete';
    changes: Record<string, { old: any; new: any }>;
    userId: string;
    timestamp: Date;
    ip?: string;
    userAgent?: string;
}

/**
* Backup de dados
*/
export interface DataBackup {
    version: string;
    timestamp: string;
    data: any;
    checksum?: string;
}

/**
* Configuração de importação
*/
export interface ImportConfig {
    format: ImportFormat;
    encoding?: string;
    delimiter?: string;
    hasHeader?: boolean;
    skipRows?: number;
    mapping?: Record<string, string>;
}

/**
* Configuração de exportação
*/
export interface ExportConfig {
    format: ExportFormat;
    fields?: string[];
    includeHeaders?: boolean;
    filename?: string;
    filters?: FilterData;
}