/**
* Funções Auxiliares Gerais
* 
* Responsabilidades:
* - Utilitários diversos
* - Funções de conveniência
* - Helpers genéricos
*/

/**
* Delay/Sleep
*/
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
* Debounce
*/
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
* Throttle
*/
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
* Retry com backoff exponencial
*/
export async function retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt < maxAttempts) {
                const delay = delayMs * Math.pow(2, attempt - 1);
                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
* Remove duplicatas por propriedade
*/
export function uniqueByKey<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

/**
* Agrupa array por propriedade
*/
export function groupByKey<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
        const value = String(item[key]);
        groups[value] = groups[value] || [];
        groups[value].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

/**
* Ordena array por propriedade
*/
export function sortBy<T>(
    array: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
* Busca binária (array ordenado)
*/
export function binarySearch<T>(
    array: T[],
    target: T,
    compareFn?: (a: T, b: T) => number
): number {
    let left = 0;
    let right = array.length - 1;

    const compare = compareFn || ((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const comparison = compare(array[mid], target);

        if (comparison === 0) return mid;
        if (comparison < 0) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

/**
* Gera ID único
*/
export function generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
* Gera UUID v4
*/
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
* Transforma chaves de objeto (camelCase -> snake_case)
*/
export function toSnakeCaseObject(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCaseObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            acc[snakeKey] = toSnakeCaseObject(obj[key]);
            return acc;
        }, {} as any);
    }

    return obj;
}

/**
* Transforma chaves de objeto (snake_case -> camelCase)
*/
export function toCamelCaseObject(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCaseObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            acc[camelKey] = toCamelCaseObject(obj[key]);
            return acc;
        }, {} as any);
    }

    return obj;
}

