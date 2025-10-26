/**
* Value Object Password
* 
* Responsabilidades:
* - Validar força da senha
* - Encapsular regras de segurança
* - Fornecer feedback sobre qualidade da senha
*/
export class Password {
    private readonly value: string;

    private constructor(password: string) {
        this.value = password;
    }

    /**
     * Cria um Password validando a força
     */
    static create(password: string, requireStrong: boolean = false): Password {
        if (!password || password.length === 0) {
            throw new Error('Senha não pode ser vazia');
        }

        if (password.length < 6) {
            throw new Error('Senha deve ter pelo menos 6 caracteres');
        }

        if (password.length > 128) {
            throw new Error('Senha muito longa (máximo 128 caracteres)');
        }

        if (requireStrong) {
            const strength = Password.calculateStrength(password);
            if (strength < 3) {
                throw new Error('Senha fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais');
            }
        }

        return new Password(password);
    }

    /**
     * Cria um Password sem validação (para senhas já hasheadas)
     */
    static createUnsafe(password: string): Password {
        return new Password(password);
    }

    /**
     * Retorna o valor da senha (use com cuidado!)
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Retorna comprimento da senha
     */
    get length(): number {
        return this.value.length;
    }

    /**
     * Verifica se a senha tem letras minúsculas
     */
    get hasLowerCase(): boolean {
        return /[a-z]/.test(this.value);
    }

    /**
     * Verifica se a senha tem letras maiúsculas
     */
    get hasUpperCase(): boolean {
        return /[A-Z]/.test(this.value);
    }

    /**
     * Verifica se a senha tem números
     */
    get hasNumbers(): boolean {
        return /\d/.test(this.value);
    }

    /**
     * Verifica se a senha tem caracteres especiais
     */
    get hasSpecialChars(): boolean {
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.value);
    }

    /**
     * Calcula força da senha (0-5)
     * 0 = Muito fraca
     * 1 = Fraca
     * 2 = Razoável
     * 3 = Boa
     * 4 = Forte
     * 5 = Muito forte
     */
    get strength(): number {
        return Password.calculateStrength(this.value);
    }

    /**
     * Calcula força da senha estaticamente
     */
    static calculateStrength(password: string): number {
        let strength = 0;

        // Comprimento
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Caracteres
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

        // Penalidades
        if (/^(.)\1+$/.test(password)) strength = 0; // Todos caracteres iguais
        if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
            strength = Math.max(0, strength - 1); // Sequência óbvia
        }

        return Math.min(5, strength);
    }

    /**
     * Retorna label da força da senha
     */
    get strengthLabel(): string {
        return Password.getStrengthLabel(this.strength);
    }

    /**
     * Retorna label estático
     */
    static getStrengthLabel(strength: number): string {
        const labels = [
            'Muito Fraca',
            'Fraca',
            'Razoável',
            'Boa',
            'Forte',
            'Muito Forte'
        ];
        return labels[strength] || 'Inválida';
    }

    /**
     * Retorna cor da força da senha
     */
    get strengthColor(): string {
        return Password.getStrengthColor(this.strength);
    }

    /**
     * Retorna cor estática
     */
    static getStrengthColor(strength: number): string {
        const colors = [
            '#ef4444', // red-500
            '#f97316', // orange-500
            '#f59e0b', // amber-500
            '#eab308', // yellow-500
            '#84cc16', // lime-500
            '#22c55e'  // green-500
        ];
        return colors[strength] || '#6b7280';
    }

    /**
     * Retorna percentual de força (0-100)
     */
    get strengthPercentage(): number {
        return Math.round((this.strength / 5) * 100);
    }

    /**
     * Verifica se a senha é forte (força >= 3)
     */
    get isStrong(): boolean {
        return this.strength >= 3;
    }

    /**
     * Verifica se a senha é fraca (força <= 1)
     */
    get isWeak(): boolean {
        return this.strength <= 1;
    }

    /**
     * Retorna lista de requisitos não atendidos
     */
    get missingRequirements(): string[] {
        const missing: string[] = [];

        if (this.length < 8) {
            missing.push('Mínimo de 8 caracteres');
        }

        if (!this.hasLowerCase) {
            missing.push('Pelo menos uma letra minúscula');
        }

        if (!this.hasUpperCase) {
            missing.push('Pelo menos uma letra maiúscula');
        }

        if (!this.hasNumbers) {
            missing.push('Pelo menos um número');
        }

        if (!this.hasSpecialChars) {
            missing.push('Pelo menos um caractere especial');
        }

        return missing;
    }

    /**
     * Verifica se atende todos os requisitos
     */
    get meetsAllRequirements(): boolean {
        return this.missingRequirements.length === 0;
    }

    /**
     * Retorna sugestões para melhorar a senha
     */
    get suggestions(): string[] {
        const suggestions: string[] = [];

        if (this.length < 12) {
            suggestions.push('Use pelo menos 12 caracteres para maior segurança');
        }

        if (!this.hasUpperCase || !this.hasLowerCase) {
            suggestions.push('Misture letras maiúsculas e minúsculas');
        }

        if (!this.hasNumbers) {
            suggestions.push('Adicione números');
        }

        if (!this.hasSpecialChars) {
            suggestions.push('Adicione caracteres especiais (!@#$%^&*)');
        }

        if (/(.)\1{2,}/.test(this.value)) {
            suggestions.push('Evite repetir o mesmo caractere várias vezes');
        }

        if (this.suggestions.length === 0) {
            suggestions.push('Sua senha está forte!');
        }

        return suggestions;
    }

    /**
     * Verifica se contém padrões comuns (senhas fracas)
     */
    static isCommonPassword(password: string): boolean {
        const commonPasswords = [
            '123456', 'password', '12345678', 'qwerty', '123456789',
            '12345', '1234', '111111', '1234567', 'dragon',
            '123123', 'baseball', 'iloveyou', 'trustno1', '1234567890',
            'senha', 'senha123', 'admin', 'root', 'toor'
        ];

        return commonPasswords.includes(password.toLowerCase());
    }

    /**
     * Verifica se a senha atual é comum
     */
    get isCommon(): boolean {
        return Password.isCommonPassword(this.value);
    }

    /**
     * Mascara a senha para exibição
     */
    get masked(): string {
        return '•'.repeat(this.length);
    }

    /**
     * Compara com outra senha (em texto plano)
     */
    equals(plainPassword: string): boolean {
        return this.value === plainPassword;
    }

    /**
     * Converte para string (retorna mascarado por segurança)
     */
    toString(): string {
        return this.masked;
    }

    /**
     * Serialização JSON (retorna mascarado por segurança)
     */
    toJSON(): string {
        return this.masked;
    }

    /**
     * Gera uma senha aleatória forte
     */
    static generateRandom(length: number = 16): Password {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        const all = lowercase + uppercase + numbers + special;

        let password = '';

        // Garante pelo menos um de cada tipo
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Preenche o resto
        for (let i = password.length; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }

        // Embaralha
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        return new Password(password);
    }
}