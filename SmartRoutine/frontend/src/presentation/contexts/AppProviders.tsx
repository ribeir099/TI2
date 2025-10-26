import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';
import { ModalProvider } from './ModalContext';
import { LoadingProvider } from './LoadingContext';
import { UIProvider } from './UIContext';
import { SearchProvider } from './SearchContext';
import { NotificationContainer } from './components/NotificationContainer';

/**
* Props dos Providers
*/
interface AppProvidersProps {
    children: ReactNode;
}

/**
* Composição de todos os Providers da aplicação
* 
* Ordem importa:
* 1. Theme (visual)
* 2. Notification (feedback)
* 3. Loading (overlay)
* 4. Auth (dados do usuário)
* 5. UI (estado da interface)
* 6. Modal (dialogs)
* 7. Search (busca global)
*/
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <LoadingProvider>
                    <AuthProvider>
                        <UIProvider>
                            <ModalProvider>
                                <SearchProvider>
                                    {children}
                                    <NotificationContainer />
                                </SearchProvider>
                            </ModalProvider>
                        </UIProvider>
                    </AuthProvider>
                </LoadingProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
};