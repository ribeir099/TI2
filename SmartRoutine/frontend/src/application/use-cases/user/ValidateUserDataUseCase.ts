import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { AppError } from '@/shared/errors/AppError';
import { UserPreferences } from './UpdateUserPreferencesUseCase';

/**
* Resultado de validação
*/
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
* Validação de campo específico
*/
export interface FieldValidationResult {
    field: string;
    isValid: boolean;
    error?: string;
    suggestion?: string;
}

/**
* Use Case: Validar Dados de Usuário
* 
* Responsabilidade:
* - Validar dados antes de salvar
* - Verificar disponibilidade
* - Fornecer feedback detalhado
* - Sugestões de correção
*/
export class ValidateUserDataUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Valida todos os dados de usuário
     * 
     * @param data - Dados a validar
     * @returns ValidationResult - Resultado da validação
     */
    async execute(data: {
        nome?: string;
        email?: string;
        senha?: string;
        dataNascimento?: string;
        currentUserId?: string;
    }): Promise<ValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validar nome
        if (data.nome !== undefined) {
            const nomeErrors = this.validateNome(data.nome);
            errors.push(...nomeErrors);
        }

        // Validar email
        if (data.email !== undefined) {
            const emailResult = await this.validateEmailField(data.email, data.currentUserId);
            if (!emailResult.isValid && emailResult.error) {
                errors.push(emailResult.error);
            }
        }

        // Validar senha
        if (data.senha !== undefined) {
            const senhaResult = this.validateSenhaField(data.senha);
            if (!senhaResult.isValid && senhaResult.error) {
                errors.push(senhaResult.error);
            }
            if (senhaResult.suggestion) {
                warnings.push(senhaResult.suggestion);
            }
        }

        // Validar data de nascimento
        if (data.dataNascimento !== undefined) {
            const dateErrors = this.validateDataNascimento(data.dataNascimento);
            errors.push(...dateErrors);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Valida campo específico
     */
    async executeField(
        field: 'nome' | 'email' | 'senha' | 'dataNascimento',
        value: string,
        currentUserId?: string
    ): Promise<FieldValidationResult> {
        try {
            switch (field) {
                case 'nome':
                    return this.validateNomeField(value);

                case 'email':
                    return await this.validateEmailField(value, currentUserId);

                case 'senha':
                    return this.validateSenhaField(value);

                case 'dataNascimento':
                    return this.validateDataNascimentoField(value);

                default:
                    throw AppError.badRequest('Campo inválido');
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao validar campo');
        }
    }

    /**
     * Valida disponibilidade de email
     */
    async validateEmailAvailability(email: string, currentUserId?: string): Promise<{
        isAvailable: boolean;
        message: string;
    }> {
        try {
            // Validar formato
            if (!Email.isValid(email)) {
                return {
                    isAvailable: false,
                    message: 'Email inválido'
                };
            }

            const emailVO = Email.create(email);
            const user = await this.userRepository.findByEmail(emailVO.getValue());

            // Se não encontrou, está disponível
            if (!user) {
                return {
                    isAvailable: true,
                    message: 'Email disponível'
                };
            }

            // Se é o próprio usuário, está ok
            if (currentUserId && user.id === currentUserId) {
                return {
                    isAvailable: true,
                    message: 'Este é seu email atual'
                };
            }

            return {
                isAvailable: false,
                message: 'Email já está em uso'
            };
        } catch (error) {
            return {
                isAvailable: false,
                message: 'Erro ao validar email'
            };
        }
    }

    /**
     * Valida força da senha
     */
    validatePasswordStrength(senha: string): {
        isStrong: boolean;
        strength: number;
        strengthLabel: string;
        strengthColor: string;
        suggestions: string[];
        missingRequirements: string[];
    } {
        try {
            const passwordVO = Password.create(senha, false);

            return {
                isStrong: passwordVO.isStrong,
                strength: passwordVO.strength,
                strengthLabel: passwordVO.strengthLabel,
                strengthColor: passwordVO.strengthColor,
                suggestions: passwordVO.suggestions,
                missingRequirements: passwordVO.missingRequirements
            };
        } catch (error) {
            return {
                isStrong: false,
                strength: 0,
                strengthLabel: 'Inválida',
                strengthColor: '#ef4444',
                suggestions: [error instanceof Error ? error.message : 'Senha inválida'],
                missingRequirements: []
            };
        }
    }

    // ==================== VALIDAÇÕES ESPECÍFICAS ====================

    /**
     * Valida nome
     */
    private validateNome(nome: string): string[] {
        const errors: string[] = [];

        if (!nome || nome.trim().length === 0) {
            errors.push('Nome é obrigatório');
            return errors;
        }

        if (nome.trim().length < 3) {
            errors.push('Nome deve ter pelo menos 3 caracteres');
        }

        if (nome.length > 100) {
            errors.push('Nome muito longo (máximo 100 caracteres)');
        }

        const partes = nome.trim().split(' ').filter(p => p.length > 0);
        if (partes.length < 2) {
            errors.push('Informe nome completo (nome e sobrenome)');
        }

        // Verificar caracteres inválidos
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
            errors.push('Nome não pode conter números ou caracteres especiais');
        }

        return errors;
    }

    /**
     * Valida nome (retorna resultado)
     */
    private validateNomeField(nome: string): FieldValidationResult {
        const errors = this.validateNome(nome);

        return {
            field: 'nome',
            isValid: errors.length === 0,
            error: errors[0],
            suggestion: errors.length > 0 ? 'Use apenas letras e espaços' : undefined
        };
    }

    /**
     * Valida email
     */
    private async validateEmailField(
        email: string,
        currentUserId?: string
    ): Promise<FieldValidationResult> {
        // Validar formato
        if (!Email.isValid(email)) {
            return {
                field: 'email',
                isValid: false,
                error: 'Email inválido',
                suggestion: 'Use formato: usuario@exemplo.com'
            };
        }

        // Verificar disponibilidade
        const availability = await this.validateEmailAvailability(email, currentUserId);

        if (!availability.isAvailable && currentUserId) {
            return {
                field: 'email',
                isValid: false,
                error: availability.message,
                suggestion: 'Tente outro email'
            };
        }

        return {
            field: 'email',
            isValid: true
        };
    }

    /**
     * Valida senha
     */
    private validateSenhaField(senha: string): FieldValidationResult {
        if (!senha || senha.length === 0) {
            return {
                field: 'senha',
                isValid: false,
                error: 'Senha é obrigatória'
            };
        }

        if (senha.length < 6) {
            return {
                field: 'senha',
                isValid: false,
                error: 'Senha deve ter pelo menos 6 caracteres',
                suggestion: 'Use pelo menos 8 caracteres com letras, números e símbolos'
            };
        }

        if (senha.length > 128) {
            return {
                field: 'senha',
                isValid: false,
                error: 'Senha muito longa'
            };
        }

        const strength = this.validatePasswordStrength(senha);

        if (!strength.isStrong) {
            return {
                field: 'senha',
                isValid: true, // Tecnicamente válida
                error: undefined,
                suggestion: `Senha ${strength.strengthLabel.toLowerCase()}. ${strength.suggestions[0]}`
            };
        }

        return {
            field: 'senha',
            isValid: true
        };
    }

    /**
     * Valida data de nascimento
     */
    private validateDataNascimento(dataNascimento: string): string[] {
        const errors: string[] = [];

        if (!dataNascimento) {
            errors.push('Data de nascimento é obrigatória');
            return errors;
        }

        const birthDate = new Date(dataNascimento);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            errors.push('Data de nascimento inválida');
            return errors;
        }

        if (birthDate > today) {
            errors.push('Data de nascimento não pode ser no futuro');
        }

        // Calcular idade
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 13) {
            errors.push('Idade mínima é 13 anos');
        }

        if (age > 120) {
            errors.push('Data de nascimento inválida');
        }

        return errors;
    }

    /**
     * Valida data de nascimento (retorna resultado)
     */
    private validateDataNascimentoField(dataNascimento: string): FieldValidationResult {
        const errors = this.validateDataNascimento(dataNascimento);

        return {
            field: 'dataNascimento',
            isValid: errors.length === 0,
            error: errors[0],
            suggestion: errors.length > 0 ? 'Use formato: AAAA-MM-DD' : undefined
        };
    }

    /**
     * Obtém preferências padrão
     */
    private getDefaultPreferences(): UserPreferences {
        return {
            notificacoes: {
                email: true,
                push: false,
                vencimento: true,
                novasReceitas: true
            },
            privacidade: {
                perfilPublico: false,
                mostrarEmail: false,
                mostrarReceitas: true
            },
            interface: {
                tema: 'auto',
                idioma: 'pt-BR',
                densidade: 'confortavel'
            },
            alimentacao: {
                restricoes: [],
                preferencias: [],
                alergias: []
            }
        };
    }
}