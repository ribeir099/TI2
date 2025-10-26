/**
* Rotas da Aplicação
*/

/**
* Rotas públicas
*/
export const PUBLIC_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms'
} as const;

/**
* Rotas protegidas (requer autenticação)
*/
export const PROTECTED_ROUTES = {
    DASHBOARD: '/dashboard',
    PANTRY: '/pantry',
    RECIPES: '/recipes',
    RECIPE_DETAIL: (id: number) => `/recipes/${id}`,
    FAVORITES: '/favorites',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    STATISTICS: '/statistics',
    NOTIFICATIONS: '/notifications'
} as const;

/**
* Rotas de API (relativas ao API_BASE_URL)
*/
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/usuario/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh'
    },
    USER: {
        BASE: '/usuario',
        PROFILE: '/usuario/profile',
        STATISTICS: '/usuario/statistics'
    },
    FOOD: {
        BASE: '/alimento',
        CATEGORIES: '/alimento/categorias'
    },
    PANTRY: {
        BASE: '/registra',
        EXPIRING: '/registra/vencimento',
        EXPIRED: '/registra/vencidos'
    },
    RECIPE: {
        BASE: '/receita',
        SEARCH: '/receita/search',
        POPULAR: '/receita/populares',
        RECENT: '/receita/recentes'
    },
    FAVORITE: {
        BASE: '/favoritas',
        TOGGLE: '/favoritas/toggle'
    }
} as const;

/**
* Todas as rotas
*/
export const ROUTES = {
    ...PUBLIC_ROUTES,
    ...PROTECTED_ROUTES
} as const;

/**
* Rotas que não requerem autenticação
*/
export const AUTH_EXEMPT_ROUTES = [
    PUBLIC_ROUTES.HOME,
    PUBLIC_ROUTES.LOGIN,
    PUBLIC_ROUTES.SIGNUP,
    PUBLIC_ROUTES.FORGOT_PASSWORD,
    PUBLIC_ROUTES.RESET_PASSWORD,
    PUBLIC_ROUTES.ABOUT,
    PUBLIC_ROUTES.CONTACT,
    PUBLIC_ROUTES.PRIVACY,
    PUBLIC_ROUTES.TERMS
] as const;

/**
* Rota padrão após login
*/
export const DEFAULT_PROTECTED_ROUTE = PROTECTED_ROUTES.DASHBOARD;

/**
* Rota de redirecionamento após logout
*/
export const DEFAULT_PUBLIC_ROUTE = PUBLIC_ROUTES.HOME;

/**
* Helper: Verifica se rota é pública
*/
export const isPublicRoute = (pathname: string): boolean => {
    return AUTH_EXEMPT_ROUTES.includes(pathname as any);
};

/**
* Helper: Verifica se rota é protegida
*/
export const isProtectedRoute = (pathname: string): boolean => {
    return !isPublicRoute(pathname);
};