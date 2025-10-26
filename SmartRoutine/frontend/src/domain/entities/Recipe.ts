/**
* Entidade Recipe - Representa uma receita culinária
*/
export class Recipe {
    public readonly id: number;
    public readonly titulo: string;
    public readonly tempoPreparo: number;
    public readonly porcao: string;
    public readonly imagem: string;
    public readonly ingredientes: string[];
    public readonly modoPreparo: string[];
    public readonly dificuldade?: string;
    public readonly tipoRefeicao?: string;
    public readonly calorias?: number;
    public readonly tags?: string[];
    public isFavorita: boolean;

    constructor(
        id: number,
        titulo: string,
        tempoPreparo: number,
        porcao: string,
        imagem: string,
        ingredientes: string[],
        modoPreparo: string[],
        dificuldade?: string,
        tipoRefeicao?: string,
        calorias?: number,
        tags?: string[],
        isFavorita: boolean = false
    ) {
        this.id = id;
        this.titulo = titulo;
        this.tempoPreparo = tempoPreparo;
        this.porcao = porcao;
        this.imagem = imagem;
        this.ingredientes = ingredientes;
        this.modoPreparo = modoPreparo;
        this.dificuldade = dificuldade;
        this.tipoRefeicao = tipoRefeicao;
        this.calorias = calorias;
        this.tags = tags;
        this.isFavorita = isFavorita;

        this.validate();
    }

    /**
     * Validações da entidade
     */
    private validate(): void {
        if (!this.titulo || this.titulo.trim().length === 0) {
            throw new Error('Título da receita é obrigatório');
        }

        if (!this.tempoPreparo || this.tempoPreparo <= 0) {
            throw new Error('Tempo de preparo deve ser maior que zero');
        }

        if (!this.ingredientes || this.ingredientes.length === 0) {
            throw new Error('Receita deve ter pelo menos um ingrediente');
        }

        if (!this.modoPreparo || this.modoPreparo.length === 0) {
            throw new Error('Receita deve ter pelo menos um passo no modo de preparo');
        }
    }

    /**
     * Retorna tempo de preparo formatado
     */
    get tempoFormatado(): string {
        if (this.tempoPreparo < 60) {
            return `${this.tempoPreparo} min`;
        }

        const horas = Math.floor(this.tempoPreparo / 60);
        const minutos = this.tempoPreparo % 60;

        if (minutos === 0) {
            return `${horas}h`;
        }

        return `${horas}h ${minutos}min`;
    }

    /**
     * Retorna quantidade de ingredientes
     */
    get quantidadeIngredientes(): number {
        return this.ingredientes.length;
    }

    /**
     * Retorna quantidade de passos
     */
    get quantidadePassos(): number {
        return this.modoPreparo.length;
    }

    /**
     * Verifica se a receita é rápida (até 30 minutos)
     */
    get isRapida(): boolean {
        return this.tempoPreparo <= 30;
    }

    /**
     * Verifica se a receita é média (31-60 minutos)
     */
    get isMedia(): boolean {
        return this.tempoPreparo > 30 && this.tempoPreparo <= 60;
    }

    /**
     * Verifica se a receita é demorada (mais de 60 minutos)
     */
    get isDemorada(): boolean {
        return this.tempoPreparo > 60;
    }

    /**
     * Retorna classificação de tempo
     */
    get classificacaoTempo(): 'Rápida' | 'Média' | 'Demorada' {
        if (this.isRapida) return 'Rápida';
        if (this.isMedia) return 'Média';
        return 'Demorada';
    }

    /**
     * Verifica se a receita tem baixa caloria (até 300 kcal)
     */
    get isBaixaCaloria(): boolean {
        return this.calorias !== undefined && this.calorias <= 300;
    }

    /**
     * Verifica se a receita tem média caloria (301-500 kcal)
     */
    get isMediaCaloria(): boolean {
        return this.calorias !== undefined && this.calorias > 300 && this.calorias <= 500;
    }

    /**
     * Verifica se a receita tem alta caloria (mais de 500 kcal)
     */
    get isAltaCaloria(): boolean {
        return this.calorias !== undefined && this.calorias > 500;
    }

    /**
     * Retorna texto de calorias formatado
     */
    get caloriasFormatadas(): string | null {
        if (!this.calorias) return null;
        return `${this.calorias} kcal`;
    }

    /**
     * Alterna estado de favorito
     */
    toggleFavorite(): void {
        this.isFavorita = !this.isFavorita;
    }

    /**
     * Define como favorita
     */
    marcarFavorita(): void {
        this.isFavorita = true;
    }

    /**
     * Remove dos favoritos
     */
    desmarcarFavorita(): void {
        this.isFavorita = false;
    }

    /**
     * Verifica se tem um ingrediente específico
     */
    hasIngrediente(ingrediente: string): boolean {
        return this.ingredientes.some(ing =>
            ing.toLowerCase().includes(ingrediente.toLowerCase())
        );
    }

    /**
     * Verifica se tem múltiplos ingredientes
     */
    hasIngredientes(ingredientes: string[]): boolean {
        return ingredientes.every(ing => this.hasIngrediente(ing));
    }

    /**
     * Verifica se tem algum dos ingredientes
     */
    hasAlgumIngrediente(ingredientes: string[]): boolean {
        return ingredientes.some(ing => this.hasIngrediente(ing));
    }

    /**
     * Verifica se tem uma tag específica
     */
    hasTag(tag: string): boolean {
        if (!this.tags) return false;
        return this.tags.some(t => t.toLowerCase() === tag.toLowerCase());
    }

    /**
     * Verifica se tem múltiplas tags
     */
    hasTags(tags: string[]): boolean {
        if (!this.tags) return false;
        return tags.every(tag => this.hasTag(tag));
    }

    /**
     * Verifica se o título contém um termo
     */
    contemTitulo(termo: string): boolean {
        return this.titulo.toLowerCase().includes(termo.toLowerCase());
    }

    /**
     * Calcula score de match com ingredientes disponíveis
     * Retorna percentual de ingredientes disponíveis
     */
    calcularMatchIngredientes(ingredientesDisponiveis: string[]): number {
        const totalIngredientes = this.ingredientes.length;
        if (totalIngredientes === 0) return 0;

        const ingredientesEncontrados = this.ingredientes.filter(ing =>
            ingredientesDisponiveis.some(disp =>
                ing.toLowerCase().includes(disp.toLowerCase()) ||
                disp.toLowerCase().includes(ing.toLowerCase())
            )
        ).length;

        return Math.round((ingredientesEncontrados / totalIngredientes) * 100);
    }

    /**
     * Verifica se pode ser feita com ingredientes disponíveis
     */
    podeFazerCom(ingredientesDisponiveis: string[], percentualMinimo: number = 80): boolean {
        const match = this.calcularMatchIngredientes(ingredientesDisponiveis);
        return match >= percentualMinimo;
    }

    /**
     * Retorna ingredientes que estão faltando
     */
    ingredientesFaltando(ingredientesDisponiveis: string[]): string[] {
        return this.ingredientes.filter(ing =>
            !ingredientesDisponiveis.some(disp =>
                ing.toLowerCase().includes(disp.toLowerCase()) ||
                disp.toLowerCase().includes(ing.toLowerCase())
            )
        );
    }

    /**
     * Retorna ingredientes que estão disponíveis
     */
    ingredientesDisponiveis(ingredientesDisponiveis: string[]): string[] {
        return this.ingredientes.filter(ing =>
            ingredientesDisponiveis.some(disp =>
                ing.toLowerCase().includes(disp.toLowerCase()) ||
                disp.toLowerCase().includes(ing.toLowerCase())
            )
        );
    }

    /**
     * Retorna resumo da receita
     */
    get resumo(): string {
        return `${this.titulo} - ${this.tempoFormatado} - ${this.quantidadeIngredientes} ingredientes`;
    }

    /**
     * Cria instância a partir de DTO da API
     */
    static fromDTO(dto: any): Recipe {
        // Extrai informações do objeto JSONB 'informacoes'
        const info = dto.informacoes || {};

        return new Recipe(
            dto.id || 0,
            dto.titulo || dto.name || dto.title || '',
            dto.tempoPreparo || dto.tempo_prep || parseInt(dto.time) || 0,
            dto.porcao || dto.servings || '2-4 porções',
            dto.imagem || dto.image || info.imagem || '',
            info.ingredientes || dto.ingredientes || dto.ingredients || [],
            info.modo_preparo || dto.modoPreparo || dto.steps || [],
            info.dificuldade || dto.dificuldade,
            info.tipo_refeicao || dto.tipoRefeicao,
            info.calorias || dto.calorias,
            info.tags || dto.tags || [],
            dto.isFavorita || dto.isFavorite || false
        );
    }

    /**
     * Converte para objeto simples (DTO)
     */
    toDTO(): any {
        return {
            id: this.id,
            titulo: this.titulo,
            tempoPreparo: this.tempoPreparo,
            porcao: this.porcao,
            imagem: this.imagem,
            informacoes: {
                ingredientes: this.ingredientes,
                modo_preparo: this.modoPreparo,
                dificuldade: this.dificuldade,
                tipo_refeicao: this.tipoRefeicao,
                calorias: this.calorias,
                tags: this.tags
            },
            isFavorita: this.isFavorita
        };
    }

    /**
     * Converte para formato de API (POST/PUT)
     */
    toAPIFormat(): any {
        return {
            titulo: this.titulo,
            porcao: this.porcao,
            tempoPreparo: this.tempoPreparo,
            informacoes: {
                ingredientes: this.ingredientes,
                modo_preparo: this.modoPreparo,
                dificuldade: this.dificuldade || 'Fácil',
                tipo_refeicao: this.tipoRefeicao || 'Almoço/Jantar',
                calorias: this.calorias || 0,
                tags: this.tags || []
            }
        };
    }

    /**
     * Clona a receita com novos dados
     */
    clone(updates: Partial<{
        titulo: string;
        tempoPreparo: number;
        porcao: string;
        imagem: string;
        ingredientes: string[];
        modoPreparo: string[];
        dificuldade: string;
        tipoRefeicao: string;
        calorias: number;
        tags: string[];
        isFavorita: boolean;
    }>): Recipe {
        return new Recipe(
            this.id,
            updates.titulo ?? this.titulo,
            updates.tempoPreparo ?? this.tempoPreparo,
            updates.porcao ?? this.porcao,
            updates.imagem ?? this.imagem,
            updates.ingredientes ?? this.ingredientes,
            updates.modoPreparo ?? this.modoPreparo,
            updates.dificuldade ?? this.dificuldade,
            updates.tipoRefeicao ?? this.tipoRefeicao,
            updates.calorias ?? this.calorias,
            updates.tags ?? this.tags,
            updates.isFavorita ?? this.isFavorita
        );
    }

    /**
     * Verifica se duas receitas são iguais
     */
    equals(other: Recipe): boolean {
        return this.id === other.id;
    }
}