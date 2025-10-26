import { AxiosRequestConfig } from 'axios';

/**
* Helpers para construção de requisições
*/

/**
* Constrói config para requisição com timeout customizado
*/
export const withTimeout = (timeout: number): AxiosRequestConfig => ({
 timeout
});

/**
* Constrói config para requisição sem cache
*/
export const withoutCache = (): AxiosRequestConfig => ({
 headers: {
   'Cache-Control': 'no-cache',
   'Pragma': 'no-cache'
 }
});

/**
* Constrói config para requisição com retry
*/
export const withRetry = (maxRetries: number = 3): AxiosRequestConfig => ({
 // Metadados para interceptor de retry
 ...(({ _maxRetries: maxRetries } as any))
});

/**
* Constrói config para upload de arquivo
*/
export const withFileUpload = (
 onProgress?: (progress: number) => void
): AxiosRequestConfig => ({
 headers: {
   'Content-Type': 'multipart/form-data'
 },
 onUploadProgress: (progressEvent) => {
   if (onProgress && progressEvent.total) {
     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
     onProgress(progress);
   }
 }
});

/**
* Constrói config para download de arquivo
*/
export const withFileDownload = (): AxiosRequestConfig => ({
 responseType: 'blob'
});

/**
* Constrói config com headers customizados
*/
export const withHeaders = (headers: Record<string, string>): AxiosRequestConfig => ({
 headers
});

/**
* Constrói config com query params
*/
export const withQueryParams = (params: Record<string, any>): AxiosRequestConfig => ({
 params
});

/**
* Combina múltiplas configs
*/
export const combineConfigs = (...configs: AxiosRequestConfig[]): AxiosRequestConfig => {
 return configs.reduce((acc, config) => ({
   ...acc,
   ...config,
   headers: {
     ...acc.headers,
     ...config.headers
   },
   params: {
     ...acc.params,
     ...config.params
   }
 }), {});
};

/**
* Cria config para requisição JSON
*/
export const jsonConfig = (): AxiosRequestConfig => ({
 headers: {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
 }
});

/**
* Cria config para requisição form-urlencoded
*/
export const formConfig = (): AxiosRequestConfig => ({
 headers: {
   'Content-Type': 'application/x-www-form-urlencoded'
 }
});

/**
* Serializa objeto para FormData
*/
export const toFormData = (data: Record<string, any>): FormData => {
 const formData = new FormData();

 Object.entries(data).forEach(([key, value]) => {
   if (value !== undefined && value !== null) {
     if (value instanceof File) {
       formData.append(key, value);
     } else if (Array.isArray(value)) {
       value.forEach((item, index) => {
         formData.append(`${key}[${index}]`, item);
       });
     } else if (typeof value === 'object') {
       formData.append(key, JSON.stringify(value));
     } else {
       formData.append(key, String(value));
     }
   }
 });

 return formData;
};

/**
* Converte objeto para query string
*/
export const toQueryString = (params: Record<string, any>): string => {
 return Object.entries(params)
   .filter(([_, value]) => value !== undefined && value !== null)
   .map(([key, value]) => {
     if (Array.isArray(value)) {
       return value
         .map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`)
         .join('&');
     }
     return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
   })
   .join('&');
};

/**
* Cria AbortController para cancelamento
*/
export const createAbortController = (timeoutMs?: number): {
 controller: AbortController;
 signal: AbortSignal;
 cancel: (reason?: string) => void;
} => {
 const controller = new AbortController();

 if (timeoutMs) {
   setTimeout(() => {
     controller.abort('Timeout');
   }, timeoutMs);
 }

 return {
   controller,
   signal: controller.signal,
   cancel: (reason?: string) => controller.abort(reason)
 };
};

/**
* Wrapper para requisição com cancelamento
*/
export const withAbort = (timeoutMs?: number): {
 config: AxiosRequestConfig;
 cancel: (reason?: string) => void;
} => {
 const { signal, cancel } = createAbortController(timeoutMs);

 return {
   config: { signal } as AxiosRequestConfig,
   cancel
 };
};

/**
* Helper para verificar se erro é de rede
*/
export const isNetworkError = (error: any): boolean => {
 return (
   error.code === 'ERR_NETWORK' ||
   error.code === 'ECONNREFUSED' ||
   error.code === 'ENOTFOUND' ||
   error.message === 'Network Error'
 );
};

/**
* Helper para verificar se erro é timeout
*/
export const isTimeoutError = (error: any): boolean => {
 return (
   error.code === 'ECONNABORTED' ||
   error.code === 'ETIMEDOUT' ||
   error.message.includes('timeout')
 );
};

/**
* Helper para verificar se erro é cancelamento
*/
export const isCancelError = (error: any): boolean => {
 return axios.isCancel?.(error) || error.code === 'ERR_CANCELED';
};

/**
* Extrai mensagem de erro amigável
*/
export const extractErrorMessage = (error: any): string => {
 if (isNetworkError(error)) {
   return 'Erro de conexão. Verifique sua internet.';
 }

 if (isTimeoutError(error)) {
   return 'Tempo de requisição esgotado. Tente novamente.';
 }

 if (isCancelError(error)) {
   return 'Requisição cancelada.';
 }

 if (error.response?.data?.error) {
   return error.response.data.error;
 }

 if (error.response?.data?.message) {
   return error.response.data.message;
 }

 if (error.message) {
   return error.message;
 }

 return 'Erro desconhecido';
};

/**
* Formata headers para log (remove dados sensíveis)
*/
export const sanitizeHeaders = (headers: any): any => {
 const sanitized = { ...headers };

 // Remover dados sensíveis
 const sensitiveKeys = ['authorization', 'cookie', 'x-api-key'];

 sensitiveKeys.forEach(key => {
   const lowerKey = key.toLowerCase();
   Object.keys(sanitized).forEach(headerKey => {
     if (headerKey.toLowerCase() === lowerKey) {
       sanitized[headerKey] = '***';
     }
   });
 });

 return sanitized;
};