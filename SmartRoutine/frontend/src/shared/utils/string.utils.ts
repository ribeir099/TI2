/**
* Utilitários de String
*/

/**
* Capitaliza primeira letra
*/
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
* Capitaliza cada palavra
*/
export function capitalizeWords(text: string): string {
    if (!text) return '';
    return text
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}

/**
* Converte para camelCase
*/
export function toCamelCase(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
* Converte para snake_case
*/
export function toSnakeCase(text: string): string {
    return text
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        .replace(/^_/, '');
}

/**
* Converte para kebab-case
*/
export function toKebabCase(text: string): string {
    return text
        .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
        .replace(/^-/, '');
}

/**
* Converte para PascalCase
*/
export function toPascalCase(text: string): string {
    const camel = toCamelCase(text);
    return capitalize(camel);
}

/**
* Trunca texto
*/
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
* Trunca no meio (inicio...fim)
*/
export function truncateMiddle(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;

    const charsToShow = maxLength - 3;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return (
        text.substring(0, frontChars) +
        '...' +
        text.substring(text.length - backChars)
    );
}

/**
* Remove caracteres especiais
*/
export function removeSpecialChars(text: string): string {
    return text.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
* Remove espaços extras
*/
export function normalizeSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

/**
* Remove acentos
*/
export function removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
* Conta palavras
*/
export function countWords(text: string): number {
    return text.trim().split(/\s+/).length;
}

/**
* Conta caracteres (sem espaços)
*/
export function countCharacters(text: string, includeSpaces: boolean = false): number {
    if (includeSpaces) return text.length;
    return text.replace(/\s/g, '').length;
}

/**
* Extrai iniciais
*/
export function getInitials(name: string, maxChars: number = 2): string {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].substring(0, maxChars).toUpperCase();
    }

    const initials = words
        .map(word => word.charAt(0).toUpperCase())
        .join('');

    return initials.substring(0, maxChars);
}

/**
* Highligh termo em texto (para busca)
*/
export function highlightText(text: string, query: string): string {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
* Escapa HTML
*/
export function escapeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
* Remove tags HTML
*/
export function stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

/**
* Verifica se contém substring (case-insensitive)
*/
export function containsIgnoreCase(text: string, search: string): boolean {
    return text.toLowerCase().includes(search.toLowerCase());
}

/**
* Gera string aleatória
*/
export function randomString(length: number, charset: string = 'alphanumeric'): string {
    const charsets = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        numeric: '0123456789',
        hex: '0123456789ABCDEF'
    };

    const chars = charsets[charset as keyof typeof charsets] || charsets.alphanumeric;
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

/**
* Padding à esquerda
*/
export function padStart(text: string, length: number, char: string = '0'): string {
    return text.padStart(length, char);
}

/**
* Padding à direita
*/
export function padEnd(text: string, length: number, char: string = '0'): string {
    return text.padEnd(length, char);
}

/**
* Reverte string
*/
export function reverse(text: string): string {
    return text.split('').reverse().join('');
}

/**
* Verifica se é palíndromo
*/
export function isPalindrome(text: string): boolean {
    const cleaned = removeAccents(text.toLowerCase().replace(/\s/g, ''));
    return cleaned === reverse(cleaned);
}