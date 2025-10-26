/**
* Entidade Registra - Representa um registro de compra de alimento
* 
* Esta entidade é usada quando precisamos do relacionamento completo
* entre usuário, alimento e registro de compra
*/
export class Registra {
    public readonly id: number;
    public readonly usuarioId: string;
    public readonly alimentoId: number;
    public readonly nomeUsuario: string;
    public readonly nomeAlimento: string;
    public readonly dataCompra: string;
    public readonly dataValidade: string;
    public readonly quantidade: number;
    public readonly unidadeMedida: string;
    public readonly lote?: string;

    constructor(
        id: number,
        usuarioId: string,
        alimentoId: number,
        nomeUsuario: string,
        nomeAlimento: string,
        dataCompra: string,
        dataValidade: string,
        quantidade: number,
        unidadeMedida: string,
        lote?: string
    ) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.alimentoId = alimentoId;
        this.nomeUsuario = nomeUsuario;
        this.nomeAlimento = nomeAlimento;
        this.dataCompra = dataCompra;
        this.dataValidade = dataValidade;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.lote = lote;

        this.validate();
    }

    /**
     * Validações da entidade
     */
    private validate(): void {
        if (!this.usuarioId || this.usuarioId.trim().length === 0) {
            throw new Error('ID do usuário é obrigatório');
        }

        if (!this.alimentoId || this.alimentoId <= 0) {
            throw new Error('ID do alimento é obrigatório');
        }

        if (!this.dataCompra) {
            throw new Error('Data de compra é obrigatória');
        }

        if (!this.dataValidade) {
            throw new Error('Data de validade é obrigatória');
        }

        if (!this.quantidade || this.quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        if (!this.unidadeMedida || this.unidadeMedida.trim().length === 0) {
            throw new Error('Unidade de medida é obrigatória');
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
     * Calcula dias desde a compra
     */
    get diasDesdeCompra(): number {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const compra = new Date(this.dataCompra);
        compra.setHours(0, 0, 0, 0);

        const diffTime = hoje.getTime() - compra.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calcula duração total da validade (compra até vencimento)
     */
    get duracaoValidade(): number {
        const compra = new Date(this.dataCompra);
        compra.setHours(0, 0, 0, 0);

        const validade = new Date(this.dataValidade);
        validade.setHours(0, 0, 0, 0);

        const diffTime = validade.getTime() - compra.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Verifica se está vencido
     */
    get isVencido(): boolean {
        return this.diasAteVencimento < 0;
    }

    /**
     * Verifica se está vencendo em breve
     */
    isVencendoEmBreve(diasLimite: number = 3): boolean {
        const dias = this.diasAteVencimento;
        return dias >= 0 && dias <= diasLimite;
    }

    /**
     * Retorna descrição da quantidade
     */
    get descricaoQuantidade(): string {
        const qtd = this.quantidade % 1 === 0
            ? this.quantidade.toString()
            : this.quantidade.toFixed(2).replace(/\.?0+$/, '');

        return `${qtd} ${this.unidadeMedida}`;
    }

    /**
     * Retorna data de compra formatada
     */
    get dataCompraFormatada(): string {
        return new Date(this.dataCompra).toLocaleDateString('pt-BR');
    }

    /**
     * Retorna data de validade formatada
     */
    get dataValidadeFormatada(): string {
        return new Date(this.dataValidade).toLocaleDateString('pt-BR');
    }

    /**
     * Retorna resumo do registro
     */
    get resumo(): string {
        return `${this.nomeAlimento} - ${this.descricaoQuantidade} - ${this.dataValidadeFormatada}`;
    }

    /**
     * Cria instância a partir de DTO da API
     */
    static fromDTO(dto: any): Registra {
        return new Registra(
            dto.id || 0,
            dto.usuarioId || dto.usuario_id || '',
            dto.alimentoId || dto.alimento_id || 0,
            dto.nomeUsuario || dto.nome_usuario || '',
            dto.nomeAlimento || dto.nome_alimento || '',
            dto.dataCompra || dto.data_compra || '',
            dto.dataValidade || dto.data_validade || '',
            dto.quantidade || 0,
            dto.unidadeMedida || dto.unidade_medida || '',
            dto.lote
        );
    }

    /**
     * Converte para objeto simples (DTO)
     */
    toDTO(): any {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            alimentoId: this.alimentoId,
            nomeUsuario: this.nomeUsuario,
            nomeAlimento: this.nomeAlimento,
            dataCompra: this.dataCompra,
            dataValidade: this.dataValidade,
            quantidade: this.quantidade,
            unidadeMedida: this.unidadeMedida,
            lote: this.lote
        };
    }

    /**
     * Converte para formato de API (POST/PUT)
     */
    toAPIFormat(): any {
        return {
            alimentoId: this.alimentoId,
            usuarioId: this.usuarioId,
            dataCompra: this.dataCompra,
            dataValidade: this.dataValidade,
            unidadeMedida: this.unidadeMedida,
            quantidade: this.quantidade,
            lote: this.lote
        };
    }

    /**
     * Verifica se dois registros são iguais
     */
    equals(other: Registra): boolean {
        return this.id === other.id;
    }

    /**
     * Clona o registro com novos dados
     */
    clone(updates: Partial<{
        dataCompra: string;
        dataValidade: string;
        quantidade: number;
        unidadeMedida: string;
        lote: string;
    }>): Registra {
        return new Registra(
            this.id,
            this.usuarioId,
            this.alimentoId,
            this.nomeUsuario,
            this.nomeAlimento,
            updates.dataCompra ?? this.dataCompra,
            updates.dataValidade ?? this.dataValidade,
            updates.quantidade ?? this.quantidade,
            updates.unidadeMedida ?? this.unidadeMedida,
            updates.lote ?? this.lote
        );
    }
}