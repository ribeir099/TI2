/**
* Formato de exportação
*/
export type ExportFormat = 'json' | 'csv' | 'xml' | 'txt';

/**
* Serviço de Exportação de Dados
* 
* Responsabilidades:
* - Exportar dados em múltiplos formatos
* - Gerar arquivos para download
* - Formatação de dados
*/
export class ExportService {
    /**
     * Exporta dados como JSON
     */
    exportAsJSON(data: any, filename: string): void {
        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, filename, 'application/json');
    }

    /**
     * Exporta dados como CSV
     */
    exportAsCSV(
        data: Array<Record<string, any>>,
        filename: string,
        headers?: string[]
    ): void {
        if (data.length === 0) {
            throw new Error('Nenhum dado para exportar');
        }

        // Determinar headers
        const csvHeaders = headers || Object.keys(data[0]);

        // Criar linhas
        const csvLines = [
            csvHeaders.join(','), // Header
            ...data.map(row =>
                csvHeaders.map(header => {
                    const value = row[header];
                    // Escapar valores com vírgula ou aspas
                    if (value === null || value === undefined) return '';
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                }).join(',')
            )
        ];

        const csvString = csvLines.join('\n');
        this.downloadFile(csvString, filename, 'text/csv');
    }

    /**
     * Exporta dados como XML
     */
    exportAsXML(data: any, filename: string, rootElement: string = 'data'): void {
        const xmlString = this.objectToXML(data, rootElement);
        this.downloadFile(xmlString, filename, 'application/xml');
    }

    /**
     * Exporta dados como TXT
     */
    exportAsTXT(data: string, filename: string): void {
        this.downloadFile(data, filename, 'text/plain');
    }

    /**
     * Download de arquivo
     */
    private downloadFile(content: string, filename: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    /**
     * Converte objeto para XML
     */
    private objectToXML(obj: any, rootElement: string = 'root'): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += `<${rootElement}>\n`;
        xml += this.convertObjectToXMLString(obj, 1);
        xml += `</${rootElement}>`;
        return xml;
    }

    /**
     * Converte objeto para string XML recursivamente
     */
    private convertObjectToXMLString(obj: any, indent: number = 0): string {
        let xml = '';
        const indentation = '  '.repeat(indent);

        if (Array.isArray(obj)) {
            obj.forEach(item => {
                xml += `${indentation}<item>\n`;
                xml += this.convertObjectToXMLString(item, indent + 1);
                xml += `${indentation}</item>\n`;
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    xml += `${indentation}<${key}>\n`;
                    xml += this.convertObjectToXMLString(value, indent + 1);
                    xml += `${indentation}</${key}>\n`;
                } else {
                    xml += `${indentation}<${key}>${this.escapeXML(String(value))}</${key}>\n`;
                }
            });
        } else {
            xml += `${indentation}${this.escapeXML(String(obj))}\n`;
        }

        return xml;
    }

    /**
     * Escapa caracteres especiais XML
     */
    private escapeXML(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Formata dados para impressão
     */
    formatForPrint(data: any): string {
        return JSON.stringify(data, null, 2);
    }

    /**
     * Copia dados para clipboard
     */
    async copyToClipboard(data: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(data);
            return true;
        } catch (error) {
            console.error('Erro ao copiar para clipboard:', error);
            return false;
        }
    }
}

// Singleton instance
export const exportService = new ExportService();