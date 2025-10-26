import { ExpirationStatus } from '../value-objects/ExpirationStatus';

/**
* Entidade FoodItem - Representa um item de alimento na despensa
* 
* Combina informações de Alimento e Registra (compra)
*/
export class FoodItem {
    public readonly id: number;
    public readonly nome: string;
    public readonly quantidade: number;
    public readonly unidadeMedida: string;
    public readonly dataValidade: string;
    public readonly categoria: string;
    public readonly dataCompra?: string;
    public readonly lote?: string;
    public readonly usuarioId?: string;
    public readonly alimentoId?: number;

    constructor(
        id: number,
        nome: string,
        quantidade: number,
        unidadeMedida: string,
        dataValidade: string,
        categoria: string,
        dataCompra?: string,
        lote?: string,
        usuarioId?: string,
        alimentoId?: number
    ) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.dataValidade = dataValidade;
        this.categoria = categoria;
        this.dataCompra = dataCompra;
        this.lote = lote;
        this.usuarioId = usuarioId;
        this.alimentoId = alimentoId;

        this.validate();
    }

    /**
     * Validações da entidade
     */
    private validate(): void {
        if (!this.nome || this.nome.trim().length === 0) {
            throw new Error('Nome do alimento é obrigatório');
        }

        if (!this.quantidade || this.quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        if (!this.unidadeMedida || this.unidadeMedida.trim().length === 0) {
            throw new Error('Unidade de medida é obrigatória');
        }

        if (!this.dataValidade) {
            throw new Error('Data de validade é obrigatória');
        }

        if (!this.categoria || this.categoria.trim().length === 0) {
            throw new Error('Categoria é obrigatória');
        }
    }

    /**
     * Calcula dias até o vencimento
     */
    get diasAteVencimento(): number {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const validade = new Date(this.dataValidade);
        validade.setHours(0, 0, 0, 0);

        const diffTime = validade.getTime() - hoje.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Retorna o status de validade do alimento
     */
    get status(): ExpirationStatus {
        const dias = this.diasAteVencimento;

        if (dias < 0) {
            return ExpirationStatus.VENCIDO;
        } else if (dias <= 3) {
            return ExpirationStatus.VENCENDO;
        }
        return ExpirationStatus.FRESCO;
    }

    /**
     * Retorna descrição completa da quantidade
     */
    get descricaoQuantidade(): string {
        return `${this.formatarQuantidade()} ${this.unidadeMedida}`;
    }

    /**
     * Formata a quantidade (remove zeros desnecessários)
     */
    private formatarQuantidade(): string {
        return this.quantidade % 1 === 0
            ? this.quantidade.toString()
            : this.quantidade.toFixed(2).replace(/\.?0+$/, '');
    }

    /**
     * Verifica se o alimento está vencido
     */
    isVencido(): boolean {
        return this.diasAteVencimento < 0;
    }

    /**
     * Verifica se o alimento está vencendo em breve
     */
    isVencendoEmBreve(diasLimite: number = 3): boolean {
        const dias = this.diasAteVencimento;
        return dias >= 0 && dias <= diasLimite;
    }

    /**
     * Verifica se o alimento está fresco
     */
    isFresco(diasLimite: number = 3): boolean {
        return this.diasAteVencimento > diasLimite;
    }

    /**
     * Retorna data de validade formatada (dd/mm/yyyy)
     */
    get dataValidadeFormatada(): string {
        const data = new Date(this.dataValidade);
        return data.toLocaleDateString('pt-BR');
    }

    /**
     * Retorna data de compra formatada (dd/mm/yyyy)
     */
    get dataCompraFormatada(): string | null {
        if (!this.dataCompra) return null;
        const data = new Date(this.dataCompra);
        return data.toLocaleDateString('pt-BR');
    }

    /**
     * Calcula tempo desde a compra em dias
     */
    get diasDesdeCompra(): number | null {
        if (!this.dataCompra) return null;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const compra = new Date(this.dataCompra);
        compra.setHours(0, 0, 0, 0);

        const diffTime = hoje.getTime() - compra.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calcula tempo de validade total (compra até vencimento)
     */
    get diasValidadeTotal(): number | null {
        if (!this.dataCompra) return null;

        const compra = new Date(this.dataCompra);
        compra.setHours(0, 0, 0, 0);

        const validade = new Date(this.dataValidade);
        validade.setHours(0, 0, 0, 0);

        const diffTime = validade.getTime() - compra.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calcula percentual de validade restante
     */
    get percentualValidadeRestante(): number {
        const total = this.diasValidadeTotal;
        if (!total || total <= 0) return 0;

        const restante = this.diasAteVencimento;
        if (restante < 0) return 0;

        return Math.round((restante / total) * 100);
    }

    /**
     * Retorna mensagem de alerta de validade
     */
    get mensagemValidade(): string {
        const dias = this.diasAteVencimento;

        if (dias < 0) {
            const diasVencido = Math.abs(dias);
            return `Vencido há ${diasVencido} ${diasVencido === 1 ? 'dia' : 'dias'}`;
        } else if (dias === 0) {
            return 'Vence hoje';
        } else if (dias === 1) {
            return 'Vence amanhã';
        } else if (dias <= 3) {
            return `Vence em ${dias} dias`;
        } else if (dias <= 7) {
            return `Vence em ${dias} dias`;
        } else if (dias <= 30) {
            const semanas = Math.floor(dias / 7);
            return `Vence em ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
        } else {
            const meses = Math.floor(dias / 30);
            return `Vence em ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
        }
    }

    /**
     * Verifica se pertence a uma categoria específica
     */
    pertenceCategoria(categoria: string): boolean {
        return this.categoria.toLowerCase() === categoria.toLowerCase();
    }

    /**
     * Verifica se o nome contém um termo de busca
     */
    contemNome(termo: string): boolean {
        return this.nome.toLowerCase().includes(termo.toLowerCase());
    }

    /**
     * Cria instância a partir de DTO da API
     */
    static fromDTO(dto: any): FoodItem {
        // Calcula dias até vencimento se não vier na API
        let diasAteVencimento = dto.diasAteVencimento || dto.daysUntilExpiry;

        if (!diasAteVencimento && dto.dataValidade) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const validade = new Date(dto.dataValidade || dto.expirationDate);
            validade.setHours(0, 0, 0, 0);
            const diffTime = validade.getTime() - hoje.getTime();
            diasAteVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        return new FoodItem(
            dto.id || 0,
            dto.nome || dto.name || dto.nomeAlimento || '',
            dto.quantidade || dto.quantity || 0,
            dto.unidadeMedida || dto.unit || '',
            dto.dataValidade || dto.expirationDate || '',
            dto.categoria || dto.category || 'Outros',
            dto.dataCompra || dto.purchaseDate,
            dto.lote || dto.batch,
            dto.usuarioId || dto.userId,
            dto.alimentoId || dto.foodId
        );
    }

    /**
     * Converte para objeto simples (DTO)
     */
    toDTO(): any {
        return {
            id: this.id,
            nome: this.nome,
            quantidade: this.quantidade,
            unidadeMedida: this.unidadeMedida,
            dataValidade: this.dataValidade,
            categoria: this.categoria,
            dataCompra: this.dataCompra,
            lote: this.lote,
            usuarioId: this.usuarioId,
            alimentoId: this.alimentoId,
            diasAteVencimento: this.diasAteVencimento
        };
    }

    /**
     * Clona o item com novos dados
     */
    clone(updates: Partial<{
        nome: string;
        quantidade: number;
        unidadeMedida: string;
        dataValidade: string;
        categoria: string;
        dataCompra: string;
        lote: string;
    }>): FoodItem {
        return new FoodItem(
            this.id,
            updates.nome ?? this.nome,
            updates.quantidade ?? this.quantidade,
            updates.unidadeMedida ?? this.unidadeMedida,
            updates.dataValidade ?? this.dataValidade,
            updates.categoria ?? this.categoria,
            updates.dataCompra ?? this.dataCompra,
            updates.lote ?? this.lote,
            this.usuarioId,
            this.alimentoId
        );
    }

    /**
     * Verifica se dois itens são iguais
     */
    equals(other: FoodItem): boolean {
        return this.id === other.id;
    }
}