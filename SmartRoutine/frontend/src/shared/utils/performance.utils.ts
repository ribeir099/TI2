/**
* Utilitários de Performance
*/

/**
* Mede tempo de execução de função
*/
export async function measureTime<T>(
    fn: () => T | Promise<T>,
    label?: string
): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    if (label) {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
}

/**
* Memoização simples
*/
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();

    return ((...args: any[]) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        return result;
    }) as T;
}

/**
* Lazy evaluation
*/
export function lazy<T>(fn: () => T): () => T {
    let cached: T;
    let evaluated = false;

    return () => {
        if (!evaluated) {
            cached = fn();
            evaluated = true;
        }
        return cached;
    };
}

/**
* Batch de operações
*/
export function batch<T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
    const batches: T[][] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }

    return Promise.all(batches.map(batch => processor(batch))).then(results => results.flat());
}

/**
* Obtém métricas de performance
*/
export function getPerformanceMetrics(): {
    loadTime: number;
    domContentLoaded: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
} {
    const perfData = performance.timing;
    const navigationStart = perfData.navigationStart;

    const metrics = {
        loadTime: perfData.loadEventEnd - navigationStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - navigationStart,
        firstPaint: undefined as number | undefined,
        firstContentfulPaint: undefined as number | undefined
    };

    // First Paint & FCP
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry: any) => {
        if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
        }
    });

    return metrics;
}