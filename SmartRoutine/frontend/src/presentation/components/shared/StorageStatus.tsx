import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Database, Trash2, Download, Upload } from 'lucide-react';
import { useStorageQuota } from '@/presentation/hooks/useStorageQuota';
import { storageManager, storageQuotaManager } from '@/infrastructure/storage';

export const StorageStatus: React.FC = () => {
    const { quotaInfo, isLoading, isNearLimit, isCritical, percentageUsed } = useStorageQuota();

    const handleClearCache = () => {
        const cleared = storageManager.clearAllExpired();
        alert(`${cleared} itens expirados removidos`);
    };

    const handleExport = () => {
        const data = storageManager.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartroutine-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Armazenamento
                </CardTitle>
                <CardDescription>
                    Status do armazenamento local do navegador
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Uso de Armazenamento</span>
                        <span className="font-medium">{percentageUsed}%</span>
                    </div>
                    <Progress value={percentageUsed} />
                    {isCritical && (
                        <Badge variant="destructive" className="w-full justify-center">
                            Espaço Crítico!
                        </Badge>
                    )}
                    {isNearLimit && !isCritical && (
                        <Badge variant="default" className="w-full justify-center bg-amber-500">
                            Próximo do Limite
                        </Badge>
                    )}
                </div>

                {quotaInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Usado</p>
                            <p className="font-medium">
                                {storageManager['localStorage'].getUsedSpaceFormatted()}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Disponível</p>
                            <p className="font-medium">
                                {storageQuotaManager.formatBytes(quotaInfo.available)}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCache}
                        className="flex-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar Cache
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="flex-1"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};