/**
* Constantes de Validação
*/

/**
* Comprimentos
*/
export const LENGTH_CONSTRAINTS = {
    // Nome
    NAME_MIN: 3,
    NAME_MAX: 100,

    // Email
    EMAIL_MAX: 254,

    // Senha
    PASSWORD_MIN: 6,
    PASSWORD_MAX: 128,
    PASSWORD_STRONG_MIN: 8,

    // Texto
    TEXT_MIN: 2,
    TEXT_MAX: 500,

    // Título
    TITLE_MIN: 3,
    TITLE_MAX: 200,

    // Descrição
    DESCRIPTION_MAX: 1000,

    // Ingrediente
    INGREDIENT_MIN: 2,
    INGREDIENT_MAX: 100,

    // Instrução
    INSTRUCTION_MIN: 5,
    INSTRUCTION_MAX: 500
} as const;

/**
* Valores numéricos
*/
export const NUMERIC_CONSTRAINTS = {
    // Quantidade
    QUANTITY_MIN: 0.01,
    QUANTITY_MAX: 999999,

    // Tempo de preparo (minutos)
    PREP_TIME_MIN: 1,
    PREP_TIME_MAX: 1440, // 24 horas

    // Calorias
    CALORIES_MIN: 0,
    CALORIES_MAX: 10000,

    // Idade
    AGE_MIN: 13,
    AGE_MAX: 120,

    // Receitas
    INGREDIENTS_MIN: 1,
    INGREDIENTS_MAX: 50,
    INSTRUCTIONS_MIN: 1,
    INSTRUCTIONS_MAX: 50,
    TAGS_MAX: 20,

    // Paginação
    PAGE_MIN: 1,
    LIMIT_MIN: 1,
    LIMIT_MAX: 100
} as const;

/**
* Regex patterns
*/
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_BR: /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CEP: /^\d{5}-?\d{3}$/,
    URL: /^https?:\/\/.+/,
    HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    ALPHA_ONLY: /^[a-zA-ZÀ-ÿ\s]+$/,
    NUMERIC_ONLY: /^\d+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const;

/**
* Mensagens de validação
*/
export const VALIDATION_MESSAGES = {
    REQUIRED: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_URL: 'URL inválida',
    INVALID_DATE: 'Data inválida',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_CPF: 'CPF inválido',
    INVALID_CEP: 'CEP inválido',

    MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
    MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
    MIN_VALUE: (min: number) => `Valor mínimo: ${min}`,
    MAX_VALUE: (max: number) => `Valor máximo: ${max}`,

    MUST_BE_POSITIVE: 'Deve ser um número positivo',
    MUST_BE_INTEGER: 'Deve ser um número inteiro',
    MUST_BE_FUTURE: 'Data deve ser no futuro',
    MUST_BE_PAST: 'Data deve ser no passado',

    PASSWORDS_MATCH: 'As senhas devem ser iguais',
    TERMS_REQUIRED: 'Você deve aceitar os termos',

    ALPHA_ONLY: 'Apenas letras são permitidas',
    NUMERIC_ONLY: 'Apenas números são permitidos',
    ALPHANUMERIC_ONLY: 'Apenas letras e números são permitidos'
} as const;

/**
* Regras de senha forte
*/
export const PASSWORD_RULES = {
    MIN_LENGTH: LENGTH_CONSTRAINTS.PASSWORD_STRONG_MIN,
    REQUIRE_LOWERCASE: true,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
} as const;

/**
* Mensagens de requisitos de senha
*/
export const PASSWORD_REQUIREMENTS = [
    `Mínimo de ${PASSWORD_RULES.MIN_LENGTH} caracteres`,
    'Pelo menos uma letra minúscula',
    'Pelo menos uma letra maiúscula',
    'Pelo menos um número',
    'Pelo menos um caractere especial (!@#$%^&*)'
] as const;