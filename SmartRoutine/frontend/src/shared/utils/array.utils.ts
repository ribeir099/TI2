/**
* Utilitários de Array
*/

/**
* Remove item por índice
*/
export function removeAt<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

/**
* Insere item em índice
*/
export function insertAt<T>(array: T[], index: number, item: T): T[] {
    return [...array.slice(0, index), item, ...array.slice(index)];
}

/**
* Move item de um índice para outro
*/
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const item = array[fromIndex];
    const without = removeAt(array, fromIndex);
    return insertAt(without, toIndex, item);
}

/**
* Embaralha array (Fisher-Yates)
*/
export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
* Pega item aleatório
*/
export function randomItem<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

/**
* Pega N itens aleatórios
*/
export function randomItems<T>(array: T[], count: number): T[] {
    const shuffled = shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
* Agrupa por propriedade
*/
export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    return array.reduce((groups, item) => {
        const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
        groups[groupKey] = groups[groupKey] || [];
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

/**
* Conta ocorrências
*/
export function countBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, number> {
    return array.reduce((counts, item) => {
        const countKey = typeof key === 'function' ? key(item) : String(item[key]);
        counts[countKey] = (counts[countKey] || 0) + 1;
        return counts;
    }, {} as Record<string, number>);
}

/**
* Remove duplicatas
*/
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

/**
* Remove duplicatas por propriedade
*/
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

/**
* Interseção de arrays
*/
export function intersection<T>(...arrays: T[][]): T[] {
    if (arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];

    const set = new Set(arrays[0]);

    for (let i = 1; i < arrays.length; i++) {
        const currentSet = new Set(arrays[i]);
        set.forEach(item => {
            if (!currentSet.has(item)) {
                set.delete(item);
            }
        });
    }

    return Array.from(set);
}

/**
* União de arrays (sem duplicatas)
*/
export function union<T>(...arrays: T[][]): T[] {
    return unique(arrays.flat());
}

/**
* Diferença entre arrays (A - B)
*/
export function difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => !set2.has(item));
}

/**
* Divide array em pedaços
*/
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}

/**
* Achata array aninhado
*/
export function flatten<T>(array: any[], depth: number = Infinity): T[] {
    if (depth === 0) return array;

    return array.reduce((flat, item) => {
        if (Array.isArray(item)) {
            flat.push(...flatten(item, depth - 1));
        } else {
            flat.push(item);
        }
        return flat;
    }, []);
}

/**
* Compacta array (remove null/undefined)
*/
export function compact<T>(array: (T | null | undefined)[]): T[] {
    return array.filter((item): item is T => item != null);
}

/**
* Primeiro item que atende condição
*/
export function findFirst<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    return array.find(predicate);
}

/**
* Último item que atende condição
*/
export function findLast<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
            return array[i];
        }
    }
    return undefined;
}

/**
* Particiona array em dois grupos
*/
export function partition<T>(
    array: T[],
    predicate: (item: T) => boolean
): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];

    array.forEach(item => {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    });

    return [pass, fail];
}

/**
* Soma valores numéricos
*/
export function sum(array: number[]): number {
    return array.reduce((total, num) => total + num, 0);
}

/**
* Média de valores
*/
export function average(array: number[]): number {
    if (array.length === 0) return 0;
    return sum(array) / array.length;
}

/**
* Valor mínimo
*/
export function min(array: number[]): number {
    return Math.min(...array);
}

/**
* Valor máximo
*/
export function max(array: number[]): number {
    return Math.max(...array);
}

/**
* Range de valores (min até max)
*/
export function range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];

    for (let i = start; i <= end; i += step) {
        result.push(i);
    }

    return result;
}

/**
* Calcula desvio padrão
*/
export function standardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const avg = average(numbers);
    const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
    const avgSquareDiff = average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
}