/**
* Utilitários Matemáticos
*/

/**
* Arredonda para N casas decimais
*/
export function round(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
* Clamp value entre min e max
*/
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
* Normaliza valor entre 0 e 1
*/
export function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

/**
* Desnormaliza valor (inverso de normalize)
*/
export function denormalize(normalized: number, min: number, max: number): number {
    return normalized * (max - min) + min;
}

/**
* Interpola entre dois valores
*/
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
* Calcula percentual
*/
export function percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
* Calcula mediana
*/
export function median(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

/**
* Gera número aleatório entre min e max
*/
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Gera número aleatório float
*/
export function randomFloat(min: number, max: number, decimals: number = 2): number {
    const random = Math.random() * (max - min) + min;
    return round(random, decimals);
}

/**
* Verifica se é par
*/
export function isEven(num: number): boolean {
    return num % 2 === 0;
}

/**
* Verifica se é ímpar
*/
export function isOdd(num: number): boolean {
    return num % 2 !== 0;
}

/**
* Converte graus para radianos
*/
export function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
* Converte radianos para graus
*/
export function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
* Calcula fatorial
*/
export function factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/**
* Verifica se é número primo
*/
export function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }

    return true;
}
