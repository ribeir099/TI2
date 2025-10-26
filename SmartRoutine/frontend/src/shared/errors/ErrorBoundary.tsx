import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from './AppError';
import { ErrorHandler, FormattedError } from './ErrorHandler';
import { ErrorLog, errorLogger } from './ErrorLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
* Props do Error Boundary
*/
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: FormattedError, resetError: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showDetails?: boolean;
}

/**
* State do Error Boundary
*/
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    formattedError: FormattedError | null;
}

/**
* React Error Boundary
* 
* Responsabilidades:
* - Capturar erros não tratados
* - Exibir UI de erro
* - Permitir recuperação
* - Logging automático
*/
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            formattedError: null
        };
    }

    /**
     * Captura erro
     */
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error
        };
    }

    /**
     * Processa erro capturado
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Formatar erro
        const formattedError = ErrorHandler.format(error, {
            component: errorInfo.componentStack?.split('\n')[1]?.trim()
        });

        this.setState({ errorInfo, formattedError });

        // Log do erro
        errorLogger.log(
            error instanceof AppError ? error : AppError.fromError(error),
            {
                component: errorInfo.componentStack?.split('\n')[1]?.trim(),
                action: 'component_error'
            }
        );

        // Callback customizado
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    /**
     * Reseta erro
     */
    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            formattedError: null
        });
    };

    /**
     * Recarrega página
     */
    reloadPage = (): void => {
        window.location.reload();
    };

    /**
     * Volta para home
     */
    goHome = (): void => {
        window.location.href = '/';
    };

    /**
     * Renderiza UI de erro padrão
     */
    renderDefaultError(): ReactNode {
        const { formattedError } = this.state;
        const { showDetails } = this.props;

        if (!formattedError) return null;

        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-5">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        <CardTitle>{formattedError.title}</CardTitle>
                        <CardDescription>{formattedError.message}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {showDetails && this.state.error && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-xs font-mono text-muted-foreground">
                                    {this.state.error.message}
                                </p>
                                {formattedError.statusCode && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Status Code: {formattedError.statusCode}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {formattedError.canRetry && (
                                <Button onClick={this.resetError} className="w-full">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Tentar Novamente
                                </Button>
                            )}

                            <Button variant="outline" onClick={this.goHome} className="w-full">
                                <Home className="w-4 h-4 mr-2" />
                                Voltar ao Início
                            </Button>

                            {import.meta.env.DEV && (
                                <Button variant="ghost" onClick={this.reloadPage} className="w-full">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Recarregar Página
                                </Button>
                            )}
                        </div>

                        {formattedError.actions && formattedError.actions.length > 0 && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Ações sugeridas:</p>
                                <div className="space-y-2">
                                    {formattedError.actions.map((action, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={action.onClick}
                                            className="w-full"
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Usar fallback customizado se fornecido
            if (this.props.fallback && this.state.formattedError) {
                return this.props.fallback(this.state.formattedError, this.resetError);
            }

            // UI padrão
            return this.renderDefaultError();
        }

        return this.props.children;
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Salva em localStorage
     */
    private saveToStorage(errorLog: ErrorLog): void {
        try {
            const key = 'smartroutine_error_logs';
            const stored = localStorage.getItem(key);
            const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];

            logs.push(errorLog);

            // Manter apenas últimos 20
            if (logs.length > 20) {
                logs.splice(0, logs.length - 20);
            }

            localStorage.setItem(key, JSON.stringify(logs));
        } catch (error) {
            console.error('Erro ao salvar log:', error);
        }
    }

    /**
     * Envia para serviço externo
     */
    private sendToExternalService(errorLog: ErrorLog): void {
        // TODO: Implementar integração
        console.log('📤 Error log sent:', errorLog);
    }

    /**
     * Log no console
     */
    private logToConsole(errorLog: ErrorLog): void {
        console.group('🔴 Error Boundary');
        console.error('Error:', errorLog.error);
        console.error('Context:', errorLog.context);
        console.error('Severity:', errorLog.severity);
        console.groupEnd();
    }

    /**
     * Gera ID
     */
    private generateId(): string {
        return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}