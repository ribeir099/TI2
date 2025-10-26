/**
* Barrel export de todos os módulos de storage
* 
* Facilita imports:
* import { 
*   tokenStorage, 
*   LocalStorage,
*   storageManager 
* } from '@/infrastructure/storage';
*/

// Core storage
export * from './LocalStorage';
export * from './SessionStorage';
export * from './TokenStorage';

// Specialized storage
export * from './CacheStorage';
export * from './SecureStorage';
export * from './PreferencesStorage';
export * from './OfflineStorage';

// Management
export * from './StorageService';
export * from './StorageManager';
export * from './StorageQuotaManager';

// Re-export singleton instances
export { tokenStorage } from './TokenStorage';
export { sessionStorage } from './SessionStorage';
export { cacheStorage } from './CacheStorage';
export { secureStorage } from './SecureStorage';
export { preferencesStorage } from './PreferencesStorage';
export { offlineStorage } from './OfflineStorage';
export { storageService } from './StorageService';
export { storageManager } from './StorageManager';
export { storageQuotaManager } from './StorageQuotaManager';