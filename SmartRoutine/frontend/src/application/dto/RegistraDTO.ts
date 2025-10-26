import { Registra } from '@/domain/entities/Registra';

/**
* DTO para entrada de criação de registro
*/
export interface CreateRegistraInputDTO {
    usuarioId: string;
    alimentoId: number;
    dataCompra: string;
    dataValidade: string;
    quantidade: number;
    unidadeMedida: string;
    lote?: string;
}

/**
* DTO para entrada de atualização de registro
*/
export interface UpdateRegistraInputDTO {
    dataCompra?: string;
    dataValidade?: string;
    quantidade?: number;
    unidadeMedida?: string;
    lote?: string;
}

/**
* DTO para saída de registro
*/
export interface RegistraOutputDTO {
    id: number;
    usuarioId: string;
    alimentoId: number;
    nomeUsuario: string;
    nomeAlimento: string;
    dataCompra: string;
    dataValidade: string;
    quantidade: number;
    unidadeMedida: string;
    lote?: string;
    // Campos calculados
    diasAteVencimento: number;
    diasDesdeCompra: number;
    duracaoValidade: number;
    isVencido: boolean;
    isVencendoEmBreve: boolean;
    descricaoQuantidade: string;
    dataCompraFormatada: string;
    dataValidadeFormatada: string;
    resumo: string;
}

/**
* DTO resumido de registro
*/
export interface RegistraSummaryDTO {
    id: number;
    nomeAlimento: string;
    descricaoQuantidade: string;
    dataValidadeFormatada: string;
    diasAteVencimento: number;
    isVencido: boolean;
}

/**
* DTO para filtros de busca de registros
*/
export interface RegistraFiltersDTO {
    usuarioId?: string;
    alimentoId?: number;
    dataCompraInicio?: string;
    dataCompraFim?: string;
    dataValidadeInicio?: string;
    dataValidadeFim?: string;
    lote?: string;
    statusValidade?: 'vencido' | 'vencendo' | 'fresco' | 'todos';
}

/**
* DTO para histórico de compras
*/
export interface PurchaseHistoryDTO {
    registros: RegistraOutputDTO[];
    totalCompras: number;
    periodoInicio: string;
    periodoFim: string;
    alimentosMaisComprados: Array<{
        alimentoId: number;
        nomeAlimento: string;
        quantidadeCompras: number;
        quantidadeTotal: number;
    }>;
}

/**
* DTO para estatísticas de compras
*/
export interface PurchaseStatisticsDTO {
    totalRegistros: number;
    totalItens: number;
    produtosVencidos: number;
    produtosVencendo: number;
    produtosFrescos: number;
    comprasPorMes: Array<{
        mes: string;
        ano: number;
        quantidade: number;
    }>;
    alimentosMaisComprados: Array<{
        alimento: string;
        quantidade: number;
    }>;
    valorEstimadoDesperdicio: number;
    taxaDesperdicio: number; // Percentual
}

/**
* Mapper/Transformer para Registra
*/
export class RegistraDTOMapper {
    /**
     * Converte Registra Entity para RegistraOutputDTO
     */
    static toOutputDTO(registra: Registra): RegistraOutputDTO {
        return {
            id: registra.id,
            usuarioId: registra.usuarioId,
            alimentoId: registra.alimentoId,
            nomeUsuario: registra.nomeUsuario,
            nomeAlimento: registra.nomeAlimento,
            dataCompra: registra.dataCompra,
            dataValidade: registra.dataValidade,
            quantidade: registra.quantidade,
            unidadeMedida: registra.unidadeMedida,
            lote: registra.lote,
            // Campos calculados
            diasAteVencimento: registra.diasAteVencimento,
            diasDesdeCompra: registra.diasDesdeCompra,
            duracaoValidade: registra.duracaoValidade,
            isVencido: registra.isVencido,
            isVencendoEmBreve: registra.isVencendoEmBreve(),
            descricaoQuantidade: registra.descricaoQuantidade,
            dataCompraFormatada: registra.dataCompraFormatada,
            dataValidadeFormatada: registra.dataValidadeFormatada,
            resumo: registra.resumo
        };
    }

    /**
     * Converte Registra Entity para RegistraSummaryDTO
     */
    static toSummaryDTO(registra: Registra): RegistraSummaryDTO {
        return {
            id: registra.id,
            nomeAlimento: registra.nomeAlimento,
            descricaoQuantidade: registra.descricaoQuantidade,
            dataValidadeFormatada: registra.dataValidadeFormatada,
            diasAteVencimento: registra.diasAteVencimento,
            isVencido: registra.isVencido
        };
    }

    /**
     * Converte array de Registras para array de RegistraOutputDTO
     */
    static toOutputDTOList(registras: Registra[]): RegistraOutputDTO[] {
        return registras.map(registra => RegistraDTOMapper.toOutputDTO(registra));
    }

    /**
     * Converte array de Registras para array de RegistraSummaryDTO
     */
    static toSummaryDTOList(registras: Registra[]): RegistraSummaryDTO[] {
        return registras.map(registra => RegistraDTOMapper.toSummaryDTO(registra));
    }

    /**
     * Cria histórico de compras
     */
    static toPurchaseHistory(
        registras: Registra[],
        dataInicio: string,
        dataFim: string
    ): PurchaseHistoryDTO {
        const alimentosMap = new Map<number, {
            nome: string;
            quantidadeCompras: number;
            quantidadeTotal: number;
        }>();

        registras.forEach(reg => {
            const existing = alimentosMap.get(reg.alimentoId);
            if (existing) {
                existing.quantidadeCompras++;
                existing.quantidadeTotal += reg.quantidade;
            } else {
                alimentosMap.set(reg.alimentoId, {
                    nome: reg.nomeAlimento,
                    quantidadeCompras: 1,
                    quantidadeTotal: reg.quantidade
                });
            }
        });

        const alimentosMaisComprados = Array.from(alimentosMap.entries())
            .map(([alimentoId, data]) => ({
                alimentoId,
                nomeAlimento: data.nome,
                quantidadeCompras: data.quantidadeCompras,
                quantidadeTotal: data.quantidadeTotal
            }))
            .sort((a, b) => b.quantidadeCompras - a.quantidadeCompras)
            .slice(0, 10);

        return {
            registros: RegistraDTOMapper.toOutputDTOList(registras),
            totalCompras: registras.length,
            periodoInicio: dataInicio,
            periodoFim: dataFim,
            alimentosMaisComprados
        };
    }

    /**
     * Calcula estatísticas de compras
     */
    static calculateStatistics(registras: Registra[]): PurchaseStatisticsDTO {
        const total = registras.length;
        const totalItens = registras.reduce((sum, reg) => sum + reg.quantidade, 0);
        const vencidos = registras.filter(r => r.isVencido).length;
        const vencendo = registras.filter(r => r.isVencendoEmBreve() && !r.isVencido).length;
        const frescos = registras.filter(r => !r.isVencido && !r.isVencendoEmBreve()).length;

        // Compras por mês
        const comprasPorMesMap = new Map<string, number>();
        registras.forEach(reg => {
            const data = new Date(reg.dataCompra);
            const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            comprasPorMesMap.set(chave, (comprasPorMesMap.get(chave) || 0) + 1);
        });

        const comprasPorMes = Array.from(comprasPorMesMap.entries())
            .map(([chave, quantidade]) => {
                const [ano, mes] = chave.split('-');
                return {
                    mes: new Date(parseInt(ano), parseInt(mes) - 1).toLocaleDateString('pt-BR', { month: 'long' }),
                    ano: parseInt(ano),
                    quantidade
                };
            })
            .sort((a, b) => {
                if (a.ano !== b.ano) return a.ano - b.ano;
                return new Date(`${a.mes} 1, ${a.ano}`).getMonth() - new Date(`${b.mes} 1, ${b.ano}`).getMonth();
            });

        // Alimentos mais comprados
        const alimentosMap = new Map<string, number>();
        registras.forEach(reg => {
            alimentosMap.set(reg.nomeAlimento, (alimentosMap.get(reg.nomeAlimento) || 0) + 1);
        });

        const alimentosMaisComprados = Array.from(alimentosMap.entries())
            .map(([alimento, quantidade]) => ({ alimento, quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 10);

        // Desperdício
        const valorEstimadoDesperdicio = vencidos * 15; // R$ 15 por item
        const taxaDesperdicio = total > 0 ? Math.round((vencidos / total) * 100) : 0;

        return {
            totalRegistros: total,
            totalItens,
            produtosVencidos: vencidos,
            produtosVencendo: vencendo,
            produtosFrescos: frescos,
            comprasPorMes,
            alimentosMaisComprados,
            valorEstimadoDesperdicio,
            taxaDesperdicio
        };
    }

    /**
     * Valida CreateRegistraInputDTO
     */
    static validateCreateInput(dto: CreateRegistraInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.usuarioId || dto.usuarioId.trim().length === 0) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!dto.alimentoId || dto.alimentoId <= 0) {
            errors.push('ID do alimento é obrigatório');
        }

        if (!dto.dataCompra) {
            errors.push('Data de compra é obrigatória');
        } else {
            const dataCompra = new Date(dto.dataCompra);
            if (isNaN(dataCompra.getTime())) {
                errors.push('Data de compra inválida');
            }
        }

        if (!dto.dataValidade) {
            errors.push('Data de validade é obrigatória');
        } else {
            const dataValidade = new Date(dto.dataValidade);
            if (isNaN(dataValidade.getTime())) {
                errors.push('Data de validade inválida');
            }
        }

        if (dto.dataCompra && dto.dataValidade) {
            const dataCompra = new Date(dto.dataCompra);
            const dataValidade = new Date(dto.dataValidade);
            if (dataCompra > dataValidade) {
                errors.push('Data de compra não pode ser posterior à data de validade');
            }
        }

        if (!dto.quantidade || dto.quantidade <= 0) {
            errors.push('Quantidade deve ser maior que zero');
        }

        if (!dto.unidadeMedida || dto.unidadeMedida.trim().length === 0) {
            errors.push('Unidade de medida é obrigatória');
        }

        return errors;
    }

    /**
     * Valida UpdateRegistraInputDTO
     */
    static validateUpdateInput(dto: UpdateRegistraInputDTO): string[] {
        const errors: string[] = [];

        if (dto.dataCompra !== undefined) {
            const dataCompra = new Date(dto.dataCompra);
            if (isNaN(dataCompra.getTime())) {
                errors.push('Data de compra inválida');
            }
        }

        if (dto.dataValidade !== undefined) {
            const dataValidade = new Date(dto.dataValidade);
            if (isNaN(dataValidade.getTime())) {
                errors.push('Data de validade inválida');
            }
        }

        if (dto.quantidade !== undefined && dto.quantidade <= 0) {
            errors.push('Quantidade deve ser maior que zero');
        }

        if (dto.unidadeMedida !== undefined && dto.unidadeMedida.trim().length === 0) {
            errors.push('Unidade de medida não pode ser vazia');
        }

        return errors;
    }
}