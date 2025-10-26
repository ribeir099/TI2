/**
* Enum para status de validade de alimentos
*/
export enum ExpirationStatus {
    VENCIDO = 'vencido',
    VENCENDO = 'vencendo',
    FRESCO = 'fresco'
}

/**
* Value Object para Status de Validade
* 
* Responsabilidades:
* - Encapsular lógica de status de validade
* - Fornecer métodos utilitários para trabalhar com status
* - Centralizar labels, cores e ícones
*/
export class ExpirationStatusVO {
    private readonly status: ExpirationStatus;

    private constructor(status: ExpirationStatus) {
        this.status = status;
    }

    /**
     * Cria um ExpirationStatusVO a partir de dias até vencimento
     */
    static fromDays(daysUntilExpiry: number): ExpirationStatusVO {
        if (daysUntilExpiry < 0) {
            return new ExpirationStatusVO(ExpirationStatus.VENCIDO);
        } else if (daysUntilExpiry <= 3) {
            return new ExpirationStatusVO(ExpirationStatus.VENCENDO);
        }
        return new ExpirationStatusVO(ExpirationStatus.FRESCO);
    }

    /**
     * Cria um ExpirationStatusVO diretamente
     */
    static create(status: ExpirationStatus): ExpirationStatusVO {
        return new ExpirationStatusVO(status);
    }

    /**
     * Retorna o status
     */
    getValue(): ExpirationStatus {
        return this.status;
    }

    /**
     * Retorna label do status em português
     */
    get label(): string {
        return ExpirationStatusVO.getLabel(this.status);
    }

    /**
     * Retorna label estático
     */
    static getLabel(status: ExpirationStatus): string {
        const labels: Record<ExpirationStatus, string> = {
            [ExpirationStatus.VENCIDO]: 'Vencido',
            [ExpirationStatus.VENCENDO]: 'Vence em Breve',
            [ExpirationStatus.FRESCO]: 'Fresco'
        };
        return labels[status];
    }

    /**
     * Retorna variante para componente Badge (shadcn/ui)
     */
    get variant(): 'destructive' | 'default' | 'secondary' {
        return ExpirationStatusVO.getVariant(this.status);
    }

    /**
     * Retorna variante estática
     */
    static getVariant(status: ExpirationStatus): 'destructive' | 'default' | 'secondary' {
        const variants: Record<ExpirationStatus, 'destructive' | 'default' | 'secondary'> = {
            [ExpirationStatus.VENCIDO]: 'destructive',
            [ExpirationStatus.VENCENDO]: 'default',
            [ExpirationStatus.FRESCO]: 'secondary'
        };
        return variants[status];
    }

    /**
     * Retorna cor para o status
     */
    get color(): string {
        return ExpirationStatusVO.getColor(this.status);
    }

    /**
     * Retorna cor estática
     */
    static getColor(status: ExpirationStatus): string {
        const colors: Record<ExpirationStatus, string> = {
            [ExpirationStatus.VENCIDO]: '#ef4444', // red-500
            [ExpirationStatus.VENCENDO]: '#f59e0b', // amber-500
            [ExpirationStatus.FRESCO]: '#10b981'    // green-500
        };
        return colors[status];
    }

    /**
     * Retorna classe CSS para o status
     */
    get cssClass(): string {
        return ExpirationStatusVO.getCssClass(this.status);
    }

    /**
     * Retorna classe CSS estática
     */
    static getCssClass(status: ExpirationStatus): string {
        const classes: Record<ExpirationStatus, string> = {
            [ExpirationStatus.VENCIDO]: 'bg-red-500 text-white',
            [ExpirationStatus.VENCENDO]: 'bg-amber-500 text-white',
            [ExpirationStatus.FRESCO]: 'bg-green-500 text-white'
        };
        return classes[status];
    }

    /**
     * Retorna ícone sugerido (nome do ícone lucide-react)
     */
    get icon(): string {
        return ExpirationStatusVO.getIcon(this.status);
    }

    /**
     * Retorna ícone estático
     */
    static getIcon(status: ExpirationStatus): string {
        const icons: Record<ExpirationStatus, string> = {
            [ExpirationStatus.VENCIDO]: 'XCircle',
            [ExpirationStatus.VENCENDO]: 'AlertTriangle',
            [ExpirationStatus.FRESCO]: 'CheckCircle'
        };
        return icons[status];
    }

    /**
     * Retorna prioridade do status (para ordenação)
     * Maior número = maior prioridade
     */
    get priority(): number {
        return ExpirationStatusVO.getPriority(this.status);
    }

    /**
     * Retorna prioridade estática
     */
    static getPriority(status: ExpirationStatus): number {
        const priorities: Record<ExpirationStatus, number> = {
            [ExpirationStatus.VENCIDO]: 3,
            [ExpirationStatus.VENCENDO]: 2,
            [ExpirationStatus.FRESCO]: 1
        };
        return priorities[status];
    }

    /**
     * Verifica se está vencido
     */
    get isVencido(): boolean {
        return this.status === ExpirationStatus.VENCIDO;
    }

    /**
     * Verifica se está vencendo
     */
    get isVencendo(): boolean {
        return this.status === ExpirationStatus.VENCENDO;
    }

    /**
     * Verifica se está fresco
     */
    get isFresco(): boolean {
        return this.status === ExpirationStatus.FRESCO;
    }

    /**
     * Verifica se precisa de atenção (vencido ou vencendo)
     */
    get needsAttention(): boolean {
        return this.isVencido || this.isVencendo;
    }

    /**
     * Retorna mensagem descritiva
     */
    get message(): string {
        const messages: Record<ExpirationStatus, string> = {
            [ExpirationStatus.VENCIDO]: 'Este produto está vencido e deve ser descartado',
            [ExpirationStatus.VENCENDO]: 'Este produto está próximo do vencimento. Consuma em breve',
            [ExpirationStatus.FRESCO]: 'Este produto está dentro do prazo de validade'
        };
        return messages[this.status];
    }

    /**
     * Compara com outro ExpirationStatusVO
     */
    equals(other: ExpirationStatusVO): boolean {
        if (!(other instanceof ExpirationStatusVO)) {
            return false;
        }
        return this.status === other.status;
    }

    /**
     * Converte para string
     */
    toString(): string {
        return this.status;
    }

    /**
     * Serialização JSON
     */
    toJSON(): string {
        return this.status;
    }

    /**
     * Lista todos os status disponíveis
     */
    static all(): ExpirationStatus[] {
        return [
            ExpirationStatus.VENCIDO,
            ExpirationStatus.VENCENDO,
            ExpirationStatus.FRESCO
        ];
    }

    /**
     * Retorna todos os status como ExpirationStatusVO
     */
    static allAsVO(): ExpirationStatusVO[] {
        return ExpirationStatusVO.all().map(status =>
            new ExpirationStatusVO(status)
        );
    }
}