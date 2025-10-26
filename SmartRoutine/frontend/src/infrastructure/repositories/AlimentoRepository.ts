import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Alimento do catálogo
*/
export interface Alimento {
    id: number;
    nome: string;
    categoria: string;
}

/**
* Repositório de Alimentos (Catálogo)
* 
* Responsabilidades:
* - Comunicação com API de alimentos (catálogo)
* - CRUD de alimentos base
* - Listagem de categorias
* 
* Nota: Separado de FoodItemRepository pois gerencia o catálogo,
* não os itens da despensa do usuário
*/
export class AlimentoRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todos os alimentos do catálogo
     */
    async findAll(): Promise<Alimento[]> {
        try {
            const data = await this.apiClient.get<Alimento[]>(ENDPOINTS.ALIMENTO.BASE);
            return data;
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar alimentos');
        }
    }

    /**
     * Busca alimento por ID
     */
    async findById(id: number): Promise<Alimento | null> {
        try {
            const data = await this.apiClient.get<Alimento>(ENDPOINTS.ALIMENTO.BY_ID(id));
            return data;
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar alimento');
        }
    }

    /**
     * Busca alimentos por categoria
     */
    async findByCategory(categoria: string): Promise<Alimento[]> {
        try {
            const data = await this.apiClient.get<Alimento[]>(
                ENDPOINTS.ALIMENTO.BY_CATEGORY(categoria)
            );
            return data;
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por categoria');
        }
    }

    /**
     * Busca alimentos por nome
     */
    async searchByName(nome: string): Promise<Alimento[]> {
        try {
            const data = await this.apiClient.get<Alimento[]>(
                ENDPOINTS.ALIMENTO.SEARCH(nome)
            );
            return data;
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por nome');
        }
    }

    /**
     * Lista categorias disponíveis
     */
    async getCategories(): Promise<string[]> {
        try {
            const data = await this.apiClient.get<string[]>(ENDPOINTS.ALIMENTO.CATEGORIES);
            return data;
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar categorias');
        }
    }

    /**
     * Cria alimento no catálogo
     */
    async create(nome: string, categoria: string): Promise<Alimento> {
        try {
            const payload = { nome, categoria };
            const data = await this.apiClient.post<Alimento>(ENDPOINTS.ALIMENTO.CREATE, payload);
            return data;
        } catch (error) {
            throw this.handleError(error, 'Erro ao criar alimento');
        }
    }

    /**
     * Atualiza alimento
     */
    async update(id: number, nome: string, categoria: string): Promise<Alimento> {
        try {
            const payload = { nome, categoria };
            await this.apiClient.put(ENDPOINTS.ALIMENTO.UPDATE(id), payload);

            const updated = await this.findById(id);
            if (!updated) {
                throw AppError.notFound('Alimento não encontrado após atualização');
            }

            return updated;
        } catch (error) {
            throw this.handleError(error, 'Erro ao atualizar alimento');
        }
    }

    /**
     * Deleta alimento
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.ALIMENTO.DELETE(id));
        } catch (error) {
            throw this.handleError(error, 'Erro ao deletar alimento');
        }
    }

    /**
     * Verifica se alimento existe
     */
    async existsById(id: number): Promise<boolean> {
        try {
            const alimento = await this.findById(id);
            return alimento !== null;
        } catch (error) {
            return false;
        }
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