/**
* Tipos de Result Pattern (Railway Oriented Programming)
*/

/**
* Result genérico (Success ou Failure)
*/
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
* Success result
*/
export interface Success<T> {
    success: true;
    value: T;
    error?: never;
}

/**
* Failure result
*/
export interface Failure<E = Error> {
    success: false;
    value?: never;
    error: E;
}

/**
* Helpers para criar Results
*/
export const Result = {
    /**
     * Cria Success
     */
    ok: <T>(value: T): Success<T> => ({
        success: true,
        value
    }),

    /**
     * Cria Failure
     */
    fail: <E = Error>(error: E): Failure<E> => ({
        success: false,
        error
    }),

    /**
     * Verifica se é Success
     */
    isOk: <T, E>(result: Result<T, E>): result is Success<T> => {
        return result.success === true;
    },

    /**
     * Verifica se é Failure
     */
    isFail: <T, E>(result: Result<T, E>): result is Failure<E> => {
        return result.success === false;
    },

    /**
     * Mapeia valor de Success
     */
    map: <T, U, E>(
        result: Result<T, E>,
        fn: (value: T) => U
    ): Result<U, E> => {
        if (Result.isOk(result)) {
            return Result.ok(fn(result.value));
        }
        return result as Failure<E>;
    },

    /**
     * Mapeia erro de Failure
     */
    mapError: <T, E, F>(
        result: Result<T, E>,
        fn: (error: E) => F
    ): Result<T, F> => {
        if (Result.isFail(result)) {
            return Result.fail(fn(result.error));
        }
        return result as Success<T>;
    },

    /**
     * FlatMap (chain)
     */
    flatMap: <T, U, E>(
        result: Result<T, E>,
        fn: (value: T) => Result<U, E>
    ): Result<U, E> => {
        if (Result.isOk(result)) {
            return fn(result.value);
        }
        return result as Failure<E>;
    },

    /**
     * Obtém valor ou default
     */
    getOrElse: <T, E>(result: Result<T, E>, defaultValue: T): T => {
        if (Result.isOk(result)) {
            return result.value;
        }
        return defaultValue;
    },

    /**
     * Obtém valor ou lança erro
     */
    unwrap: <T, E>(result: Result<T, E>): T => {
        if (Result.isOk(result)) {
            return result.value;
        }
        throw result.error;
    }
};

/**
* Option type (Maybe monad)
*/
export type Option<T> = Some<T> | None;

/**
* Some (tem valor)
*/
export interface Some<T> {
    isSome: true;
    isNone: false;
    value: T;
}

/**
* None (não tem valor)
*/
export interface None {
    isSome: false;
    isNone: true;
    value?: never;
}

/**
* Helpers para Option
*/
export const Option = {
    some: <T>(value: T): Some<T> => ({
        isSome: true,
        isNone: false,
        value
    }),

    none: (): None => ({
        isSome: false,
        isNone: true
    }),

    fromNullable: <T>(value: T | null | undefined): Option<T> => {
        return value != null ? Option.some(value) : Option.none();
    },

    map: <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> => {
        return option.isSome ? Option.some(fn(option.value)) : Option.none();
    },

    getOrElse: <T>(option: Option<T>, defaultValue: T): T => {
        return option.isSome ? option.value : defaultValue;
    }
};