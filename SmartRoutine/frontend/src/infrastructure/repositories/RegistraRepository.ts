import {
    IRegistraRepository,
    CreateRegistraData,
    UpdateRegistraData,
    RegistraFilters,
    PurchaseStatistics
} from '@/domain/repositories/IRegistraRepository';
import { Registra } from '@/domain/entities/Registra';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { AppError } from '@/shared/errors/AppError';

/**
* Implementação do Repositório de Registros de Compra
* 
* Responsabilidades:
* - Comunicação com API de registros (compras)
* - Conversão de DTOs para Entities
* - Relacionamento entre usuário, alimento e registro
*/
export class RegistraRepository implements IRegistraRepository {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Lista todos os registros
     */
    async findAll(): Promise<Registra[]> {
        try {
            const data = await this.apiClient.get<any[]>(ENDPOINTS.REGISTRA.BASE);
            return data.map(dto => Registra.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar registros');
        }
    }

    /**
     * Busca registro por ID
     */
    async findById(id: number): Promise<Registra | null> {
        try {
            const data = await this.apiClient.get(ENDPOINTS.REGISTRA.BY_ID(id));
            return Registra.fromDTO(data);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                return null;
            }
            throw this.handleError(error, 'Erro ao buscar registro');
        }
    }

    /**
     * Lista registros por usuário
     */
    async findByUserId(usuarioId: string): Promise<Registra[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.REGISTRA.BY_USER(usuarioId)
            );
            return data.map(dto => Registra.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao listar registros do usuário');
        }
    }

    /**
     * Lista registros por alimento
     */
    async findByFoodId(alimentoId: number): Promise<Registra[]> {
        try {
            const allRegistros = await this.findAll();
            return allRegistros.filter(reg => reg.alimentoId === alimentoId);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por alimento');
        }
    }

    /**
     * Busca por período de compra
     */
    async findByPurchaseDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<Registra[]> {
        try {
            const registros = await this.findByUserId(usuarioId);

            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);

            return registros.filter(reg => {
                const dataCompra = new Date(reg.dataCompra);
                return dataCompra >= inicio && dataCompra <= fim;
            });
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por período de compra');
        }
    }

    /**
     * Busca por período de validade
     */
    async findByExpirationDateRange(
        usuarioId: string,
        dataInicio: string,
        dataFim: string
    ): Promise<Registra[]> {
        try {
            const registros = await this.findByUserId(usuarioId);

            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);

            return registros.filter(reg => {
                const dataValidade = new Date(reg.dataValidade);
                return dataValidade >= inicio && dataValidade <= fim;
            });
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por período de validade');
        }
    }

    /**
     * Lista registros vencendo
     */
    async findExpiringItems(usuarioId: string, dias: number): Promise<Registra[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.REGISTRA.EXPIRING(usuarioId, dias)
            );
            return data.map(dto => Registra.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens vencendo');
        }
    }

    /**
     * Lista registros vencidos
     */
    async findExpiredItems(usuarioId: string): Promise<Registra[]> {
        try {
            const data = await this.apiClient.get<any[]>(
                ENDPOINTS.REGISTRA.EXPIRED(usuarioId)
            );
            return data.map(dto => Registra.fromDTO(dto));
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens vencidos');
        }
    }

    /**
     * Lista registros frescos
     */
    async findFreshItems(usuarioId: string): Promise<Registra[]> {
        try {
            const allItems = await this.findByUserId(usuarioId);
            return allItems.filter(item => !item.isVencido && !item.isVencendoEmBreve());
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar itens frescos');
        }
    }

    /**
     * Busca por lote
     */
    async findByLote(lote: string): Promise<Registra[]> {
        try {
            const allRegistros = await this.findAll();
            return allRegistros.filter(reg => reg.lote === lote);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar por lote');
        }
    }

    /**
     * Busca com filtros
     */
    async findByFilters(filters: RegistraFilters): Promise<Registra[]> {
        try {
            const allRegistros = filters.usuarioId
                ? await this.findByUserId(filters.usuarioId)
                : await this.findAll();

            return this.filterRegistrosClientSide(allRegistros, filters);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar com filtros');
        }
    }

    /**
     * Cria registro
     */
    async create(registraData: CreateRegistraData): Promise<Registra> {
        try {
            const payload = {
                alimentoId: registraData.alimentoId,
                usuarioId: registraData.usuarioId,
                dataCompra: registraData.dataCompra,
                dataValidade: registraData.dataValidade,
                unidadeMedida: registraData.unidadeMedida,
                quantidade: registraData.quantidade,
                lote: registraData.lote
            };

            const data = await this.apiClient.post(ENDPOINTS.REGISTRA.CREATE, payload);

            // Se retorna apenas mensagem, buscar o criado
            if (data.message && !data.id) {
                const registros = await this.findByUserId(registraData.usuarioId);
                const newRegistro = registros[registros.length - 1];
                return newRegistro;
            }

            return Registra.fromDTO(data);
        } catch (error) {
            throw this.handleError(error, 'Erro ao criar registro');
        }
    }

    /**
     * Atualiza registro
     */
    async update(id: number, registraData: UpdateRegistraData): Promise<Registra> {
        try {
            const payload = {
                ...(registraData.dataCompra && { dataCompra: registraData.dataCompra }),
                ...(registraData.dataValidade && { dataValidade: registraData.dataValidade }),
                ...(registraData.quantidade !== undefined && { quantidade: registraData.quantidade }),
                ...(registraData.unidadeMedida && { unidadeMedida: registraData.unidadeMedida }),
                ...(registraData.lote && { lote: registraData.lote })
            };

            await this.apiClient.put(ENDPOINTS.REGISTRA.UPDATE(id), payload);

            // Buscar atualizado
            const updated = await this.findById(id);
            if (!updated) {
                throw AppError.notFound('Registro não encontrado após atualização');
            }

            return updated;
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Registro não encontrado');
            }
            throw this.handleError(error, 'Erro ao atualizar registro');
        }
    }

    /**
     * Deleta registro
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(ENDPOINTS.REGISTRA.DELETE(id));
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                throw AppError.notFound('Registro não encontrado');
            }
            throw this.handleError(error, 'Erro ao deletar registro');
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
                    console.error(`Erro ao deletar registro ${item.id}:`, error);
                }
            }

            return deleted;
        } catch (error) {
            throw this.handleError(error, 'Erro ao deletar itens vencidos');
        }
    }

    /**
     * Conta registros por usuário
     */
    async countByUserId(usuarioId: string): Promise<number> {
        try {
            const registros = await this.findByUserId(usuarioId);
            return registros.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Conta itens vencidos
     */
    async countExpiredItems(usuarioId: string): Promise<number> {
        try {
            const expired = await this.findExpiredItems(usuarioId);
            return expired.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Conta itens vencendo
     */
    async countExpiringItems(usuarioId: string, dias: number): Promise<number> {
        try {
            const expiring = await this.findExpiringItems(usuarioId, dias);
            return expiring.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Busca última compra de um alimento
     */
    async findLastPurchase(usuarioId: string, alimentoId: number): Promise<Registra | null> {
        try {
            const registros = await this.findByUserId(usuarioId);
            const registrosDoAlimento = registros.filter(reg => reg.alimentoId === alimentoId);

            if (registrosDoAlimento.length === 0) return null;

            // Ordenar por data de compra decrescente
            registrosDoAlimento.sort((a, b) =>
                new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime()
            );

            return registrosDoAlimento[0];
        } catch (error) {
            return null;
        }
    }

    /**
     * Busca compras recentes
     */
    async findRecentPurchases(usuarioId: string, limit: number = 10): Promise<Registra[]> {
        try {
            const registros = await this.findByUserId(usuarioId);

            // Ordenar por data de compra decrescente
            registros.sort((a, b) =>
                new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime()
            );

            return registros.slice(0, limit);
        } catch (error) {
            throw this.handleError(error, 'Erro ao buscar compras recentes');
        }
    }

    /**
     * Obtém estatísticas
     */
    async getStatistics(usuarioId: string): Promise<PurchaseStatistics> {
        try {
            const registros = await this.findByUserId(usuarioId);

            const totalCompras = registros.length;
            const totalItens = registros.reduce((sum, reg) => sum + reg.quantidade, 0);
            const produtosVencidos = registros.filter(r => r.isVencido).length;
            const produtosVencendo = registros.filter(r => r.isVencendoEmBreve() && !r.isVencido).length;
            const produtosFrescos = registros.filter(r => !r.isVencido && !r.isVencendoEmBreve()).length;

            // Categorias mais compradas
            const categoriasMap = new Map<string, number>();
            // Alimentos mais comprados
            const alimentosMap = new Map<string, number>();

            registros.forEach(reg => {
                // Nota: categoria viria do alimento relacionado
                alimentosMap.set(reg.nomeAlimento, (alimentosMap.get(reg.nomeAlimento) || 0) + 1);
            });

            const categoriasMaisCompradas = Array.from(categoriasMap.entries())
                .map(([categoria, quantidade]) => ({ categoria, quantidade }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);

            const alimentosMaisComprados = Array.from(alimentosMap.entries())
                .map(([alimento, quantidade]) => ({ alimento, quantidade }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);

            return {
                totalCompras,
                totalItens,
                produtosVencidos,
                produtosVencendo,
                produtosFrescos,
                categoriasMaisCompradas,
                alimentosMaisComprados
            };
        } catch (error) {
            throw this.handleError(error, 'Erro ao obter estatísticas');
        }
    }

    /**
     * Verifica se registro existe
     */
    async existsById(id: number): Promise<boolean> {
        try {
            const registro = await this.findById(id);
            return registro !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Calcula quantidade total de um alimento
     */
    async calculateTotalQuantity(usuarioId: string, alimentoId: number): Promise<number> {
        try {
            const registros = await this.findByUserId(usuarioId);
            const registrosDoAlimento = registros.filter(reg => reg.alimentoId === alimentoId);

            return registrosDoAlimento.reduce((sum, reg) => sum + reg.quantidade, 0);
        } catch (error) {
            return 0;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Filtra registros client-side
     */
    private filterRegistrosClientSide(
        registros: Registra[],
        filters: RegistraFilters
    ): Registra[] {
        return registros.filter(reg => {
            if (filters.alimentoId && reg.alimentoId !== filters.alimentoId) {
                return false;
            }

            if (filters.dataCompraInicio) {
                const inicio = new Date(filters.dataCompraInicio);
                const compra = new Date(reg.dataCompra);
                if (compra < inicio) return false;
            }

            if (filters.dataCompraFim) {
                const fim = new Date(filters.dataCompraFim);
                const compra = new Date(reg.dataCompra);
                if (compra > fim) return false;
            }

            if (filters.dataValidadeInicio) {
                const inicio = new Date(filters.dataValidadeInicio);
                const validade = new Date(reg.dataValidade);
                if (validade < inicio) return false;
            }

            if (filters.dataValidadeFim) {
                const fim = new Date(filters.dataValidadeFim);
                const validade = new Date(reg.dataValidade);
                if (validade > fim) return false;
            }

            if (filters.lote && reg.lote !== filters.lote) {
                return false;
            }

            return true;
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