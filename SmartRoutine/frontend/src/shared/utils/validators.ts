/**
* Utilitários de Validação
* 
* Responsabilidades:
* - Validar formatos
* - Validar ranges
* - Validar tipos
* - Validar regras de negócio
*/

export class Validator {
    /**
     * Valida email
     */
    static isEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida CPF
     */
    static isCPF(cpf: string): boolean {
        const cleaned = cpf.replace(/\D/g, '');

        if (cleaned.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cleaned)) return false; // Todos iguais

        // Validar dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleaned.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleaned.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleaned.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleaned.charAt(10))) return false;

        return true;
    }

    /**
     * Valida telefone brasileiro
     */
    static isPhone(phone: string): boolean {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    }

    /**
     * Valida URL
     */
    static isURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Valida data
     */
    static isValidDate(date: string): boolean {
        const d = new Date(date);
        return !isNaN(d.getTime());
    }

    /**
     * Valida se data está no passado
     */
    static isDateInPast(date: string): boolean {
        const d = new Date(date);
        const now = new Date();
        return d < now;
    }

    /**
     * Valida se data está no futuro
     */
    static isDateInFuture(date: string): boolean {
        const d = new Date(date);
        const now = new Date();
        return d > now;
    }

    /**
     * Valida número positivo
     */
    static isPositiveNumber(value: number): boolean {
        return typeof value === 'number' && value > 0 && !isNaN(value);
    }

    /**
     * Valida número no range
     */
    static isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    /**
     * Valida comprimento mínimo
     */
    static hasMinLength(text: string, minLength: number): boolean {
        return text.trim().length >= minLength;
    }

    /**
     * Valida comprimento máximo
     */
    static hasMaxLength(text: string, maxLength: number): boolean {
        return text.length <= maxLength;
    }

    /**
     * Valida se string contém apenas letras
     */
    static isAlpha(text: string): boolean {
        return /^[a-zA-ZÀ-ÿ\s]+$/.test(text);
    }

    /**
     * Valida se string contém apenas números
     */
    static isNumeric(text: string): boolean {
        return /^\d+$/.test(text);
    }

    /**
     * Valida se string é alfanumérica
     */
    static isAlphanumeric(text: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(text);
    }

    /**
     * Valida se não está vazio
     */
    static isNotEmpty(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    }

    /**
     * Valida idade mínima
     */
    static isMinimumAge(birthDate: string, minimumAge: number): boolean {
        const birth = new Date(birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age >= minimumAge;
    }

    /**
     * Valida senha forte
     */
    static isStrongPassword(password: string): boolean {
        if (password.length < 8) return false;

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return hasLower && hasUpper && hasNumber && hasSpecial;
    }

    /**
     * Valida JSON
     */
    static isJSON(text: string): boolean {
        try {
            JSON.parse(text);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Valida código hexadecimal de cor
     */
    static isHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    /**
     * Valida se array tem duplicatas
     */
    static hasDuplicates<T>(array: T[]): boolean {
        return new Set(array).size !== array.length;
    }

    /**
     * Valida arquivo por extensão
     */
    static isValidFileType(filename: string, allowedExtensions: string[]): boolean {
        const extension = filename.split('.').pop()?.toLowerCase();
        if (!extension) return false;
        return allowedExtensions.includes(extension);
    }

    /**
     * Valida tamanho de arquivo
     */
    static isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return sizeInBytes <= maxSizeInBytes;
    }
}