import React, { ReactNode } from 'react';

/**
* Props do EmptyLayout
*/
interface EmptyLayoutProps {
    children: ReactNode;
    className?: string;
}

/**
* Layout Vazio
* 
* Usado para páginas especiais que não precisam de estrutura
* (ex: landing page, páginas de erro 404, maintenance)
* 
* Características:
* - Sem header/footer
* - Sem navegação
* - Máxima flexibilidade
*/
export const EmptyLayout: React.FC<EmptyLayoutProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`min-h-screen ${className}`}>
            {children}
        </div>
    );
};