/**
* Tipos de Resposta
*/

import { DateRange } from "react-day-picker";
import { ExportFormat, ID } from "./general.types";

/**
* Resposta de operação genérica
*/
export interface OperationResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
* Resposta de criação
*/
export interface CreateResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    id: ID;
}

/**
* Resposta de atualização
*/
export interface UpdateResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

/**
* Resposta de deleção
*/
export interface DeleteResponse {
    success: boolean;
    message: string;
    deletedId: ID;
}

/**
* Resposta de operação em lote
*/
export interface BulkOperationResponse {
    total: number;
    succeeded: number;
    failed: number;
    errors: Array<{
        id?: ID;
        index?: number;
        error: string;
    }>;
}

/**
* Resposta de upload
*/
export interface UploadResponse {
    success: boolean;
    message: string;
    url: string;
    filename: string;
    size: number;
    mimetype: string;
}

/**
* Resposta de exportação
*/
export interface ExportResponse {
    success: boolean;
    format: ExportFormat;
    filename: string;
    url?: string;
    size?: number;
}

/**
* Resposta de importação
*/
export interface ImportResponse {
    success: boolean;
    message: string;
    totalRecords: number;
    importedRecords: number;
    failedRecords: number;
    errors: Array<{
        line: number;
        error: string;
    }>;
}

/**
* Resposta de busca
*/
export interface SearchResponse<T> {
    results: T[];
    total: number;
    query: string;
    took: number; // tempo em ms
    suggestions?: string[];
}

/**
* Resposta de estatísticas
*/
export interface StatisticsResponse {
    period: DateRange;
    metrics: Record<string, number>;
    charts?: ChartData[];
}

/**
* Dados de gráfico
*/
export interface ChartData {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    labels: string[];
    datasets: ChartDataset[];
}

/**
* Dataset de gráfico
*/
export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
}
