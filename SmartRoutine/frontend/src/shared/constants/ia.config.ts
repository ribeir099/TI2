/**
* Configuração de IA
*/

/**
* Provedores de IA suportados
*/
export enum IAProvider {
    OPENAI = 'openai',
    ANTHROPIC = 'anthropic',
    GOOGLE = 'google',
    COHERE = 'cohere',
    CUSTOM = 'custom'
}

/**
* Modelos disponíveis por provider
*/
export const IA_MODELS = {
    [IAProvider.OPENAI]: [
        'gpt-4',
        'gpt-4-turbo',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k'
    ],
    [IAProvider.ANTHROPIC]: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-2.1',
        'claude-2.0'
    ],
    [IAProvider.GOOGLE]: [
        'gemini-pro',
        'gemini-pro-vision',
        'gemini-ultra'
    ],
    [IAProvider.COHERE]: [
        'command',
        'command-light',
        'command-nightly'
    ]
} as const;

/**
* Configuração principal de IA
*/
export const IA_CONFIG = {
    // API Key
    API_KEY: import.meta.env.VITE_IA_API_KEY || '',

    // Provider
    PROVIDER: (import.meta.env.VITE_IA_PROVIDER as IAProvider) || IAProvider.OPENAI,

    // Model
    MODEL: import.meta.env.VITE_IA_MODEL || 'gpt-4',

    // Configurações de geração
    MAX_TOKENS: parseInt(import.meta.env.VITE_IA_MAX_TOKENS || '2000'),
    TEMPERATURE: parseFloat(import.meta.env.VITE_IA_TEMPERATURE || '0.7'),
    TOP_P: 1,
    FREQUENCY_PENALTY: 0,
    PRESENCE_PENALTY: 0,

    // Timeouts
    TIMEOUT: 45000, // 45 segundos

    // Rate limiting
    REQUESTS_PER_MINUTE: 10,
    MIN_REQUEST_INTERVAL: 1000, // 1 segundo

    // URLs dos providers
    ENDPOINTS: {
        [IAProvider.OPENAI]: 'https://api.openai.com/v1/chat/completions',
        [IAProvider.ANTHROPIC]: 'https://api.anthropic.com/v1/messages',
        [IAProvider.GOOGLE]: 'https://generativelanguage.googleapis.com/v1beta/models',
        [IAProvider.COHERE]: 'https://api.cohere.ai/v1/generate',
        [IAProvider.CUSTOM]: import.meta.env.VITE_IA_CUSTOM_ENDPOINT || ''
    },

    // Headers específicos
    HEADERS: {
        [IAProvider.OPENAI]: {
            'Authorization': 'Bearer {{API_KEY}}',
            'Content-Type': 'application/json'
        },
        [IAProvider.ANTHROPIC]: {
            'x-api-key': '{{API_KEY}}',
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
        },
        [IAProvider.GOOGLE]: {
            'Content-Type': 'application/json'
        }
    },

    // Validação
    isConfigured: (): boolean => {
        return !!IA_CONFIG.API_KEY && IA_CONFIG.API_KEY.length > 0;
    },

    // Obter endpoint baseado no provider
    getEndpoint: (): string => {
        return IA_CONFIG.ENDPOINTS[IA_CONFIG.PROVIDER];
    },

    // Obter headers baseado no provider
    getHeaders: (): Record<string, string> => {
        const headers = IA_CONFIG.HEADERS[IA_CONFIG.PROVIDER];
        const processed: Record<string, string> = {};

        Object.entries(headers).forEach(([key, value]) => {
            processed[key] = value.replace('{{API_KEY}}', IA_CONFIG.API_KEY);
        });

        return processed;
    }
} as const;

/**
* Prompts do sistema (por finalidade)
*/
export const IA_SYSTEM_PROMPTS = {
    RECIPE_GENERATION: `Você é um chef profissional especializado em criar receitas práticas e deliciosas.

Suas receitas devem:
- Ser claras e fáceis de seguir
- Incluir tempo de preparo realista
- Listar ingredientes com quantidades precisas
- Ter passos detalhados mas concisos
- Incluir dicas úteis quando relevante

Sempre retorne no formato JSON especificado.`,

    RECIPE_ANALYSIS: `Você é um chef especialista em análise nutricional e culinária.

Analise receitas considerando:
- Dificuldade técnica
- Tempo de preparo
- Valor nutricional
- Possíveis melhorias
- Substituições de ingredientes`,

    INGREDIENT_SUBSTITUTES: `Você é um especialista em culinária e nutrição.

Sugira substitutos para ingredientes considerando:
- Disponibilidade
- Alergias e restrições
- Similaridade de sabor
- Proporções corretas
- Custo-benefício`,

    MEAL_PLANNING: `Você é um nutricionista especializado em planejamento alimentar.

Crie planos considerando:
- Equilíbrio nutricional
- Variedade de ingredientes
- Preferências alimentares
- Restrições e alergias
- Praticidade`
} as const;

/**
* Limites de IA
*/
export const IA_LIMITS = {
    MAX_PROMPT_LENGTH: 500,
    MAX_GENERATIONS_PER_DAY: 50,
    MAX_GENERATIONS_PER_HOUR: 10,
    MAX_RETRIES: 2,
    RETRY_DELAY: 2000,
    MAX_TOKENS: 2000,
    REQUESTS_PER_MINUTE: 10
} as const;

/**
* Custo estimado por token (em centavos de dólar)
*/
export const IA_COSTS = {
    [IAProvider.OPENAI]: {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    }
} as const;