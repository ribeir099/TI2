/**
* Barrel export de todos os módulos de erro
* 
* Facilita imports:
* import { 
*   AppError, 
*   ValidationError,
*   ErrorHandler,
*   ErrorBoundary 
* } from '@/shared/errors';
*/

// Classes de erro
export * from './AppError';
export * from './ValidationError';
export * from './NetworkError';
export * from './IAError';
export * from './BusinessError';
export * from './AuthenticationError';

// Handlers e utilitários
export * from './ErrorHandler';
export * from './ErrorLogger';
export * from './ErrorRecovery';
export * from './ErrorReporter';
export * from './ErrorUtils';

// Mensagens
export * from './ErrorMessages';

// React Error Boundary
export * from './ErrorBoundary';

// Re-export singleton instances
export { errorLogger } from './ErrorLogger';