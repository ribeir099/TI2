export interface UseAsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}