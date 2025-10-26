/**
* Utilitários de Objetos
*/

/**
* Verifica se objeto está vazio
*/
export function isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
}

/**
* Deep clone
*/
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
* Deep merge
*/
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;

    const source = sources.shift();
    if (!source) return target;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            const sourceValue = (source as any)[key];

            if (isObject(sourceValue)) {
                if (!(target as any)[key]) {
                    Object.assign(target, { [key]: {} });
                }
                deepMerge((target as any)[key], sourceValue);
            } else {
                Object.assign(target, { [key]: sourceValue });
            }
        });
    }

    return deepMerge(target, ...sources);
}

/**
* Verifica se é objeto
*/
function isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
* Omit properties
*/
export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

/**
* Pick properties
*/
export function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}

/**
* Get nested property
*/
export function getNestedProperty(obj: any, path: string, defaultValue?: any): any {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current == null || !(key in current)) {
            return defaultValue;
        }
        current = current[key];
    }

    return current;
}

/**
* Set nested property
*/
export function setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;

    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    current[lastKey] = value;
}

/**
* Compara objetos profundamente
*/
export function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

/**
* Remove propriedades null/undefined
*/
export function removeNullish<T extends object>(obj: T): Partial<T> {
    const result: any = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (value != null) {
            result[key] = value;
        }
    });

    return result;
}

/**
* Remove propriedades vazias (null/undefined/empty string)
*/
export function removeEmpty<T extends object>(obj: T): Partial<T> {
    const result: any = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (value != null && value !== '') {
            result[key] = value;
        }
    });

    return result;
}

/**
* Inverte chaves e valores
*/
export function invert<T extends Record<string, string>>(obj: T): Record<string, string> {
    const inverted: Record<string, string> = {};

    Object.entries(obj).forEach(([key, value]) => {
        inverted[value] = key;
    });

    return inverted;
}

/**
* Mapeia valores de objeto
*/
export function mapValues<T, U>(
    obj: Record<string, T>,
    mapper: (value: T, key: string) => U
): Record<string, U> {
    const result: Record<string, U> = {};

    Object.entries(obj).forEach(([key, value]) => {
        result[key] = mapper(value, key);
    });

    return result;
}

/**
* Filtra objeto por condição
*/
export function filterObject<T>(
    obj: Record<string, T>,
    predicate: (value: T, key: string) => boolean
): Record<string, T> {
    const result: Record<string, T> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (predicate(value, key)) {
            result[key] = value;
        }
    });

    return result;
}