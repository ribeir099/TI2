import { AppError } from './AppError';
import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';

/**
* Tipo de erro de negócio
*/
export type BusinessErrorType =
    | 'RULE_VIOLATION'
    | 'OPERATION_NOT_ALLOWED'
    | 'INVALID_STATE'
    | 'CONFLICT'
    | 'PRECONDITION_FAILED';

/**
* Erro de Regra de Negócio
* 
* Responsabilidades:
* - Violações de regras de negócio
* - Operações não permitidas
* - Estados inválidos
*/
export class BusinessError extends AppError {
    public readonly businessErrorType: BusinessErrorType;
    public readonly rule?: string;

    constructor(
        message: string,
        businessErrorType: BusinessErrorType,
        rule?: string
    ) {
        super(
            message,
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            ErrorCode.BUSINESS_RULE_VIOLATION,
            { businessErrorType, rule }
        );

        this.businessErrorType = businessErrorType;
        this.rule = rule;

        Object.setPrototypeOf(this, BusinessError.prototype);
    }

    /**
     * Violação de regra
     */
    static ruleViolation(rule: string, message: string): BusinessError {
        return new BusinessError(message, 'RULE_VIOLATION', rule);
    }

    /**
     * Operação não permitida
     */
    static operationNotAllowed(message: string): BusinessError {
        return new BusinessError(message, 'OPERATION_NOT_ALLOWED');
    }

    /**
     * Estado inválido
     */
    static invalidState(message: string): BusinessError {
        return new BusinessError(message, 'INVALID_STATE');
    }

    /**
     * Conflito de negócio
     */
    static conflict(message: string): BusinessError {
        return new BusinessError(message, 'CONFLICT');
    }

    /**
     * Pré-condição falhou
     */
    static preconditionFailed(message: string, rule?: string): BusinessError {
        return new BusinessError(message, 'PRECONDITION_FAILED', rule);
    }

    /**
     * Exemplos de erros de negócio específicos do SmartRoutine
     */

    /**
     * Alimento já vencido
     */
    static foodAlreadyExpired(foodName: string): BusinessError {
        return BusinessError.ruleViolation(
            'NO_EXPIRED_FOOD',
            `Não é possível adicionar "${foodName}" pois já está vencido.`
        );
    }

    /**
     * Data de compra posterior à validade
     */
    static invalidPurchaseDate(): BusinessError {
        return BusinessError.ruleViolation(
            'PURCHASE_BEFORE_EXPIRATION',
            'Data de compra não pode ser posterior à data de validade.'
        );
    }

    /**
     * Receita já favoritada
     */
    static recipeAlreadyFavorited(): BusinessError {
        return BusinessError.conflict('Esta receita já está nos seus favoritos.');
    }

    /**
     * Limite de favoritos atingido
     */
    static favoriteLimitReached(limit: number): BusinessError {
        return BusinessError.operationNotAllowed(
            `Você atingiu o limite de ${limit} receitas favoritas.`
        );
    }

    /**
     * Ingredientes insuficientes
     */
    static insufficientIngredients(missing: string[]): BusinessError {
        return BusinessError.preconditionFailed(
            `Ingredientes faltando: ${missing.join(', ')}`,
            'SUFFICIENT_INGREDIENTS'
        );
    }

    /**
     * Serializa para JSON
     */
    toJSON(): object {
        return {
            ...super.toJSON(),
            businessErrorType: this.businessErrorType,
            rule: this.rule
        };
    }
}