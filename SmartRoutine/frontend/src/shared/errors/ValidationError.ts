import { AppError } from './AppError';
import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';

/**
* Erro de campo
*/
export interface FieldError {
    field: string;
    message: string;
    value?: any;
    constraint?: string;
}

/**
* Erro de Validação
* 
* Responsabilidades:
* - Erros de validação de dados
* - Múltiplos campos
* - Detalhes específicos por campo
*/
export class ValidationError extends AppError {
    public readonly fieldErrors: FieldError[];

    constructor(message: string, fieldErrors: FieldError[] = []) {
        super(
            message,
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            ErrorCode.VALIDATION_ERROR,
            { fieldErrors }
        );

        this.fieldErrors = fieldErrors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    /**
     * Cria ValidationError de um único campo
     */
    static field(field: string, message: string, value?: any): ValidationError {
        return new ValidationError(`Erro de validação no campo ${field}`, [
            { field, message, value }
        ]);
    }

    /**
     * Cria ValidationError de múltiplos campos
     */
    static fields(fieldErrors: FieldError[]): ValidationError {
        const fields = fieldErrors.map(e => e.field).join(', ');
        return new ValidationError(
            `Erros de validação nos campos: ${fields}`,
            fieldErrors
        );
    }

    /**
     * Adiciona erro de campo
     */
    addFieldError(field: string, message: string, value?: any): void {
        this.fieldErrors.push({ field, message, value });
    }

    /**
     * Verifica se tem erro em campo específico
     */
    hasFieldError(field: string): boolean {
        return this.fieldErrors.some(e => e.field === field);
    }

    /**
     * Obtém erro de campo específico
     */
    getFieldError(field: string): FieldError | undefined {
        return this.fieldErrors.find(e => e.field === field);
    }

    /**
     * Obtém mensagem de campo específico
     */
    getFieldMessage(field: string): string | undefined {
        return this.getFieldError(field)?.message;
    }

    /**
     * Obtém todos os campos com erro
     */
    getErrorFields(): string[] {
        return this.fieldErrors.map(e => e.field);
    }

    /**
     * Obtém todas as mensagens
     */
    getAllMessages(): string[] {
        return this.fieldErrors.map(e => e.message);
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            ...super.toJSON(),
            fieldErrors: this.fieldErrors
        };
    }

    /**
     * Validação de required fields
     */
    static requiredFields(fields: string[]): ValidationError {
        const fieldErrors = fields.map(field => ({
            field,
            message: `${field} é obrigatório`,
            constraint: 'required'
        }));

        return ValidationError.fields(fieldErrors);
    }

    /**
     * Validação de formato inválido
     */
    static invalidFormat(field: string, expectedFormat: string): ValidationError {
        return ValidationError.field(
            field,
            `Formato inválido. Esperado: ${expectedFormat}`
        );
    }

    /**
     * Validação de range
     */
    static outOfRange(field: string, min: number, max: number, value: number): ValidationError {
        return ValidationError.field(
            field,
            `Valor deve estar entre ${min} e ${max}`,
            value
        );
    }

    /**
     * Validação de comprimento
     */
    static invalidLength(
        field: string,
        minLength: number,
        maxLength: number,
        actualLength: number
    ): ValidationError {
        return ValidationError.field(
            field,
            `Comprimento deve estar entre ${minLength} e ${maxLength} caracteres (atual: ${actualLength})`
        );
    }
}