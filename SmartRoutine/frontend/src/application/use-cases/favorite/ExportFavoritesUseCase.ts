import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AppError } from '@/shared/errors/AppError';

/**
* Formato de exportação
*/
export type ExportFormat = 'json' | 'csv' | 'markdown';

/**
* Dados exportados
*/
export interface ExportedFavoritesData {
    format: ExportFormat;
    data: string;
    filename: string;
    mimeType: string;
}

/**
* Use Case: Exportar Favoritos
* 
* Responsabilidade:
* - Exportar lista de favoritos em diversos formatos
* - Gerar arquivos para download
*/
export class ExportFavoritesUseCase {
    constructor(
        private readonly favoritaRepository: IReceitaFavoritaRepository,
        private readonly recipeRepository: IRecipeRepository
    ) { }

    /**
     * Exporta favoritos em formato especificado
     * 
     * @param usuarioId - ID do usuário
     * @param format - Formato de exportação
     * @returns Promise<ExportedFavoritesData> - Dados exportados
     */
    async execute(usuarioId: string, format: ExportFormat = 'json'): Promise<ExportedFavoritesData> {
        try {
            // Validar entrada
            if (!usuarioId || usuarioId.trim().length === 0) {
                throw AppError.badRequest('ID do usuário é obrigatório');
            }

            // Buscar favoritos
            const favoritas = await this.favoritaRepository.findByUserId(usuarioId);

            if (favoritas.length === 0) {
                throw AppError.notFound('Usuário não possui receitas favoritas');
            }

            // Buscar receitas completas
            const receitasIds = favoritas.map(f => f.receitaId);
            const receitas = await Promise.all(
                receitasIds.map(id => this.recipeRepository.findById(id))
            );

            const receitasValidas = receitas.filter(r => r !== null) as Recipe[];

            // Exportar no formato solicitado
            switch (format) {
                case 'json':
                    return this.exportAsJSON(receitasValidas, usuarioId);
                case 'csv':
                    return this.exportAsCSV(receitasValidas, usuarioId);
                case 'markdown':
                    return this.exportAsMarkdown(receitasValidas, usuarioId);
                default:
                    throw AppError.badRequest('Formato de exportação inválido');
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no ExportFavoritesUseCase:', error);
            throw AppError.internal('Erro ao exportar favoritos');
        }
    }

    /**
     * Exporta como JSON
     */
    private exportAsJSON(receitas: Recipe[], usuarioId: string): ExportedFavoritesData {
        const data = {
            exportDate: new Date().toISOString(),
            userId: usuarioId,
            totalRecipes: receitas.length,
            recipes: receitas.map(r => r.toDTO())
        };

        return {
            format: 'json',
            data: JSON.stringify(data, null, 2),
            filename: `favoritos-${usuarioId}-${Date.now()}.json`,
            mimeType: 'application/json'
        };
    }

    /**
     * Exporta como CSV
     */
    private exportAsCSV(receitas: Recipe[], usuarioId: string): ExportedFavoritesData {
        const headers = ['ID', 'Título', 'Tempo Preparo', 'Porção', 'Dificuldade', 'Calorias', 'Tags'];

        const rows = receitas.map(r => [
            r.id,
            `"${r.titulo}"`,
            r.tempoPreparo,
            `"${r.porcao}"`,
            r.dificuldade || 'N/A',
            r.calorias || 'N/A',
            `"${r.tags?.join(', ') || 'N/A'}"`
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return {
            format: 'csv',
            data: csv,
            filename: `favoritos-${usuarioId}-${Date.now()}.csv`,
            mimeType: 'text/csv'
        };
    }

    /**
     * Exporta como Markdown
     */
    private exportAsMarkdown(receitas: Recipe[], usuarioId: string): ExportedFavoritesData {
        const lines = [
            '# 📚 Minhas Receitas Favoritas',
            '',
            `**Exportado em:** ${new Date().toLocaleDateString('pt-BR')}`,
            `**Total de Receitas:** ${receitas.length}`,
            '',
            '---',
            ''
        ];

        receitas.forEach((recipe, index) => {
            lines.push(`## ${index + 1}. ${recipe.titulo}`);
            lines.push('');
            lines.push(`⏱️ **Tempo de Preparo:** ${recipe.tempoFormatado}`);
            lines.push(`🍽️ **Porção:** ${recipe.porcao}`);

            if (recipe.dificuldade) {
                lines.push(`📊 **Dificuldade:** ${recipe.dificuldade}`);
            }

            if (recipe.calorias) {
                lines.push(`🔥 **Calorias:** ${recipe.calorias} kcal`);
            }

            lines.push('');
            lines.push('### Ingredientes:');
            recipe.ingredientes.forEach(ing => {
                lines.push(`- ${ing}`);
            });

            lines.push('');
            lines.push('### Modo de Preparo:');
            recipe.modoPreparo.forEach((passo, i) => {
                lines.push(`${i + 1}. ${passo}`);
            });

            if (recipe.tags && recipe.tags.length > 0) {
                lines.push('');
                lines.push(`**Tags:** ${recipe.tags.join(', ')}`);
            }

            lines.push('');
            lines.push('---');
            lines.push('');
        });

        return {
            format: 'markdown',
            data: lines.join('\n'),
            filename: `favoritos-${usuarioId}-${Date.now()}.md`,
            mimeType: 'text/markdown'
        };
    }
}