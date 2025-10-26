/**
* Tipos relacionados a Hooks
*/

/**
* Resultado de hook assíncrono
*/
export interface UseAsyncResult<T = any, E = Error> {
    data: T | null;
    error: E | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

/**
* Resultado de hook de fetch
*/
export interface UseFetchResult<T = any> extends UseAsyncResult<T> {
    refetch: () => Promise<void>;
}

/**
* Opções de fetch
*/
export interface UseFetchOptions<T = any> {
    enabled?: boolean;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number;
    retry?: number;
    retryDelay?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    initialData?: T;
}

/**
* Resultado de hook de mutation
*/
export interface UseMutationResult<TData = any, TVariables = any> {
    data: TData | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    mutate: (variables: TVariables) => Promise<void>;
    mutateAsync: (variables: TVariables) => Promise<TData>;
    reset: () => void;
}

/**
* Opções de mutation
*/
export interface UseMutationOptions<TData = any, TVariables = any> {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
}

/**
* Resultado de hook de toggle
*/
export interface UseToggleResult {
    value: boolean;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    setValue: (value: boolean) => void;
}

/**
* Resultado de hook de counter
*/
export interface UseCounterResult {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
}

/**
* Resultado de hook de debounce
*/
export interface UseDebounceResult<T> {
    debouncedValue: T;
    isDebouncing: boolean;
}

/**
* Resultado de hook de previous
*/
export interface UsePreviousResult<T> {
    previous: T | undefined;
    hasPrevious: boolean;
}

/**
* Resultado de hook de interval
*/
export interface UseIntervalResult {
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

/**
* Resultado de hook de timeout
*/
export interface UseTimeoutResult {
    isActive: boolean;
    start: () => void;
    cancel: () => void;
    reset: () => void;
}

/**
* Resultado de hook de clipboard
*/
export interface UseClipboardResult {
    copied: boolean;
    copy: (text: string) => Promise<boolean>;
    reset: () => void;
}

/**
* Resultado de hook de local storage
*/
export interface UseLocalStorageResult<T> {
    value: T;
    setValue: (value: T) => void;
    remove: () => void;
}