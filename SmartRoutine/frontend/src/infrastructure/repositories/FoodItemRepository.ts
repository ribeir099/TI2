import {
    IFoodItemRepository,
    CreateFoodItemData,
    UpdateFoodItemData,
    FoodItemFilters,
    FoodItemSortOptions
} from '@/domain/repositories/IFoodItemRepository';
import { FoodItem } from '@/domain/entities/FoodItem';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS, buildUrlWithParams } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Implementação do Repositório de Itens de Alimentos
* 
* Responsabilidades:
* - Comunicação com API de alimentos e registros
* - Conversão de DTOs para Entities
* - Mapeamento entre Alimento e Registra
*/
export class FoodItemRepository implements IFoodItemRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todos os itens
     */
    async findAll(): Promise<FoodItem[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.REGISTRA.BASE);
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar itens');
        }
    }

    /**
     * Busca item por ID
     */
    async findById(id: number): Promise<FoodItem | null> {
        try {
            const data = await this.apiClient.get(ENDPOINTS.REGISTRA.BY_ID(id));
            return FoodItem.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar item');
        }
    }

    /**
     * Lista itens por usuário
     */
    async findByUserId(usuarioId: string): Promise<FoodItem[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.REGISTRA.BY_USER(usuarioId));
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar itens do usuário');
        }
    }

    /**
     * Lista itens por categoria
     */
    async findByCategory(categoria: string): Promise<FoodItem[]> {
        try {
            // Buscar por alimentos da categoria
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.ALIMENTO.BY_CATEGORY(categoria)
            );
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por categoria');
        }
    }

    /**
     * Busca itens por nome
     */
    async findByName(nome: string): Promise<FoodItem[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.ALIMENTO.SEARCH(nome)
            );
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por nome');
        }
    }

    /**
     * Lista itens vencendo
     */
    async findExpiringItems(usuarioId: string, dias: number): Promise<FoodItem[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.REGISTRA.EXPIRING(usuarioId, dias)
            );
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens vencendo');
        }
    }

    /**
     * Lista itens vencidos
     */
    async findExpiredItems(usuarioId: string): Promise<FoodItem[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.REGISTRA.EXPIRED(usuarioId)
            );
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens vencidos');
        }
    }

    /**
     * Lista itens frescos
     */
    async findFreshItems(usuarioId: string): Promise<FoodItem[]> {
        try {
            // Se API não tiver endpoint específico, buscar todos e filtrar
            const allItems = await this.findByUserId(usuarioId);
            return allItems.filter(item => item.isFresco());
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens frescos');
        }
    }

    /**
     * Busca com filtros
     */
    async findByFilters(filters: FoodItemFilters): Promise<FoodItem[]> {
        try {
            // Se API suportar filtros, usar query params
            const params = this.buildFilterParams(filters);
            const data = await this.apiClient.get<any[]>(ENDPOINTS.REGISTRA.BASE, { params });
            return data.map(dto => FoodItem.fromDTO(dto));
        } catch (error) {
            // Fallback: filtrar client-side
            try {
                const allItems = filters.usuarioId
                    ? await this.findByUserId(filters.usuarioId)
                    : await this.findAll();
                return this.filterItemsClientSide(allItems, filters);
            } catch (fallbackError) {
                throw this.handleError(fallbackError, 'Erro ao buscar com filtros');
            }
        }
    }

    /**
     * Busca com ordenação
     */
    async findWithSort(
        usuarioId: string,
        sortOptions: FoodItemSortOptions
    ): Promise<FoodItem[]> {
        try {
            const items = await this.findByUserId(usuarioId);
            return this.sortItems(items, sortOptions);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar com ordenação');
        }
    }

    /**
     * Cria novo item
     */
    async create(foodData: CreateFoodItemData): Promise<FoodItem> {
        try {
            const payload = {
                alimentoId: foodData.alimentoId || 0, // Ajustar conforme API
                usuarioId: foodData.usuarioId,
                dataCompra: foodData.dataCompra || new Date().toISOString().split('T')[0],
                dataValidade: foodData.dataValidade,
                unidadeMedida: foodData.unidadeMedida,
                quantidade: foodData.quantidade,
                lote: foodData.lote
            };

            const data = await this.apiClient.post(ENDPOINTS.REGISTRA.CREATE, payload);

            // Se API retorna apenas mensagem, buscar o item criado
            if (data.message && !data.id) {
                const items = await this.findByUserId(foodData.usuarioId);
                const newItem = items[items.length - 1]; // Último item (mais recente)
                return newItem;
            }

            return FoodItem.fromDTO(data);
        } catch (error) {
            throw this.handleError(error, 'Erro ao criar item');
        }
    }

    /**
     * Atualiza item
     */
    async update(id: number, foodData: UpdateFoodItemData): Promise<FoodItem> {
        try {
            const payload = {
                ...(foodData.nome && { nome: foodData.nome }),
                ...(foodData.quantidade !== undefined && { quantidade: foodData.quantidade }),
                ...(foodData.unidadeMedida && { unidadeMedida: foodData.unidadeMedida }),
                ...(foodData.dataValidade && { dataValidade: foodData.dataValidade }),
                ...(foodData.categoria && { categoria: foodData.categoria }),
                ...(foodData.dataCompra && { dataCompra: foodData.dataCompra }),
                ...(foodData.lote && { lote: foodData.lote })
            };

            await this.apiClient.put(ENDPOINTS.REGISTRA.UPDATE(id), payload);

            // Buscar item atualizado
            const updatedItem = await this.findById(id);
            if (!updatedItem) {
                throw AppError.notFound('Item não encontrado após atualização');
            }

            return updatedItem;
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Item não encontrado');
            }
            throw this.handleError(error, 'Erro ao atualizar item');
        }
    }

    /**
     * Deleta item
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.REGISTRA.DELETE(id));
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Item não encontrado');
            }
            throw this.handleError(error, 'Erro ao deletar item');
        }
    }

    /**
     * Deleta itens vencidos
     */
    async deleteExpiredItems(usuarioId: string): Promise<number> {
        try {
            const expiredItems = await this.findExpiredItems(usuarioId);

            let deleted = 0;
            for (const item of expiredItems) {
                try {
                    await this.delete(item.id);
                    deleted++;
                } catch (error) {
                    console.error(`Erro ao deletar item ${item.id}:`, error);
                }
            }

            return deleted;
        } catch (error) {
            throw this.handleError(error, 'Erro ao deletar itens vencidos');
        }
    }

    /**
     * Conta itens por usuário
     */
    async countByUserId(usuarioId: string): Promise<number> {
        try {
            const items = await this.findByUserId(usuarioId);
            return items.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Conta itens por categoria
     */
    async countByCategory(usuarioId: string): Promise<Record<string, number>> {
        try {
            const items = await this.findByUserId(usuarioId);
            const counts: Record<string, number> = {};

            items.forEach(item => {
                counts[item.categoria] = (counts[item.categoria] || 0) + 1;
            });

            return counts;
        } catch (error) {
            return {};
        }
    }

    /**
     * Lista categorias do usuário
     */
    async getCategories(usuarioId: string): Promise<string[]> {
        try {
            const items = await this.findByUserId(usuarioId);
            const categories = new Set(items.map(item => item.categoria));
            return Array.from(categories).sort();
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar categorias');
        }
    }

    /**
     * Verifica se item existe
     */
    async existsById(id: number): Promise<boolean> {
        try {
            const item = await this.findById(id);
            return item !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Busca por lote
     */
    async findByLote(lote: string): Promise<FoodItem[]> {
        try {
            const allItems = await this.findAll();
            return allItems.filter(item => item.lote === lote);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por lote');
        }
    }

    /**
     * Calcula valor total de shelf life
     */
    async calculateTotalShelfLifeValue(usuarioId: string): Promise<number> {
        try {
            const items = await this.findByUserId(usuarioId);
            return items.reduce((sum, item) => {
                const daysValue = Math.max(0, item.diasAteVencimento);
                return sum + (item.quantidade * daysValue);
            }, 0);
        } catch (error) {
            return 0;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Constrói parâmetros de filtro
     */
    private buildFilterParams(filters: FoodItemFilters): Record<string, any> {
        const params: Record<string, any> = {};

        if (filters.nome) params.nome = filters.nome;
        if (filters.categoria) params.categoria = filters.categoria;
        if (filters.usuarioId) params.usuarioId = filters.usuarioId;
        if (filters.dataValidadeInicio) params.dataValidadeInicio = filters.dataValidadeInicio;
        if (filters.dataValidadeFim) params.dataValidadeFim = filters.dataValidadeFim;
        if (filters.vencido !== undefined) params.vencido = filters.vencido;
        if (filters.vencendoEmDias !== undefined) params.vencendoEmDias = filters.vencendoEmDias;

        return params;
    }

    /**
     * Filtra itens client-side
     */
    private filterItemsClientSide(items: FoodItem[], filters: FoodItemFilters): FoodItem[] {
        return items.filter(item => {
            if (filters.nome && !item.contemNome(filters.nome)) {
                return false;
            }

            if (filters.categoria && !item.pertenceCategoria(filters.categoria)) {
                return false;
            }

            if (filters.vencido !== undefined) {
                if (filters.vencido && !item.isVencido()) return false;
                if (!filters.vencido && item.isVencido()) return false;
            }

            if (filters.vencendoEmDias !== undefined) {
                if (!item.isVencendoEmBreve(filters.vencendoEmDias)) return false;
            }

            return true;
        });
    }

    /**
     * Ordena itens
     */
    private sortItems(items: FoodItem[], options: FoodItemSortOptions): FoodItem[] {
        return [...items].sort((a, b) => {
            let comparison = 0;

            switch (options.campo) {
                case 'nome':
                    comparison = a.nome.localeCompare(b.nome);
                    break;
                case 'dataValidade':
                    comparison = new Date(a.dataValidade).getTime() - new Date(b.dataValidade).getTime();
                    break;
                case 'categoria':
                    comparison = a.categoria.localeCompare(b.categoria);
                    break;
                case 'quantidade':
                    comparison = a.quantidade - b.quantidade;
                    break;
                case 'dataCompra':
                    if (a.dataCompra && b.dataCompra) {
                        comparison = new Date(a.dataCompra).getTime() - new Date(b.dataCompra).getTime();
                    }
                    break;
            }

            return options.ordem === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Trata erros
     */
    private handleError(error: any, defaultMessage: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        console.error(defaultMessage, error);
        return AppError.internal(defaultMessage);
    }
}