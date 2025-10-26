/**
* Barrel export de todas as constantes
* 
* Facilita imports:
* import { 
*   APP_CONFIG, 
*   ROUTES, 
*   FOOD_CATEGORIES,
*   SUCCESS_MESSAGES 
* } from '@/shared/constants';
*/

// Configuração principal
export * from './config';

// Rotas
export * from './routes';

// Categorias e unidades
export * from './categories';
export * from './units';

// Mensagens
export * from './messages';

// Validação
export * from './validation';

// Valores padrão
export * from './defaults';

// Limites
export * from './limits';

// Timeouts e delays
export * from './timeouts';

// Ícones e cores
export * from './icons';
export * from './colors';

// JWT e IA
export * from './jwt.config';
export * from './ia.config';

// Receitas
export * from './recipe.constants';

// Storage
export * from './storage.constants';

// API
export * from './api.constants';

// Feature flags
export * from './feature-flags';

// Regex
export * from './regex';

// Data
export * from './date.constants';

// Meta/SEO
export * from './meta.constants';

// Re-exports convenientes
export { APP_CONFIG, APP_NAME, APP_VERSION, IS_DEV, IS_PROD } from './config';
export { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from './routes';
export { FOOD_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from './categories';
export { SUCCESS_MESSAGES, ERROR_MESSAGES, CONFIRMATION_MESSAGES } from './messages';
export { JWT_CONFIG, TokenType } from './jwt.config';
export { IA_CONFIG, IAProvider } from './ia.config';