/**
* Entidade User - Representa um usuário do sistema
* 
* Responsabilidades:
* - Encapsular dados do usuário
* - Validações de regras de negócio
* - Métodos de transformação e formatação
*/
export class User {
    public readonly id: string;
    public readonly nome: string;
    public readonly email: string;
    public readonly dataNascimento: string;
    public readonly dataCriacao?: string;

    constructor(
        id: string,
        nome: string,
        email: string,
        dataNascimento: string,
        dataCriacao?: string
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.dataCriacao = dataCriacao;

        this.validate();
    }

    /**
     * Validações da entidade
     */
    private validate(): void {
        if (!this.id || this.id.trim().length === 0) {
            throw new Error('ID do usuário é obrigatório');
        }

        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            throw new Error('Email inválido');
        }

        if (!this.dataNascimento) {
            throw new Error('Data de nascimento é obrigatória');
        }
    }

    /**
     * Valida formato de email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Retorna o primeiro nome do usuário
     */
    get primeiroNome(): string {
        return this.nome.split(' ')[0];
    }

    /**
     * Retorna o sobrenome do usuário
     */
    get sobrenome(): string {
        const partes = this.nome.split(' ');
        return partes.length > 1 ? partes.slice(1).join(' ') : '';
    }

    /**
     * Retorna as iniciais do usuário (máximo 2 letras)
     */
    get iniciais(): string {
        const partes = this.nome.split(' ').filter(p => p.length > 0);

        if (partes.length === 0) return '';
        if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();

        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    /**
     * Retorna o nome completo formatado
     */
    get nomeCompleto(): string {
        return this.nome.trim();
    }

    /**
     * Calcula a idade do usuário
     */
    get idade(): number {
        const hoje = new Date();
        const nascimento = new Date(this.dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    }

    /**
     * Verifica se o usuário é maior de idade
     */
    get isMaiorDeIdade(): boolean {
        return this.idade >= 18;
    }

    /**
     * Retorna data de nascimento formatada (dd/mm/yyyy)
     */
    get dataNascimentoFormatada(): string {
        const data = new Date(this.dataNascimento);
        return data.toLocaleDateString('pt-BR');
    }

    /**
     * Retorna email mascarado para privacidade (ex: jo***@email.com)
     */
    get emailMascarado(): string {
        const [local, dominio] = this.email.split('@');
        const mascarado = local.substring(0, 2) + '***';
        return `${mascarado}@${dominio}`;
    }

    /**
     * Cria instância a partir de DTO da API
     */
    static fromDTO(dto: any): User {
        return new User(
            dto.id?.toString() || '',
            dto.nome || dto.name || '',
            dto.email || '',
            dto.dataNascimento || dto.dateOfBirth || dto.data_nasc || '',
            dto.dataCriacao || dto.createdAt
        );
    }

    /**
     * Converte para objeto simples (DTO)
     */
    toDTO(): any {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            dataNascimento: this.dataNascimento,
            dataCriacao: this.dataCriacao
        };
    }

    /**
     * Verifica se o usuário é o mesmo (por ID)
     */
    equals(other: User): boolean {
        return this.id === other.id;
    }

    /**
     * Clona o usuário com novos dados
     */
    clone(updates: Partial<{
        nome: string;
        email: string;
        dataNascimento: string;
    }>): User {
        return new User(
            this.id,
            updates.nome ?? this.nome,
            updates.email ?? this.email,
            updates.dataNascimento ?? this.dataNascimento,
            this.dataCriacao
        );
    }
}