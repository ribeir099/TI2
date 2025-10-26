/**
* Entidade ReceitaFavorita - Representa uma receita favorita de um usuário
* 
* Relacionamento many-to-many entre User e Recipe
*/
export class ReceitaFavorita {
    public readonly id: number;
    public readonly usuarioId: string;
    public readonly receitaId: number;
    public readonly nomeUsuario: string;
    public readonly tituloReceita: string;
    public readonly dataAdicao: string;

    constructor(
        id: number,
        usuarioId: string,
        receitaId: number,
        nomeUsuario: string,
        tituloReceita: string,
        dataAdicao: string
    ) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.receitaId = receitaId;
        this.nomeUsuario = nomeUsuario;
        this.tituloReceita = tituloReceita;
        this.dataAdicao = dataAdicao;

        this.validate();
    }

    /**
     * Validações da entidade
     */
    private validate(): void {
        if (!this.usuarioId || this.usuarioId.trim().length === 0) {
            throw new Error('ID do usuário é obrigatório');
        }

        if (!this.receitaId || this.receitaId <= 0) {
            throw new Error('ID da receita é obrigatório');
        }

        if (!this.dataAdicao) {
            throw new Error('Data de adição é obrigatória');
        }
    }

    /**
     * Calcula dias desde que foi adicionada aos favoritos
     */
    get diasDesFavorito(): number {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const adicao = new Date(this.dataAdicao);
        adicao.setHours(0, 0, 0, 0);

        const diffTime = hoje.getTime() - adicao.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Retorna data de adição formatada
     */
    get dataAdicaoFormatada(): string {
        return new Date(this.dataAdicao).toLocaleDateString('pt-BR');
    }

    /**
     * Retorna data e hora de adição formatada
     */
    get dataHoraAdicaoFormatada(): string {
        const data = new Date(this.dataAdicao);
        return data.toLocaleString('pt-BR');
    }

    /**
     * Verifica se é um favorito recente (menos de 7 dias)
     */
    get isFavoritoRecente(): boolean {
        return this.diasDesFavorito <= 7;
    }

    /**
     * Verifica se é um favorito antigo (mais de 30 dias)
     */
    get isFavoritoAntigo(): boolean {
        return this.diasDesFavorito > 30;
    }

    /**
     * Retorna mensagem de tempo desde favoritado
     */
    get tempoDesdeAdicao(): string {
        const dias = this.diasDesFavorito;

        if (dias === 0) {
            return 'Adicionado hoje';
        } else if (dias === 1) {
            return 'Adicionado ontem';
        } else if (dias <= 7) {
            return `Adicionado há ${dias} dias`;
        } else if (dias <= 30) {
            const semanas = Math.floor(dias / 7);
            return `Adicionado há ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
        } else if (dias <= 365) {
            const meses = Math.floor(dias / 30);
            return `Adicionado há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
        } else {
            const anos = Math.floor(dias / 365);
            return `Adicionado há ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
        }
    }

    /**
     * Cria instância a partir de DTO da API
     */
    static fromDTO(dto: any): ReceitaFavorita {
        return new ReceitaFavorita(
            dto.id || 0,
            dto.usuarioId || dto.usuario_id || '',
            dto.receitaId || dto.receita_id || 0,
            dto.nomeUsuario || dto.nome_usuario || '',
            dto.tituloReceita || dto.titulo_receita || '',
            dto.dataAdicao || dto.data_adicao || new Date().toISOString()
        );
    }

    /**
     * Converte para objeto simples (DTO)
     */
    toDTO(): any {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            receitaId: this.receitaId,
            nomeUsuario: this.nomeUsuario,
            tituloReceita: this.tituloReceita,
            dataAdicao: this.dataAdicao
        };
    }

    /**
     * Converte para formato de API (POST)
     */
    toAPIFormat(): any {
        return {
            usuarioId: this.usuarioId,
            receitaId: this.receitaId
        };
    }

    /**
     * Verifica se dois favoritos são iguais
     */
    equals(other: ReceitaFavorita): boolean {
        return this.id === other.id;
    }

    /**
     * Verifica se pertence a um usuário
     */
    pertenceAoUsuario(usuarioId: string): boolean {
        return this.usuarioId === usuarioId;
    }

    /**
     * Verifica se é favorito de uma receita
     */
    eFavoritoDaReceita(receitaId: number): boolean {
        return this.receitaId === receitaId;
    }
}