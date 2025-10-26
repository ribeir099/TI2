import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FoodItem } from '@/domain/entities/FoodItem';
import { Recipe } from '@/domain/entities/Recipe';
import { User } from '@/domain/entities/User';
import { ExpirationStatusVO } from '@/domain/value-objects/ExpirationStatus';

/**
* Opções de geração de PDF
*/
export interface PDFOptions {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    includeHeader?: boolean;
    includeFooter?: boolean;
    includeStatistics?: boolean;
}

/**
* Dados para PDF da despensa
*/
export interface PantryPDFData {
    user: User;
    items: FoodItem[];
    statistics: {
        total: number;
        expired: number;
        expiring: number;
        fresh: number;
    };
}

/**
* Serviço de Geração de PDFs
* 
* Responsabilidades:
* - Gerar PDFs de despensa
* - Gerar PDFs de receitas
* - Gerar relatórios
* - Exportar listas
*/
export class PDFGenerator {
    private readonly PRIMARY_COLOR = [16, 185, 129]; // rgb(16, 185, 129)
    private readonly SECONDARY_COLOR = [99, 102, 241]; // rgb(99, 102, 241)
    private readonly ACCENT_COLOR = [245, 158, 11]; // rgb(245, 158, 11)
    private readonly TEXT_COLOR = [0, 0, 0];
    private readonly MUTED_COLOR = [100, 100, 100];

    /**
     * Gera PDF da despensa
     */
    generatePantryPDF(data: PantryPDFData, options: PDFOptions = {}): jsPDF {
        const doc = new jsPDF({
            orientation: options.orientation || 'portrait',
            format: options.format || 'a4'
        }) as any;

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let currentY = 20;

        // Header
        if (options.includeHeader !== false) {
            currentY = this.addHeader(doc, pageWidth, currentY);
        }

        // Título
        currentY = this.addTitle(doc, 'Relatório da Despensa', pageWidth, currentY);

        // Informações do usuário
        currentY = this.addUserInfo(doc, data.user, currentY);

        // Estatísticas
        if (options.includeStatistics !== false) {
            currentY = this.addStatistics(doc, data.statistics, currentY);
        }

        // Verificar se precisa de nova página
        if (currentY > pageHeight - 100) {
            doc.addPage();
            currentY = 20;
        }

        // Tabela de alimentos
        currentY = this.addFoodItemsTable(doc, data.items, currentY);

        // Footer
        if (options.includeFooter !== false) {
            this.addFooter(doc, pageWidth, pageHeight);
        }

        return doc;
    }

    /**
     * Gera PDF de receita
     */
    generateRecipePDF(recipe: Recipe, options: PDFOptions = {}): jsPDF {
        const doc = new jsPDF({
            orientation: options.orientation || 'portrait',
            format: options.format || 'a4'
        }) as any;

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let currentY = 20;

        // Header
        if (options.includeHeader !== false) {
            currentY = this.addHeader(doc, pageWidth, currentY);
        }

        // Título da receita
        currentY = this.addTitle(doc, recipe.titulo, pageWidth, currentY);

        // Informações básicas
        currentY = this.addRecipeInfo(doc, recipe, currentY);

        // Ingredientes
        currentY = this.addIngredients(doc, recipe.ingredientes, currentY, pageHeight);

        // Modo de preparo
        currentY = this.addInstructions(doc, recipe.modoPreparo, currentY, pageHeight);

        // Tags e informações adicionais
        if (recipe.tags && recipe.tags.length > 0) {
            currentY = this.addTags(doc, recipe.tags, currentY);
        }

        // Footer
        if (options.includeFooter !== false) {
            this.addFooter(doc, pageWidth, pageHeight);
        }

        return doc;
    }

    /**
     * Gera PDF de lista de compras
     */
    generateShoppingListPDF(
        items: Array<{ name: string; quantity: string; category: string }>,
        userName: string,
        options: PDFOptions = {}
    ): jsPDF {
        const doc = new jsPDF({
            orientation: options.orientation || 'portrait',
            format: options.format || 'a4'
        }) as any;

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let currentY = 20;

        // Header
        currentY = this.addHeader(doc, pageWidth, currentY);

        // Título
        currentY = this.addTitle(doc, 'Lista de Compras', pageWidth, currentY);

        // Info do usuário
        doc.setFontSize(10);
        doc.setTextColor(...this.MUTED_COLOR);
        doc.text(`Para: ${userName}`, 14, currentY);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, currentY + 5);
        currentY += 15;

        // Agrupar por categoria
        const grouped = this.groupByCategory(items);

        // Adicionar cada categoria
        Object.entries(grouped).forEach(([category, categoryItems]) => {
            // Verificar espaço
            if (currentY > pageHeight - 40) {
                doc.addPage();
                currentY = 20;
            }

            // Título da categoria
            doc.setFontSize(12);
            doc.setTextColor(...this.SECONDARY_COLOR);
            doc.text(category, 14, currentY);
            currentY += 7;

            // Itens da categoria
            doc.setFontSize(10);
            doc.setTextColor(...this.TEXT_COLOR);

            categoryItems.forEach((item: any) => {
                const checkbox = '☐';
                const text = `${checkbox} ${item.name} - ${item.quantity}`;
                doc.text(text, 20, currentY);
                currentY += 6;

                if (currentY > pageHeight - 30) {
                    doc.addPage();
                    currentY = 20;
                }
            });

            currentY += 5;
        });

        // Footer
        this.addFooter(doc, pageWidth, pageHeight);

        return doc;
    }

    /**
     * Gera PDF de relatório de estatísticas
     */
    generateStatisticsReportPDF(
        statistics: any,
        userName: string,
        options: PDFOptions = {}
    ): jsPDF {
        const doc = new jsPDF({
            orientation: options.orientation || 'portrait',
            format: options.format || 'a4'
        }) as any;

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let currentY = 20;

        // Header
        currentY = this.addHeader(doc, pageWidth, currentY);

        // Título
        currentY = this.addTitle(doc, 'Relatório de Estatísticas', pageWidth, currentY);

        // Info
        doc.setFontSize(10);
        doc.setTextColor(...this.MUTED_COLOR);
        doc.text(`Usuário: ${userName}`, 14, currentY);
        doc.text(`Período: ${new Date().toLocaleDateString('pt-BR')}`, 14, currentY + 5);
        currentY += 20;

        // Estatísticas
        this.addStatisticsDetails(doc, statistics, currentY);

        // Footer
        this.addFooter(doc, pageWidth, pageHeight);

        return doc;
    }

    /**
     * Download do PDF
     */
    download(doc: jsPDF, filename: string): void {
        doc.save(filename);
    }

    /**
     * Converte PDF para Blob
     */
    toBlob(doc: jsPDF): Blob {
        return doc.output('blob');
    }

    /**
     * Abre PDF em nova aba
     */
    openInNewTab(doc: jsPDF): void {
        const blob = this.toBlob(doc);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Adiciona header do documento
     */
    private addHeader(doc: any, pageWidth: number, startY: number): number {
        // Logo/Título
        doc.setFontSize(20);
        doc.setTextColor(...this.PRIMARY_COLOR);
        doc.text('SmartRoutine', pageWidth / 2, startY, { align: 'center' });

        return startY + 10;
    }

    /**
     * Adiciona título da seção
     */
    private addTitle(doc: any, title: string, pageWidth: number, startY: number): number {
        doc.setFontSize(16);
        doc.setTextColor(...this.TEXT_COLOR);
        doc.text(title, pageWidth / 2, startY, { align: 'center' });

        return startY + 10;
    }

    /**
     * Adiciona informações do usuário
     */
    private addUserInfo(doc: any, user: User, startY: number): number {
        doc.setFontSize(10);
        doc.setTextColor(...this.MUTED_COLOR);
        doc.text(`Usuário: ${user.nome}`, 14, startY);
        doc.text(`Email: ${user.emailMascarado}`, 14, startY + 5);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, startY + 10);

        return startY + 20;
    }

    /**
     * Adiciona estatísticas
     */
    private addStatistics(doc: any, stats: any, startY: number): number {
        doc.setFontSize(12);
        doc.setTextColor(...this.TEXT_COLOR);
        doc.text('Resumo:', 14, startY);

        doc.setFontSize(10);
        doc.text(`Total de Itens: ${stats.total}`, 14, startY + 7);
        doc.text(`Itens Vencendo: ${stats.expiring}`, 14, startY + 13);
        doc.text(`Itens Vencidos: ${stats.expired}`, 14, startY + 19);
        doc.text(`Itens Frescos: ${stats.fresh}`, 14, startY + 25);

        return startY + 35;
    }

    /**
     * Adiciona tabela de alimentos
     */
    private addFoodItemsTable(doc: any, items: FoodItem[], startY: number): number {
        const tableData = items.map(item => {
            const statusVO = ExpirationStatusVO.fromDays(item.diasAteVencimento);

            return [
                item.nome,
                item.descricaoQuantidade,
                item.categoria,
                item.dataValidadeFormatada,
                statusVO.label
            ];
        });

        doc.autoTable({
            startY,
            head: [['Nome', 'Quantidade', 'Categoria', 'Validade', 'Status']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: this.PRIMARY_COLOR,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 30 },
                2: { cellWidth: 35 },
                3: { cellWidth: 30 },
                4: { cellWidth: 35 }
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            didParseCell: (data: any) => {
                // Colorir status
                if (data.column.index === 4) {
                    const status = data.cell.raw;
                    if (status === 'Vencido') {
                        data.cell.styles.textColor = [239, 68, 68]; // red
                        data.cell.styles.fontStyle = 'bold';
                    } else if (status === 'Vence em Breve') {
                        data.cell.styles.textColor = [245, 158, 11]; // amber
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [34, 197, 94]; // green
                    }
                }
            }
        });

        return doc.lastAutoTable.finalY + 10;
    }

    /**
     * Adiciona informações da receita
     */
    private addRecipeInfo(doc: any, recipe: Recipe, startY: number): number {
        doc.setFontSize(10);
        doc.setTextColor(...this.MUTED_COLOR);

        const info = [
            `⏱️ Tempo de Preparo: ${recipe.tempoFormatado}`,
            `🍽️ Porções: ${recipe.porcao}`,
            `📊 Dificuldade: ${recipe.dificuldade || 'Não especificada'}`
        ];

        if (recipe.calorias) {
            info.push(`🔥 Calorias: ${recipe.calorias} kcal`);
        }

        info.forEach((text, index) => {
            doc.text(text, 14, startY + (index * 6));
        });

        return startY + (info.length * 6) + 10;
    }

    /**
     * Adiciona lista de ingredientes
     */
    private addIngredients(
        doc: any,
        ingredientes: string[],
        startY: number,
        pageHeight: number
    ): number {
        let currentY = startY;

        // Título da seção
        doc.setFontSize(14);
        doc.setTextColor(...this.SECONDARY_COLOR);
        doc.text('Ingredientes', 14, currentY);
        currentY += 10;

        // Lista de ingredientes
        doc.setFontSize(10);
        doc.setTextColor(...this.TEXT_COLOR);

        ingredientes.forEach((ingrediente, index) => {
            // Verificar espaço
            if (currentY > pageHeight - 30) {
                doc.addPage();
                currentY = 20;
            }

            doc.text(`• ${ingrediente}`, 20, currentY);
            currentY += 6;
        });

        return currentY + 10;
    }

    /**
     * Adiciona modo de preparo
     */
    private addInstructions(
        doc: any,
        instructions: string[],
        startY: number,
        pageHeight: number
    ): number {
        let currentY = startY;

        // Título da seção
        doc.setFontSize(14);
        doc.setTextColor(...this.SECONDARY_COLOR);
        doc.text('Modo de Preparo', 14, currentY);
        currentY += 10;

        // Lista de passos
        doc.setFontSize(10);
        doc.setTextColor(...this.TEXT_COLOR);

        instructions.forEach((instruction, index) => {
            // Verificar espaço
            if (currentY > pageHeight - 40) {
                doc.addPage();
                currentY = 20;
            }

            // Número do passo
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}.`, 14, currentY);

            // Texto do passo (com wrap)
            doc.setFont(undefined, 'normal');
            const lines = doc.splitTextToSize(instruction, 170);
            doc.text(lines, 22, currentY);

            currentY += lines.length * 5 + 3;
        });

        return currentY + 10;
    }

    /**
     * Adiciona tags
     */
    private addTags(doc: any, tags: string[], startY: number): number {
        doc.setFontSize(10);
        doc.setTextColor(...this.MUTED_COLOR);
        doc.text(`Tags: ${tags.join(', ')}`, 14, startY);

        return startY + 10;
    }

    /**
     * Adiciona detalhes de estatísticas
     */
    private addStatisticsDetails(doc: any, stats: any, startY: number): number {
        let currentY = startY;

        // Adicionar gráficos/tabelas de estatísticas
        // Implementar conforme necessidade

        return currentY;
    }

    /**
     * Adiciona footer
     */
    private addFooter(doc: any, pageWidth: number, pageHeight: number): void {
        const pageCount = doc.internal.pages.length - 1;

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...this.MUTED_COLOR);

            const footerText = `Página ${i} de ${pageCount} - SmartRoutine © ${new Date().getFullYear()}`;
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
    }

    /**
     * Agrupa itens por categoria
     */
    private groupByCategory(items: Array<any>): Record<string, any[]> {
        return items.reduce((acc, item) => {
            const category = item.category || 'Outros';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, any[]>);
    }

    /**
     * Adiciona linha
     */
    private addLine(doc: any, startX: number, startY: number, endX: number): void {
        doc.setDrawColor(...this.MUTED_COLOR);
        doc.line(startX, startY, endX, startY);
    }

    /**
     * Adiciona box
     */
    private addBox(
        doc: any,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor?: number[]
    ): void {
        if (fillColor) {
            doc.setFillColor(...fillColor);
            doc.rect(x, y, width, height, 'F');
        } else {
            doc.setDrawColor(...this.MUTED_COLOR);
            doc.rect(x, y, width, height);
        }
    }
}

// Singleton instance
export const pdfGenerator = new PDFGenerator();