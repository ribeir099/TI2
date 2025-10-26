/**
* Opções de processamento de imagem
*/
export interface ImageProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

/**
* Resultado do processamento
*/
export interface ProcessedImage {
    dataUrl: string;
    blob: Blob;
    width: number;
    height: number;
    size: number;
}

/**
* Serviço de Processamento de Imagens
* 
* Responsabilidades:
* - Redimensionar imagens
* - Comprimir imagens
* - Converter formatos
* - Validar imagens
* - Upload/Download
*/
export class ImageService {
    private readonly DEFAULT_MAX_WIDTH = 1920;
    private readonly DEFAULT_MAX_HEIGHT = 1080;
    private readonly DEFAULT_QUALITY = 0.8;

    /**
     * Processa imagem (redimensiona e comprime)
     */
    async processImage(
        file: File,
        options: ImageProcessingOptions = {}
    ): Promise<ProcessedImage> {
        try {
            // Validar arquivo
            this.validateImageFile(file);

            // Carregar imagem
            const img = await this.loadImage(file);

            // Calcular novas dimensões
            const dimensions = this.calculateDimensions(
                img.width,
                img.height,
                options.maxWidth || this.DEFAULT_MAX_WIDTH,
                options.maxHeight || this.DEFAULT_MAX_HEIGHT
            );

            // Criar canvas
            const canvas = document.createElement('canvas');
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Falha ao obter contexto do canvas');
            }

            // Desenhar imagem redimensionada
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

            // Converter para blob
            const blob = await this.canvasToBlob(
                canvas,
                options.format || 'jpeg',
                options.quality || this.DEFAULT_QUALITY
            );

            // Converter para data URL
            const dataUrl = canvas.toDataURL(
                `image/${options.format || 'jpeg'}`,
                options.quality || this.DEFAULT_QUALITY
            );

            return {
                dataUrl,
                blob,
                width: dimensions.width,
                height: dimensions.height,
                size: blob.size
            };
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            throw new Error('Falha ao processar imagem');
        }
    }

    /**
     * Valida arquivo de imagem
     */
    validateImageFile(file: File): void {
        // Verificar se é imagem
        if (!file.type.startsWith('image/')) {
            throw new Error('Arquivo não é uma imagem');
        }

        // Verificar tamanho (máximo 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Imagem muito grande (máximo 10MB)');
        }

        // Verificar tipo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Tipo de imagem não suportado');
        }
    }

    /**
     * Carrega imagem do arquivo
     */
    private loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Falha ao carregar imagem'));
            };

            img.src = url;
        });
    }

    /**
     * Carrega imagem de URL
     */
    async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Falha ao carregar imagem da URL'));

            img.src = url;
        });
    }

    /**
     * Calcula dimensões mantendo aspect ratio
     */
    private calculateDimensions(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
        maxHeight: number
    ): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        // Redimensionar se necessário
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        return {
            width: Math.round(width),
            height: Math.round(height)
        };
    }

    /**
     * Converte canvas para blob
     */
    private canvasToBlob(
        canvas: HTMLCanvasElement,
        format: string,
        quality: number
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Falha ao converter canvas para blob'));
                    }
                },
                `image/${format}`,
                quality
            );
        });
    }

    /**
     * Cria thumbnail
     */
    async createThumbnail(file: File, size: number = 200): Promise<ProcessedImage> {
        return await this.processImage(file, {
            maxWidth: size,
            maxHeight: size,
            quality: 0.7
        });
    }

    /**
     * Extrai cor dominante da imagem
     */
    async extractDominantColor(file: File): Promise<string> {
        try {
            const img = await this.loadImage(file);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Falha ao obter contexto');

            ctx.drawImage(img, 0, 0);

            // Pegar cor do centro da imagem
            const centerX = Math.floor(img.width / 2);
            const centerY = Math.floor(img.height / 2);
            const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;

            return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        } catch (error) {
            console.error('Erro ao extrair cor dominante:', error);
            return 'rgb(16, 185, 129)'; // Cor padrão
        }
    }

    /**
     * Converte File para Data URL
     */
    async fileToDataUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Converte Data URL para Blob
     */
    dataUrlToBlob(dataUrl: string): Blob {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }

    /**
     * Download de imagem
     */
    download(blob: Blob, filename: string): void {
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
     * Valida URL de imagem
     */
    async validateImageUrl(url: string): Promise<boolean> {
        try {
            await this.loadImageFromUrl(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém dimensões de imagem sem carregar totalmente
     */
    async getImageDimensions(url: string): Promise<{ width: number; height: number }> {
        const img = await this.loadImageFromUrl(url);
        return {
            width: img.naturalWidth,
            height: img.naturalHeight
        };
    }

    /**
     * Gera placeholder de imagem
     */
    generatePlaceholder(
        width: number,
        height: number,
        text: string = '?',
        backgroundColor: string = '#10b981'
    ): string {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Texto
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${height / 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);

        return canvas.toDataURL('image/png');
    }
}

// Singleton instance
export const imageService = new ImageService();