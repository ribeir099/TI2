/**
* Barrel export de todos os contexts
* 
* Facilita imports:
* import { 
*   AuthProvider,
*   useAuth,
*   NotificationProvider 
* } from '@/presentation/contexts';
*/

// Contexts
export * from './AuthContext';
export * from './NotificationContext';
export * from './ThemeContext';
export * from './ModalContext';
export * from './LoadingContext';
export * from './UIContext';
export * from './SearchContext';

// Composição
export * from './AppProviders';

// Componentes auxiliares
export * from './components/NotificationContainer';