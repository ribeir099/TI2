import { ChangeEvent } from "react";
import { UseAsyncState } from "./states";

export interface UseAsyncReturn<T> extends UseAsyncState<T> {
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

export interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur: (field: keyof T) => () => void;
    handleSubmit: (e: React.FormEvent) => void;
    setFieldValue: (field: keyof T, value: any) => void;
    setFieldError: (field: keyof T, error: string) => void;
    resetForm: () => void;
    isValid: boolean;
}

export interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    currentItems: T[];
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
}