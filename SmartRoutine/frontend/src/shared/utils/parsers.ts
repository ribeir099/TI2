/**
* Utilitários de Parsing
* 
* Responsabilidades:
* - Parsear strings
* - Converter tipos
* - Extrair informações
*/

export class Parser {
    /**
     * Parse de número com fallback
     */
    static toNumber(value: any, defaultValue: number = 0): number {
        const parsed = Number(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    /**
     * Parse de inteiro
     */
    static toInt(value: any, defaultValue: number = 0): number {
        const parsed = parseInt(String(value), 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    /**
     * Parse de float
     */
    static toFloat(value: any, defaultValue: number = 0): number {
        const parsed = parseFloat(String(value));
        return isNaN(parsed) ? defaultValue : parsed;
    }

    /**
     * Parse de boolean
     */
    static toBoolean(value: any): boolean {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'sim';
        }
        return !!value;
    }

    /**
     * Parse de data
     */
    static toDate(value: any): Date | null {
        if (value instanceof Date) return value;

        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    /**
     * Parse de JSON com fallback
     */
    static toJSON<T>(text: string, defaultValue: T): T {
        try {
            return JSON.parse(text);
        } catch (error) {
            return defaultValue;
        }
    }

    /**
     * Extrai números de string
     */
    static extractNumbers(text: string): number[] {
        const matches = text.match(/\d+/g);
        return matches ? matches.map(m => parseInt(m, 10)) : [];
    }

    /**
     * Extrai email de texto
     */
    static extractEmail(text: string): string | null {
        const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        const match = text.match(emailRegex);
        return match ? match[0] : null;
    }

    /**
     * Extrai URLs de texto
     */
    static extractURLs(text: string): string[] {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = text.match(urlRegex);
        return matches || [];
    }

    /**
     * Parse de query string
     */
    static parseQueryString(queryString: string): Record<string, string> {
        const params: Record<string, string> = {};

        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    }

    /**
     * Parse de CSV line
     */
    static parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    /**
     * Parse de tempo (ex: "1h 30min" -> 90)
     */
    static parseTimeToMinutes(timeString: string): number {
        let totalMinutes = 0;

        // Horas
        const hoursMatch = timeString.match(/(\d+)\s*h/i);
        if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1]) * 60;
        }

        // Minutos
        const minutesMatch = timeString.match(/(\d+)\s*min/i);
        if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1]);
        }

        return totalMinutes;
    }

    /**
     * Parse de quantidade com unidade (ex: "2.5 kg" -> {value: 2.5, unit: "kg"})
     */
    static parseQuantity(quantityString: string): {
        value: number;
        unit: string;
    } | null {
        const match = quantityString.match(/^([\d.]+)\s*([a-zA-Z]+)$/);

        if (!match) return null;

        return {
            value: parseFloat(match[1]),
            unit: match[2]
        };
    }

    /**
     * Parse de ranges (ex: "10-20" -> {min: 10, max: 20})
     */
    static parseRange(rangeString: string): {
        min: number;
        max: number;
    } | null {
        const match = rangeString.match(/^(\d+)\s*-\s*(\d+)$/);

        if (!match) return null;

        return {
            min: parseInt(match[1]),
            max: parseInt(match[2])
        };
    }
}