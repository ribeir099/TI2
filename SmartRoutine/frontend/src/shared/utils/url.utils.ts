/**
* Utilitários de URL
*/

/**
* Constrói URL com query params
*/
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
* Parse query params de URL
*/
export function parseQueryParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    const urlObj = new URL(url, window.location.origin);

    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

/**
* Adiciona/atualiza query param
*/
export function setQueryParam(url: string, key: string, value: string): string {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
}

/**
* Remove query param
*/
export function removeQueryParam(url: string, key: string): string {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.delete(key);
    return urlObj.toString();
}

/**
* Obtém domínio de URL
*/
export function getDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error) {
        return '';
    }
}

/**
* Verifica se URL é absoluta
*/
export function isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

/**
* Converte para URL absoluta
*/
export function toAbsoluteUrl(url: string, base?: string): string {
    if (isAbsoluteUrl(url)) return url;

    const baseUrl = base || window.location.origin;
    return new URL(url, baseUrl).toString();
}

/**
* Sanitiza URL (remove parâmetros sensíveis)
*/
export function sanitizeUrl(url: string, paramsToRemove: string[] = ['token', 'key', 'secret']): string {
    const urlObj = new URL(url, window.location.origin);

    paramsToRemove.forEach(param => {
        urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
}