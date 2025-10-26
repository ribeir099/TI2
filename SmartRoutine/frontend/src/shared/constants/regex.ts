/**
* Expressões Regulares Reutilizáveis
*/

/**
* Validação de formatos
*/
export const VALIDATION_REGEX = {
    // Email (RFC 5322 simplificado)
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Email strict (mais rigoroso)
    EMAIL_STRICT: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

    // Telefone
    PHONE_BR: /^\(?([1-9]{2})\)?\s?9?\d{4}-?\d{4}$/,
    PHONE_INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,

    // Documentos BR
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CPF_CLEAN: /^\d{11}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    CEP: /^\d{5}-?\d{3}$/,

    // URLs
    URL: /^https?:\/\/.+/,
    URL_STRICT: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

    // Cores
    HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    RGB_COLOR: /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
    RGBA_COLOR: /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,

    // Texto
    ALPHA_ONLY: /^[a-zA-ZÀ-ÿ\s]+$/,
    NUMERIC_ONLY: /^\d+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    ALPHANUMERIC_SPACE: /^[a-zA-Z0-9\s]+$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

    // Senha
    PASSWORD_LOWERCASE: /[a-z]/,
    PASSWORD_UPPERCASE: /[A-Z]/,
    PASSWORD_NUMBER: /\d/,
    PASSWORD_SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,

    // Data/Hora
    DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
    DATE_BR: /^\d{2}\/\d{2}\/\d{4}$/,
    TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
    TIME_12H: /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i,

    // Números
    INTEGER: /^-?\d+$/,
    POSITIVE_INTEGER: /^\d+$/,
    DECIMAL: /^-?\d+(\.\d+)?$/,
    POSITIVE_DECIMAL: /^\d+(\.\d+)?$/,

    // IP
    IPV4: /^(\d{1,3}\.){3}\d{1,3}$/,
    IPV6: /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/,

    // Código postal internacional
    ZIP_CODE_US: /^\d{5}(-\d{4})?$/,
    POSTAL_CODE_CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    POSTAL_CODE_UK: /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i,

    // Cartão de crédito (validação básica)
    CREDIT_CARD: /^\d{13,19}$/,
    CVV: /^\d{3,4}$/,

    // Username
    USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,

    // Tags/hashtags
    HASHTAG: /^#[a-zA-Z0-9_]+$/,

    // Versão semântica
    SEMVER: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
} as const;

/**
* Patterns para sanitização
*/
export const SANITIZATION_PATTERNS = {
    // Remove HTML tags
    HTML_TAGS: /<[^>]*>/g,

    // Remove scripts
    SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

    // Remove espaços extras
    EXTRA_SPACES: /\s+/g,

    // Remove caracteres especiais (mantém acentos)
    SPECIAL_CHARS: /[^a-zA-Z0-9À-ÿ\s]/g,

    // Remove números
    NUMBERS: /\d/g,

    // Remove não-numéricos
    NON_NUMERIC: /\D/g
} as const;