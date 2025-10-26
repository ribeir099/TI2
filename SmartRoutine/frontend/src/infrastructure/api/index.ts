/**
* Barrel export de todos os módulos da API
* 
* Facilita imports:
* import { 
*   apiClient, 
*   ENDPOINTS, 
*   setupInterceptors 
* } from '@/infrastructure/api';
*/

// Cliente principal
export * from './ApiClient';

// Endpoints
export * from './endpoints';

// Interceptors
export * from './interceptors';

// Helpers
export * from './apiHelpers';

// Logger
export * from './apiLogger';

// Cache
export * from './apiCache';

// Types
export * from './apiTypes';

// Re-export da instância singleton
export { apiClient } from './ApiClient';