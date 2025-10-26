/**
* Value Object Email
* 
* Responsabilidades:
* - Validar formato de email
* - Encapsular regras de negócio relacionadas a email
* - Garantir que emails sejam sempre válidos
*/
export class Email {
    private readonly value: string;

    private constructor(email: string) {
        this.value = email.toLowerCase().trim();
    }

    /**
     * Factory method para criar um Email
     * Valida antes de criar a instância
     */
    static create(email: string): Email {
        if (!email || email.trim().length === 0) {
            throw new Error('Email não pode ser vazio');
        }

        const emailTrimmed = email.trim();

        if (!this.isValid(emailTrimmed)) {
            throw new Error('Formato de email inválido');
        }

        if (emailTrimmed.length > 254) {
            throw new Error('Email muito longo (máximo 254 caracteres)');
        }

        return new Email(emailTrimmed);
    }

    /**
     * Valida formato de email
     */
    static isValid(email: string): boolean {
        // RFC 5322 compliant regex (simplificado)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return false;
        }

        // Validações adicionais
        const [localPart, domain] = email.split('@');

        // Local part não pode começar ou terminar com ponto
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
            return false;
        }

        // Não pode ter pontos consecutivos
        if (localPart.includes('..')) {
            return false;
        }

        // Domínio deve ter pelo menos um ponto
        if (!domain.includes('.')) {
            return false;
        }

        return true;
    }

    /**
     * Retorna o valor do email
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Retorna a parte local do email (antes do @)
     */
    get localPart(): string {
        return this.value.split('@')[0];
    }

    /**
     * Retorna o domínio do email (depois do @)
     */
    get domain(): string {
        return this.value.split('@')[1];
    }

    /**
     * Retorna email mascarado para privacidade
     * Exemplo: jo***@email.com
     */
    get masked(): string {
        const [local, domain] = this.value.split('@');

        if (local.length <= 2) {
            return `**@${domain}`;
        }

        const visibleChars = Math.min(2, Math.floor(local.length / 3));
        const masked = local.substring(0, visibleChars) + '***';

        return `${masked}@${domain}`;
    }

    /**
     * Verifica se é um email corporativo (não é provedor público)
     */
    get isCorporate(): boolean {
        const publicProviders = [
            'gmail.com',
            'yahoo.com',
            'hotmail.com',
            'outlook.com',
            'live.com',
            'icloud.com',
            'aol.com',
            'mail.com',
            'protonmail.com'
        ];

        return !publicProviders.includes(this.domain.toLowerCase());
    }

    /**
     * Verifica se é um email de provedor público
     */
    get isPublicProvider(): boolean {
        return !this.isCorporate;
    }

    /**
     * Retorna o provedor do email
     */
    get provider(): string {
        const domainParts = this.domain.split('.');
        return domainParts.length >= 2
            ? domainParts[domainParts.length - 2]
            : this.domain;
    }

    /**
     * Converte para string
     */
    toString(): string {
        return this.value;
    }

    /**
     * Compara com outro Email
     */
    equals(other: Email): boolean {
        if (!(other instanceof Email)) {
            return false;
        }
        return this.value === other.value;
    }

    /**
     * Compara com uma string
     */
    equalsString(email: string): boolean {
        return this.value === email.toLowerCase().trim();
    }

    /**
     * Cria uma cópia
     */
    clone(): Email {
        return new Email(this.value);
    }

    /**
     * Serialização JSON
     */
    toJSON(): string {
        return this.value;
    }

    /**
     * Cria Email a partir de JSON
     */
    static fromJSON(json: string): Email {
        return Email.create(json);
    }
}