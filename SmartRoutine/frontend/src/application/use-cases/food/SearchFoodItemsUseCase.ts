import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { AppError } from '@/shared/errors/AppError';

/**
* Opções de busca avançada
*/
export interface SearchOptions {
    termo: string;
    usuarioId?: string;
    categoria?: string;
    incluirVencidos?: boolean;
    ordenarPor?: 'relevancia' | 'nome' | 'dataValidade';
}

/**
* Use Case: Buscar Itens de Alimentos
* 
* Responsabilidade:
* - Buscar alimentos por nome
* - Filtrar resultados
* - Ordenar por relevância
*/
export class SearchFoodItemsUseCase {
    constructor(private readonly foodItemRepository: IFoodItemRepository) { }

    /**
     * Busca alimentos por nome
     * 
     * @param nome - Nome ou parte do nome
     * @returns Promise<FoodItem[]> - Alimentos encontrados
     */
    async execute(nome: string): Promise<FoodItem[]> {
        try {
            // Validar entrada
            if (!nome || nome.trim().length === 0) {
                return [];
            }

            if (nome.trim().length < 2) {
                throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
            }

            return await this.foodItemRepository.findByName(nome);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no SearchFoodItemsUseCase:', error);
            throw AppError.internal('Erro ao buscar alimentos');
        }
    }

    /**
     * Busca com opções avançadas
     * 
     * @param options - Opções de busca
     * @returns Promise<FoodItem[]> - Alimentos encontrados
     */
    async executeAdvanced(options: SearchOptions): Promise<FoodItem[]> {
        try {
            // Validar termo
            if (!options.termo || options.termo.trim().length < 2) {
                throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
            }

            // Buscar por nome
            let items = await this.foodItemRepository.findByName(options.termo);

            // Filtrar por usuário se fornecido
            if (options.usuarioId) {
                items = items.filter(item => item.usuarioId === options.usuarioId);
            }

            // Filtrar por categoria se fornecida
            if (options.categoria) {
                items = items.filter(item =>
                    item.categoria.toLowerCase() === options.categoria!.toLowerCase()
                );
            }

            // Filtrar vencidos se necessário
            if (!options.incluirVencidos) {
                items = items.filter(item => !item.isVencido());
            }

            // Ordenar resultados
            items = this.sortResults(items, options.ordenarPor || 'relevancia', options.termo);

            return items;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro na busca avançada');
        }
    }

    /**
     * Busca em múltiplos campos (nome, categoria, lote)
     * 
     * @param termo - Termo de busca
     * @param usuarioId - ID do usuário
     * @returns Promise<FoodItem[]> - Resultados
     */
    async executeMultiField(termo: string, usuarioId: string): Promise<FoodItem[]> {
        try {
            if (!termo || termo.trim().length < 2) {
                return [];
            }

            const items = await this.foodItemRepository.findByUserId(usuarioId);
            const termoNormalizado = termo.toLowerCase();

            return items.filter(item =>
                item.nome.toLowerCase().includes(termoNormalizado) ||
                item.categoria.toLowerCase().includes(termoNormalizado) ||
                (item.lote && item.lote.toLowerCase().includes(termoNormalizado))
            );
        } catch (error) {
            throw AppError.internal('Erro na busca multi-campo');
        }
    }

    /**
     * Busca com sugestões (fuzzy search simplificado)
     */
    async executeWithSuggestions(termo: string, usuarioId: string): Promise<{
        results: FoodItem[];
        suggestions: string[];
    }> {
        try {
            const results = await this.executeAdvanced({
                termo,
                usuarioId,
                incluirVencidos: false
            });

            // Gerar sugestões baseadas nos resultados
            const suggestions = results
                .map(item => item.nome)
                .filter((nome, index, self) => self.indexOf(nome) === index)
                .slice(0, 5);

            return {
                results,
                suggestions
            };
        } catch (error) {
            return {
                results: [],
                suggestions: []
            };
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Ordena resultados da busca
     */
    private sortResults(
        items: FoodItem[],
        ordenacao: 'relevancia' | 'nome' | 'dataValidade',
        termo: string
    ): FoodItem[] {
        switch (ordenacao) {
            case 'relevancia':
                return this.sortByRelevance(items, termo);

            case 'nome':
                return items.sort((a, b) => a.nome.localeCompare(b.nome));

            case 'dataValidade':
                return items.sort((a, b) => a.diasAteVencimento - b.diasAteVencimento);

            default:
                return items;
        }
    }

    /**
     * Ordena por relevância (match exato primeiro)
     */
    private sortByRelevance(items: FoodItem[], termo: string): FoodItem[] {
        const termoNormalizado = termo.toLowerCase();

        return items.sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();

            // Match exato tem prioridade máxima
            const aExato = nomeA === termoNormalizado;
            const bExato = nomeB === termoNormalizado;
            if (aExato && !bExato) return -1;
            if (!aExato && bExato) return 1;

            // Começa com o termo tem prioridade alta
            const aComeca = nomeA.startsWith(termoNormalizado);
            const bComeca = nomeB.startsWith(termoNormalizado);
            if (aComeca && !bComeca) return -1;
            if (!aComeca && bComeca) return 1;

            // Contém o termo (já garantido pelo filtro anterior)
            // Ordenar alfabeticamente
            return nomeA.localeCompare(nomeB);
        });
    }
}