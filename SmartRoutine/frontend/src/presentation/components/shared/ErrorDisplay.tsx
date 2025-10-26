import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormattedError } from '@/shared/errors/ErrorHandler';
import {
    XCircle,
    AlertTriangle,
    AlertCircle,
    WifiOff,
    RefreshCw
} from 'lucide-react';

interface ErrorDisplayProps {
    error: FormattedError;
    onDismiss?: () => void;
    onRetry?: () => void;
    showActions?: boolean;
}

/**
* Componente para exibir erros
*/
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    error,
    onDismiss,
    onRetry,
    showActions = true
}) => {
    // Selecionar ícone
    const Icon = {
        'XCircle': XCircle,
        'AlertTriangle': AlertTriangle,
        'AlertCircle': AlertCircle,
        'WifiOff': WifiOff
    }[error.icon] || XCircle;

    return (
        <Alert variant="destructive" className="relative">
            <Icon className="h-4 w-4" />
            <AlertTitle>{error.title}</AlertTitle>
            <AlertDescription className="mt-2">
                {error.message}
            </AlertDescription>

            {showActions && (error.canRetry || error.actions || onDismiss) && (
                <div className="mt-4 flex gap-2">
                    {error.canRetry && onRetry && (
                        <Button size="sm" variant="outline" onClick={onRetry}>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Tentar Novamente
                        </Button>
                    )}

                    {error.actions?.map((action, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    ))}

                    {onDismiss && (
                        <Button size="sm" variant="ghost" onClick={onDismiss}>
                            Fechar
                        </Button>
                    )}
                </div>
            )}
        </Alert>
    );
};