/**
* Definição centralizada de todos os endpoints da API
* 
* Vantagens:
* - Manutenção centralizada
* - Type-safe
* - Fácil refatoração
* - Documentação implícita
*/

/**
* Endpoints de Autenticação
*/
export const AUTH_ENDPOINTS = {
    LOGIN: '/usuario/login',
    SIGNUP: '/usuario',
    LOGOUT: '/auth/logout', // Se houver endpoint de logout
    REFRESH: '/auth/refresh', // Se houver endpoint de refresh
    VALIDATE: '/auth/validate' // Se houver endpoint de validação
} as const;

/**
* Endpoints de Usuário
*/
export const USER_ENDPOINTS = {
    BASE: '/usuario',
    BY_ID: (id: string) => `/usuario/${id}`,
    BY_EMAIL: (email: string) => `/usuario/email/${encodeURIComponent(email)}`,
    LIST: '/usuario',
    CREATE: '/usuario',
    UPDATE: (id: string) => `/usuario/${id}`,
    DELETE: (id: string) => `/usuario/${id}`,
    PROFILE: (id: string) => `/usuario/${id}/profile`,
    STATISTICS: (id: string) => `/usuario/${id}/statistics`,
    EXPORT: (id: string) => `/usuario/${id}/export`
} as const;

/**
* Endpoints de Alimento (Catálogo)
*/
export const ALIMENTO_ENDPOINTS = {
    BASE: '/alimento',
    BY_ID: (id: number) => `/alimento/${id}`,
    BY_CATEGORY: (categoria: string) => `/alimento/categoria/${encodeURIComponent(categoria)}`,
    SEARCH: (query: string) => `/alimento/search?q=${encodeURIComponent(query)}`,
    CATEGORIES: '/alimento/categorias',
    CREATE: '/alimento',
    UPDATE: (id: number) => `/alimento/${id}`,
    DELETE: (id: number) => `/alimento/${id}`
} as const;

/**
* Endpoints de Registra (Compras/Despensa)
*/
export const REGISTRA_ENDPOINTS = {
    BASE: '/registra',
    BY_ID: (id: number) => `/registra/${id}`,
    BY_USER: (usuarioId: string) => `/registra/usuario/${usuarioId}`,
    EXPIRING: (usuarioId: string, dias: number) =>
        `/registra/usuario/${usuarioId}/vencimento/${dias}`,
    EXPIRED: (usuarioId: string) => `/registra/usuario/${usuarioId}/vencidos`,
    FRESH: (usuarioId: string) => `/registra/usuario/${usuarioId}/frescos`,
    BY_CATEGORY: (usuarioId: string, categoria: string) =>
        `/registra/usuario/${usuarioId}/categoria/${encodeURIComponent(categoria)}`,
    STATISTICS: (usuarioId: string) => `/registra/usuario/${usuarioId}/statistics`,
    CREATE: '/registra',
    UPDATE: (id: number) => `/registra/${id}`,
    DELETE: (id: number) => `/registra/${id}`,
    DELETE_EXPIRED: (usuarioId: string) => `/registra/usuario/${usuarioId}/vencidos`
} as const;

/**
* Endpoints de Receita
*/
export const RECEITA_ENDPOINTS = {
    BASE: '/receita',
    BY_ID: (id: number) => `/receita/${id}`,
    SEARCH: (query: string) => `/receita/search?q=${encodeURIComponent(query)}`,
    BY_TIME: (tempo: number) => `/receita/tempo/${tempo}`,
    BY_TAG: (tag: string) => `/receita/tag/${encodeURIComponent(tag)}`,
    BY_INGREDIENT: (ingrediente: string) =>
        `/receita/ingrediente/${encodeURIComponent(ingrediente)}`,
    BY_DIFFICULTY: (dificuldade: string) =>
        `/receita/dificuldade/${encodeURIComponent(dificuldade)}`,
    BY_MEAL_TYPE: (tipo: string) => `/receita/tipo/${encodeURIComponent(tipo)}`,
    QUICK: '/receita/rapidas',
    POPULAR: '/receita/populares',
    RECENT: '/receita/recentes',
    TAGS: '/receita/tags',
    MEAL_TYPES: '/receita/tipos',
    DIFFICULTIES: '/receita/dificuldades',
    STATISTICS: '/receita/statistics',
    CREATE: '/receita',
    UPDATE: (id: number) => `/receita/${id}`,
    DELETE: (id: number) => `/receita/${id}`
} as const;

/**
* Endpoints de Receitas Favoritas
*/
export const FAVORITA_ENDPOINTS = {
    BASE: '/favoritas',
    BY_ID: (id: number) => `/favoritas/${id}`,
    BY_USER: (usuarioId: string) => `/favoritas/usuario/${usuarioId}`,
    BY_RECIPE: (receitaId: number) => `/favoritas/receita/${receitaId}`,
    CHECK: (usuarioId: string, receitaId: number) =>
        `/favoritas/check/${usuarioId}/${receitaId}`,
    COUNT_BY_RECIPE: (receitaId: number) => `/favoritas/receita/${receitaId}/count`,
    COUNT_BY_USER: (usuarioId: string) => `/favoritas/usuario/${usuarioId}/count`,
    RECENT: (usuarioId: string, limit: number) =>
        `/favoritas/usuario/${usuarioId}/recent?limit=${limit}`,
    MOST_FAVORITED: (limit: number) => `/favoritas/populares?limit=${limit}`,
    STATISTICS: (usuarioId: string) => `/favoritas/usuario/${usuarioId}/statistics`,
    SIMILAR: (usuarioId: string, limit: number) =>
        `/favoritas/usuario/${usuarioId}/similar?limit=${limit}`,
    CREATE: '/favoritas',
    DELETE: (id: number) => `/favoritas/${id}`,
    DELETE_BY_USER_RECIPE: (usuarioId: string, receitaId: number) =>
        `/favoritas/usuario/${usuarioId}/receita/${receitaId}`,
    TOGGLE: (usuarioId: string, receitaId: number) =>
        `/favoritas/toggle/${usuarioId}/${receitaId}`
} as const;

/**
* Objeto consolidado com todos os endpoints
*/
export const ENDPOINTS = {
    AUTH: AUTH_ENDPOINTS,
    USER: USER_ENDPOINTS,
    ALIMENTO: ALIMENTO_ENDPOINTS,
    REGISTRA: REGISTRA_ENDPOINTS,
    RECEITA: RECEITA_ENDPOINTS,
    FAVORITA: FAVORITA_ENDPOINTS
} as const;

/**
* Helper para construir URL com query params
*/
export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
* Helper para construir URL com múltiplos path params
*/
export const buildUrlWithPath = (baseUrl: string, ...paths: (string | number)[]): string => {
    const pathString = paths
        .map(p => encodeURIComponent(String(p)))
        .join('/');

    return `${baseUrl}/${pathString}`;
};

/**
* Tipos de métodos HTTP
*/
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
* Mapeamento de endpoints para métodos HTTP permitidos
*/
export const ENDPOINT_METHODS: Record<string, HttpMethod[]> = {
    '/usuario': ['GET', 'POST'],
    '/usuario/:id': ['GET', 'PUT', 'DELETE'],
    '/usuario/login': ['POST'],
    '/alimento': ['GET', 'POST'],
    '/alimento/:id': ['GET', 'PUT', 'DELETE'],
    '/receita': ['GET', 'POST'],
    '/receita/:id': ['GET', 'PUT', 'DELETE'],
    '/registra': ['GET', 'POST'],
    '/registra/:id': ['GET', 'PUT', 'DELETE'],
    '/favoritas': ['GET', 'POST'],
    '/favoritas/:id': ['DELETE']
};