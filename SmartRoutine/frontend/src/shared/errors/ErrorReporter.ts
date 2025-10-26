import { AppError } from './AppError';
import { ErrorContext } from './ErrorHandler';

/**
* Relatório de erro
*/
export interface ErrorReport {
    id: string;
    title: string;
    description: string;
    error: {
        name: string;
        message: string;
        stack?: string;
    };
    context?: ErrorContext;
    userEmail?: string;
    screenshot?: string;
    timestamp: Date;
}

/**
* Reporter de Erros (Feedback de Usuário)
* 
* Responsabilidades:
* - Permitir usuário reportar erros
* - Coletar contexto adicional
* - Capturar screenshot
* - Enviar para equipe de suporte
*/
export class ErrorReporter {
    /**
     * Cria relatório de erro
     */
    static async createReport(
        error: Error | AppError,
        userDescription?: string,
        userEmail?: string
    ): Promise<ErrorReport> {
        const report: ErrorReport = {
            id: this.generateReportId(),
            title: this.getReportTitle(error),
            description: userDescription || 'Nenhuma descrição fornecida',
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            context: this.collectContext(),
            userEmail,
            timestamp: new Date()
        };

        // Capturar screenshot se possível
        try {
            const screenshot = await this.captureScreenshot();
            report.screenshot = screenshot;
        } catch (error) {
            console.warn('Não foi possível capturar screenshot:', error);
        }

        return report;
    }

    /**
     * Envia relatório
     */
    static async sendReport(report: ErrorReport): Promise<boolean> {
        try {
            // TODO: Implementar envio para backend/serviço
            console.log('📤 Error report sent:', report);

            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 1000));

            return true;
        } catch (error) {
            console.error('Erro ao enviar relatório:', error);
            return false;
        }
    }

    /**
     * Gera ID do relatório
     */
    private static generateReportId(): string {
        return `report_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Obtém título do relatório
     */
    private static getReportTitle(error: Error): string {
        if (error instanceof AppError) {
            return `[${error.statusCode}] ${error.name}`;
        }
        return error.name;
    }

    /**
     * Coleta contexto do erro
     */
    private static collectContext(): ErrorContext {
        return {
            additionalInfo: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Captura screenshot (usando html2canvas se disponível)
     */
    private static async captureScreenshot(): Promise<string | undefined> {
        // TODO: Implementar com html2canvas ou similar
        /*
        const canvas = await html2canvas(document.body);
        return canvas.toDataURL('image/png');
        */
        return undefined;
    }

    /**
     * Abre modal de report de erro
     */
    static openReportModal(error: Error | AppError): void {
        // TODO: Implementar modal de report
        console.log('📝 Opening error report modal for:', error);
    }
}