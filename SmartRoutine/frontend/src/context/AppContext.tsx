import React from 'react';
import { AuthProvider } from './AuthContext';
import { FoodProvider } from './FoodContext';
import { RecipeProvider } from './RecipeContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';
import { AppProviderProps } from '@/typings';



/**
* Provider combinado que agrupa todos os contexts da aplicação
* Ordem importante: AuthProvider deve vir antes dos que dependem dele
*/
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <FoodProvider>
            <RecipeProvider>
              {children}
            </RecipeProvider>
          </FoodProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};