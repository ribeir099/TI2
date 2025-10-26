import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { AppError } from '@/shared/errors/AppError';
import { User } from '@/domain/entities';

/**
* Formato de exportação
*/
export type ExportFormat = 'json' | 'csv' | 'pdf';

/**
* Dados exportados do usuário (LGPD/GDPR compliance)
*/
export interface ExportedUserData {
    format: ExportFormat;
    data: string;
    filename: string;
    mimeType: string;
    generatedAt: Date;
}

/**
* Use Case: Exportar Dados do Usuário
* 
* Responsabilidade:
* - Exportar todos os dados do usuário
* - Compliance com LGPD/GDPR
* - Múltiplos formatos
*/
export class ExportUserDataUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly foodItemRepository?: IFoodItemRepository,
        private readonly favoritaRepository?: IReceitaFavoritaRepository
    ) { }

    /**
     * Exporta dados do usuário
     * 
     * @param userId - ID do usuário
     * @param format - Formato de exportação
     * @returns Promise<ExportedUserData> - Dados exportados
     */
    async execute(userId: string, format: ExportFormat = 'json'): Promise<ExportedUserData> {
        try {
            // Validar entrada
            if (!userId || userId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar dados do usuário
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            // Coletar todos os dados
            const userData = await this.collectUserData(userId, user);

            // Exportar no formato solicitado
            switch (format) {
                case 'json':
                    return this.exportAsJSON(userData, userId);

                case 'csv':
                    return this.exportAsCSV(userData, userId);

                case 'pdf':
                    throw AppError.badRequest('Exportação em PDF não implementada ainda');

                default:
                    throw AppError.badRequest('Formato de exportação inválido');
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ExportUserDataUseCase:', error);
            throw AppError.internal('Erro ao exportar dados do usuário');
        }
    }

    /**
     * Preview dos dados antes de exportar
     */
    async previewData(userId: string): Promise<{
        totalDataPoints: number;
        categories: Array<{ name: string; count: number }>;
        estimatedSize: string;
    }> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw AppError.notFound('Usuário não encontrado');
            }

            let foodItemsCount = 0;
            let favoritesCount = 0;

            if (this.foodItemRepository) {
                foodItemsCount = await this.foodItemRepository.countByUserId(userId);
            }

            if (this.favoritaRepository) {
                favoritesCount = await this.favoritaRepository.countByUserId(userId);
            }

            const categories = [
                { name: 'Dados Pessoais', count: 1 },
                { name: 'Itens da Despensa', count: foodItemsCount },
                { name: 'Receitas Favoritas', count: favoritesCount }
            ];

            const totalDataPoints = 1 + foodItemsCount + favoritesCount;
            const estimatedSize = this.estimateSize(totalDataPoints);

            return {
                totalDataPoints,
                categories,
                estimatedSize
            };
        } catch (error) {
            throw AppError.internal('Erro ao obter preview');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Coleta todos os dados do usuário
     */
    private async collectUserData(userId: string, user: User): Promise<any> {
        const data: any = {
            usuario: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                dataNascimento: user.dataNascimento,
                dataCriacao: user.dataCriacao
            },
            despensa: [],
            favoritas: []
        };

        // Coletar itens da despensa
        if (this.foodItemRepository) {
            try {
                const items = await this.foodItemRepository.findByUserId(userId);
                data.despensa = items.map(item => item.toDTO());
            } catch (error) {
                console.error('Erro ao coletar itens da despensa:', error);
            }
        }

        // Coletar favoritas
        if (this.favoritaRepository) {
            try {
                const favoritas = await this.favoritaRepository.findByUserId(userId);
                data.favoritas = favoritas.map(f => f.toDTO());
            } catch (error) {
                console.error('Erro ao coletar favoritas:', error);
            }
        }

        return data;
    }

    /**
     * Exporta como JSON
     */
    private exportAsJSON(data: any, userId: string): ExportedUserData {
        const jsonData = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            ...data
        };

        return {
            format: 'json',
            data: JSON.stringify(jsonData, null, 2),
            filename: `smartroutine-dados-${userId}-${Date.now()}.json`,
            mimeType: 'application/json',
            generatedAt: new Date()
        };
    }

    /**
     * Exporta como CSV
     */
    private exportAsCSV(data: any, userId: string): ExportedUserData {
        const lines: string[] = [];

        // Dados do usuário
        lines.push('# DADOS DO USUÁRIO');
        lines.push('Nome,Email,Data Nascimento');
        lines.push(`"${data.usuario.nome}","${data.usuario.email}","${data.usuario.dataNascimento}"`);
        lines.push('');

        // Despensa
        if (data.despensa.length > 0) {
            lines.push('# ITENS DA DESPENSA');
            lines.push('ID,Nome,Quantidade,Unidade,Categoria,Data Validade');
            data.despensa.forEach((item: any) => {
                lines.push(
                    `${item.id},"${item.nome}",${item.quantidade},"${item.unidadeMedida}","${item.categoria}","${item.dataValidade}"`
                );
            });
            lines.push('');
        }

        // Favoritas
        if (data.favoritas.length > 0) {
            lines.push('# RECEITAS FAVORITAS');
            lines.push('ID,Receita,Data Adição');
            data.favoritas.forEach((fav: any) => {
                lines.push(`${fav.id},"${fav.tituloReceita}","${fav.dataAdicao}"`);
            });
        }

        return {
            format: 'csv',
            data: lines.join('\n'),
            filename: `smartroutine-dados-${userId}-${Date.now()}.csv`,
            mimeType: 'text/csv',
            generatedAt: new Date()
        };
    }

    /**
     * Estima tamanho dos dados
     */
    private estimateSize(dataPoints: number): string {
        // Estimativa aproximada: ~1KB por ponto de dado
        const sizeInKB = dataPoints;

        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        }

        return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
}