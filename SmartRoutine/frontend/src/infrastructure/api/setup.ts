import { ApiClient } from './ApiClient';
import { setupInterceptors, InterceptorConfig } from './interceptors';
import { apiLogger, LogLevel } from './apiLogger';
import { apiCache } from './apiCache';

/**
* Configuração completa da API
*/
export interface ApiSetupConfig extends InterceptorConfig {
 enableCache?: boolean;
 enableMetrics?: boolean;
 clearCacheOnLogout?: boolean;
}

/**
* Configura API com todas as funcionalidades
* 
* Deve ser chamado na inicialização da aplicação
*/
export const setupApi = (
 apiClient: ApiClient,
 config: ApiSetupConfig = {}
): void => {
 const client = apiClient.getClient();

 // Configurar interceptors
 setupInterceptors(client, {
   enableAuth: config.enableAuth !== false,
   enableRefresh: config.enableRefresh !== false,
   enableLogging: config.enableLogging,
   onTokenExpired: config.onTokenExpired || (() => {
     // Default: redirecionar para login
     if (typeof window !== 'undefined') {
       apiLogger.log(LogLevel.WARN, 'Token expirado, redirecionando para login');
       window.location.href = '/login';
     }
   }),
   onUnauthorized: config.onUnauthorized || (() => {
     apiLogger.log(LogLevel.WARN, 'Não autorizado');
   })
 });

 // Limpar cache ao fazer logout
 if (config.clearCacheOnLogout) {
   if (config.onTokenExpired) {
     const originalCallback = config.onTokenExpired;
     config.onTokenExpired = () => {
       apiCache.clear();
       originalCallback();
     };
   }
 }

 apiLogger.log(LogLevel.INFO, '✅ API configurada com sucesso');
};

/**
* Reseta configuração da API
*/
export const resetApi = (apiClient: ApiClient): void => {
 const client = apiClient.getClient();
 
 // Limpar interceptors
 client.interceptors.request.clear();
 client.interceptors.response.clear();

 // Limpar cache
 apiCache.clear();

 apiLogger.log(LogLevel.INFO, '🔄 API resetada');
};

/**
* Obtém status da API
*/
export const getApiStatus = async (apiClient: ApiClient): Promise<{
 isOnline: boolean;
 responseTime: number;
 cacheStats: any;
}> => {
 const startTime = Date.now();

 try {
   const isOnline = await apiClient.healthCheck();
   const responseTime = Date.now() - startTime;
   const cacheStats = apiCache.getStats();

   return {
     isOnline,
     responseTime,
     cacheStats
   };
 } catch (error) {
   return {
     isOnline: false,
     responseTime: Date.now() - startTime,
     cacheStats: apiCache.getStats()
   };
 }
};
