/**
* Serviço de Clipboard
* 
* Responsabilidades:
* - Copiar/colar texto
* - Copiar imagens
* - Permissões de clipboard
*/
export class ClipboardService {
    /**
     * Verifica se Clipboard API é suportada
     */
    isSupported(): boolean {
        return !!navigator.clipboard;
    }

    /**
     * Copia texto para clipboard
     */
    async copyText(text: string): Promise<boolean> {
        if (!this.isSupported()) {
            return this.fallbackCopyText(text);
        }

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Erro ao copiar texto:', error);
            return this.fallbackCopyText(text);
        }
    }

    /**
     * Lê texto do clipboard
     */
    async readText(): Promise<string | null> {
        if (!this.isSupported()) {
            console.warn('Clipboard API não suportada');
            return null;
        }

        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (error) {
            console.error('Erro ao ler clipboard:', error);
            return null;
        }
    }

    /**
     * Copia dados estruturados (JSON)
     */
    async copyJSON(data: any): Promise<boolean> {
        const jsonString = JSON.stringify(data, null, 2);
        return await this.copyText(jsonString);
    }

    /**
     * Copia HTML formatado
     */
    async copyHTML(html: string, plainText: string): Promise<boolean> {
        if (!this.isSupported()) {
            return await this.copyText(plainText);
        }

        try {
            const blob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([plainText], { type: 'text/plain' });

            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blob,
                    'text/plain': textBlob
                })
            ]);

            return true;
        } catch (error) {
            console.error('Erro ao copiar HTML:', error);
            return await this.copyText(plainText);
        }
    }

    /**
     * Fallback para copiar texto (execCommand)
     */
    private fallbackCopyText(text: string): boolean {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);
            textarea.select();

            const success = document.execCommand('copy');

            document.body.removeChild(textarea);

            return success;
        } catch (error) {
            console.error('Fallback copy failed:', error);
            return false;
        }
    }

    /**
     * Verifica permissão de clipboard
     */
    async checkPermission(): Promise<PermissionState> {
        try {
            const result = await navigator.permissions.query({
                name: 'clipboard-write' as PermissionName
            });
            return result.state;
        } catch (error) {
            return 'prompt';
        }
    }
}

// Singleton instance
export const clipboardService = new ClipboardService();