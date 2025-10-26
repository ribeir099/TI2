import { AppError } from '@/shared/errors/AppError';

/**
* Preferências do usuário
*/
export interface UserPreferences {
 notificacoes: {
   email: boolean;
   push: boolean;
   vencimento: boolean;
   novasReceitas: boolean;
 };
 privacidade: {
   perfilPublico: boolean;
   mostrarEmail: boolean;
   mostrarReceitas: boolean;
 };
 interface: {
   tema: 'light' | 'dark' | 'auto';
   idioma: 'pt-BR' | 'en-US' | 'es-ES';
   densidade: 'confortavel' | 'compacta';
 };
 alimentacao: {
   restricoes: string[];
   preferencias: string[];
   alergias: string[];
 };
}

/**
* Use Case: Atualizar Preferências do Usuário
* 
* Responsabilidade:
* - Gerenciar preferências do usuário
* - Salvar configurações
* - Validar preferências
* 
* Nota: Preferências podem ser salvas em localStorage ou banco separado
*/
export class UpdateUserPreferencesUseCase {
 /**
  * Atualiza preferências
  * 
  * @param userId - ID do usuário
  * @param preferences - Preferências a atualizar
  * @returns Promise<UserPreferences> - Preferências atualizadas
  */
 async execute(
   userId: string,
   preferences: Partial<UserPreferences>
 ): Promise<UserPreferences> {
   try {
     // Validar entrada
     this.validateInput(userId, preferences);

     // Obter preferências atuais
     const currentPreferences = this.loadPreferences(userId);

     // Mesclar com novas preferências
     const updatedPreferences = this.mergePreferences(currentPreferences, preferences);

     // Salvar preferências
     this.savePreferences(userId, updatedPreferences);

     return updatedPreferences;
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }

     console.error('Erro no UpdateUserPreferencesUseCase:', error);
     throw AppError.internal('Erro ao atualizar preferências');
   }
 }

 /**
  * Obtém preferências do usuário
  */
 getPreferences(userId: string): UserPreferences {
   try {
     return this.loadPreferences(userId);
   } catch (error) {
     return this.getDefaultPreferences();
   }
 }

 /**
  * Reseta preferências para padrão
  */
 async resetToDefault(userId: string): Promise<UserPreferences> {
   try {
     if (!userId || userId.trim().length === 0) {
       throw AppError.badRequest('ID do usuário é obrigatório');
     }

     const defaultPreferences = this.getDefaultPreferences();
     this.savePreferences(userId, defaultPreferences);

     return defaultPreferences;
   } catch (error) {
     if (error instanceof AppError) throw error;
     throw AppError.internal('Erro ao resetar preferências');
   }
 }

 /**
  * Atualiza apenas notificações
  */
 async updateNotifications(
   userId: string,
   notificacoes: Partial<UserPreferences['notificacoes']>
 ): Promise<UserPreferences> {
   const preferences = this.loadPreferences(userId);
   
   return await this.execute(userId, {
     notificacoes: {
       ...preferences.notificacoes,
       ...notificacoes
     }
   });
 }

 /**
  * Atualiza apenas privacidade
  */
 async updatePrivacy(
   userId: string,
   privacidade: Partial<UserPreferences['privacidade']>
 ): Promise<UserPreferences> {
   const preferences = this.loadPreferences(userId);
   
   return await this.execute(userId, {
     privacidade: {
       ...preferences.privacidade,
       ...privacidade
     }
   });
 }

 /**
  * Atualiza tema
  */
 async updateTheme(userId: string, tema: 'light' | 'dark' | 'auto'): Promise<UserPreferences> {
   const preferences = this.loadPreferences(userId);
   
   return await this.execute(userId, {
     interface: {
       ...preferences.interface,
       tema
     }
   });
 }

 /**
  * Adiciona restrição alimentar
  */
 async addDietaryRestriction(userId: string, restricao: string): Promise<UserPreferences> {
   const preferences = this.loadPreferences(userId);
   const restricoes = preferences.alimentacao.restricoes;

   if (restricoes.includes(restricao)) {
     throw AppError.conflict('Restrição já existe');
   }

   return await this.execute(userId, {
     alimentacao: {
       ...preferences.alimentacao,
       restricoes: [...restricoes, restricao]
     }
   });
 }

 /**
  * Remove restrição alimentar
  */
 async removeDietaryRestriction(userId: string, restricao: string): Promise<UserPreferences> {
   const preferences = this.loadPreferences(userId);
   const restricoes = preferences.alimentacao.restricoes.filter(r => r !== restricao);

   return await this.execute(userId, {
     alimentacao: {
       ...preferences.alimentacao,
       restricoes
     }
   });
 }

 // ==================== STORAGE (LocalStorage) ====================

 /**
  * Carrega preferências do localStorage
  */
 private loadPreferences(userId: string): UserPreferences {
   try {
     const key = `smartroutine_preferences_${userId}`;
     const stored = localStorage.getItem(key);

     if (stored) {
       return JSON.parse(stored);
     }

     return this.getDefaultPreferences();
   } catch (error) {
     return this.getDefaultPreferences();
   }
 }

 /**
  * Salva preferências no localStorage
  */
 private savePreferences(userId: string, preferences: UserPreferences): void {
   try {
     const key = `smartroutine_preferences_${userId}`;
     localStorage.setItem(key, JSON.stringify(preferences));
   } catch (error) {
     console.error('Erro ao salvar preferências:', error);
   }
 }

 /**
  * Obtém preferências padrão
  */
 private getDefaultPreferences(): UserPreferences {
   return {
     notificacoes: {
       email: true,
       push: false,
       vencimento: true,
       novasReceitas: true
     },
     privacidade: {
       perfilPublico: false,
       mostrarEmail: false,
       mostrarReceitas: true
     },
     interface: {
       tema: 'auto',
       idioma: 'pt-BR',
       densidade: 'confortavel'
     },
     alimentacao: {
       restricoes: [],
       preferencias: [],
       alergias: []
     }
   };
 }

 /**
  * Mescla preferências
  */
 private mergePreferences(
   current: UserPreferences,
   updates: Partial<UserPreferences>
 ): UserPreferences {
   return {
     notificacoes: {
       ...current.notificacoes,
       ...(updates.notificacoes || {})
     },
     privacidade: {
       ...current.privacidade,
       ...(updates.privacidade || {})
     },
     interface: {
       ...current.interface,
       ...(updates.interface || {})
     },
     alimentacao: {
       ...current.alimentacao,
       ...(updates.alimentacao || {})
     }
   };
 }

 /**
  * Valida entrada
  */
 private validateInput(userId: string, preferences: Partial<UserPreferences>): void {
   if (!userId || userId.trim().length === 0) {
     throw AppError.badRequest('ID do usuário é obrigatório');
   }

   if (!preferences || Object.keys(preferences).length === 0) {
     throw AppError.badRequest('Nenhuma preferência para atualizar');
   }

   // Validar tema se fornecido
   if (preferences.interface?.tema) {
     const temasValidos = ['light', 'dark', 'auto'];
     if (!temasValidos.includes(preferences.interface.tema)) {
       throw AppError.badRequest('Tema inválido');
     }
   }

   // Validar idioma se fornecido
   if (preferences.interface?.idioma) {
     const idiomasValidos = ['pt-BR', 'en-US', 'es-ES'];
     if (!idiomasValidos.includes(preferences.interface.idioma)) {
       throw AppError.badRequest('Idioma inválido');
     }
   }

   // Validar densidade se fornecida
   if (preferences.interface?.densidade) {
     const densidadesValidas = ['confortavel', 'compacta'];
     if (!densidadesValidas.includes(preferences.interface.densidade)) {
       throw AppError.badRequest('Densidade inválida');
     }
   }
 }
}