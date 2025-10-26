/**
* Dados para compartilhamento
*/
export interface ShareData {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}

/**
* Serviço de Compartilhamento Web
* 
* Responsabilidades:
* - Compartilhar receitas
* - Compartilhar listas
* - Web Share API
*/
export class WebShareService {
    /**
     * Verifica se Web Share API é suportada
     */
    isSupported(): boolean {
        return !!navigator.share;
    }

    /**
     * Verifica se pode compartilhar arquivos
     */
    canShareFiles(): boolean {
        return !!navigator.canShare && navigator.canShare({ files: [] });
    }

    /**
     * Compartilha conteúdo
     */
    async share(data: ShareData): Promise<boolean> {
        if (!this.isSupported()) {
            console.warn('Web Share API não suportada');
            return false;
        }

        try {
            // Validar dados
            if (data.files && !this.canShareFiles()) {
                throw new Error('Compartilhamento de arquivos não suportado');
            }

            await navigator.share(data);
            return true;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // Usuário cancelou
                return false;
            }

            console.error('Erro ao compartilhar:', error);
            return false;
        }
    }

    /**
     * Compartilha receita
     */
    async shareRecipe(title: string, url: string): Promise<boolean> {
        return await this.share({
            title: `🍳 ${title}`,
            text: `Confira esta receita incrível no SmartRoutine!`,
            url
        });
    }

    /**
     * Compartilha lista de compras
     */
    async shareShoppingList(items: string[]): Promise<boolean> {
        const text = `📝 Lista de Compras:\n\n${items.map(item => `• ${item}`).join('\n')}`;

        return await this.share({
            title: 'Lista de Compras - SmartRoutine',
            text
        });
    }

    /**
     * Compartilha arquivo
     */
    async shareFile(file: File, title?: string): Promise<boolean> {
        if (!this.canShareFiles()) {
            console.warn('Compartilhamento de arquivos não suportado');
            return false;
        }

        return await this.share({
            title,
            files: [file]
        });
    }

    /**
     * Fallback: Copiar link
     */
    async fallbackShare(url: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(url);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Singleton instance
export const webShareService = new WebShareService();