/**
* Utilitários de Cor
*/

/**
* Converte HEX para RGB
*/
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
* Converte RGB para HEX
*/
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
}

/**
* Calcula luminosidade da cor (0-255)
*/
export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    // Fórmula: 0.299*R + 0.587*G + 0.114*B
    return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

/**
* Verifica se cor é clara
*/
export function isLightColor(hex: string): boolean {
    return getLuminance(hex) > 128;
}

/**
* Verifica se cor é escura
*/
export function isDarkColor(hex: string): boolean {
    return !isLightColor(hex);
}

/**
* Obtém cor de contraste (branco ou preto)
*/
export function getContrastColor(hex: string): string {
    return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

/**
* Escurece cor
*/
export function darken(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = 1 - (percent / 100);

    return rgbToHex(
        Math.round(rgb.r * factor),
        Math.round(rgb.g * factor),
        Math.round(rgb.b * factor)
    );
}

/**
* Clareia cor
*/
export function lighten(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;

    return rgbToHex(
        Math.round(rgb.r + (255 - rgb.r) * factor),
        Math.round(rgb.g + (255 - rgb.g) * factor),
        Math.round(rgb.b + (255 - rgb.b) * factor)
    );
}

/**
* Ajusta opacidade (retorna rgba)
*/
export function withOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
* Gera cor aleatória
*/
export function randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
* Gera paleta de cores
*/
export function generatePalette(baseColor: string, count: number = 5): string[] {
    const palette: string[] = [];

    for (let i = 0; i < count; i++) {
        const percent = (i / (count - 1)) * 100;
        palette.push(lighten(baseColor, percent));
    }

    return palette;
}