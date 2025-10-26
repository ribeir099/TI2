import { FoodItem } from '@/domain/entities/FoodItem';
import { ExpirationStatus, ExpirationStatusVO } from '@/domain/value-objects/ExpirationStatus';
import { FoodCategory } from '@/domain/value-objects/FoodCategory';

/**
* DTO para entrada de criação de alimento
*/
export interface CreateFoodItemInputDTO {
    nome: string;
    quantidade: number;
    unidadeMedida: string;
    dataValidade: string;
    categoria: string;
    dataCompra?: string;
    lote?: string;
    usuarioId: string;
    alimentoId?: number;
}

/**
* DTO para entrada de atualização de alimento
*/
export interface UpdateFoodItemInputDTO {
    nome?: string;
    quantidade?: number;
    unidadeMedida?: string;
    dataValidade?: string;
    categoria?: string;
    dataCompra?: string;
    lote?: string;
}

/**
* DTO para saída de alimento
*/
export interface FoodItemOutputDTO {
    id: number;
    nome: string;
    quantidade: number;
    unidadeMedida: string;
    dataValidade: string;
    categoria: string;
    dataCompra?: string;
    lote?: string;
    usuarioId?: string;
    alimentoId?: number;
    // Campos calculados
    diasAteVencimento: number;
    status: ExpirationStatus;
    statusLabel: string;
    statusVariant: 'destructive' | 'default' | 'secondary';
    descricaoQuantidade: string;
    dataValidadeFormatada: string;
    dataCompraFormatada?: string;
    mensagemValidade: string;
    percentualValidadeRestante: number;
    isVencido: boolean;
    isVencendoEmBreve: boolean;
    isFresco: boolean;
}

/**
* DTO resumido de alimento (para listagens)
*/
export interface FoodItemSummaryDTO {
    id: number;
    nome: string;
    categoria: string;
    descricaoQuantidade: string;
    diasAteVencimento: number;
    status: ExpirationStatus;
    statusLabel: string;
}

/**
* DTO para filtros de busca de alimentos
*/
export interface FoodItemFiltersDTO {
    nome?: string;
    categoria?: string;
    usuarioId?: string;
    statusValidade?: 'vencido' | 'vencendo' | 'fresco' | 'todos';
    diasVencimento?: number;
    dataValidadeInicio?: string;
    dataValidadeFim?: string;
}

/**
* DTO para estatísticas de alimentos
*/
export interface FoodItemStatisticsDTO {
    totalItens: number;
    totalVencidos: number;
    totalVencendo: number;
    totalFrescos: number;
    itensPorCategoria: Array<{
        categoria: string;
        quantidade: number;
        percentual: number;
    }>;
    diasMediaVencimento: number;
    categoriaComMaisItens: string;
    valorEstimadoDesperdicio: number;
}

/**
* DTO para agrupamento por categoria
*/
export interface FoodItemsByCategoryDTO {
    categoria: string;
    categoriaIcon: string;
    categoriaCor: string;
    itens: FoodItemSummaryDTO[];
    totalItens: number;
    itensVencidos: number;
    itensVencendo: number;
}

/**
* DTO para alerta de validade
*/
export interface ExpirationAlertDTO {
    id: number;
    nome: string;
    diasAteVencimento: number;
    dataValidade: string;
    descricaoQuantidade: string;
    categoria: string;
    prioridade: 'alta' | 'media' | 'baixa';
    mensagem: string;
    acaoRecomendada: string;
}

/**
* Mapper/Transformer para FoodItem
*/
export class FoodItemDTOMapper {
    /**
     * Converte FoodItem Entity para FoodItemOutputDTO
     */
    static toOutputDTO(foodItem: FoodItem): FoodItemOutputDTO {
        const statusVO = ExpirationStatusVO.fromDays(foodItem.diasAteVencimento);

        return {
            id: foodItem.id,
            nome: foodItem.nome,
            quantidade: foodItem.quantidade,
            unidadeMedida: foodItem.unidadeMedida,
            dataValidade: foodItem.dataValidade,
            categoria: foodItem.categoria,
            dataCompra: foodItem.dataCompra,
            lote: foodItem.lote,
            usuarioId: foodItem.usuarioId,
            alimentoId: foodItem.alimentoId,
            // Campos calculados
            diasAteVencimento: foodItem.diasAteVencimento,
            status: foodItem.status,
            statusLabel: statusVO.label,
            statusVariant: statusVO.variant,
            descricaoQuantidade: foodItem.descricaoQuantidade,
            dataValidadeFormatada: foodItem.dataValidadeFormatada,
            dataCompraFormatada: foodItem.dataCompraFormatada || undefined,
            mensagemValidade: foodItem.mensagemValidade,
            percentualValidadeRestante: foodItem.percentualValidadeRestante,
            isVencido: foodItem.isVencido(),
            isVencendoEmBreve: foodItem.isVencendoEmBreve(),
            isFresco: foodItem.isFresco()
        };
    }

    /**
     * Converte FoodItem Entity para FoodItemSummaryDTO
     */
    static toSummaryDTO(foodItem: FoodItem): FoodItemSummaryDTO {
        const statusVO = ExpirationStatusVO.fromDays(foodItem.diasAteVencimento);

        return {
            id: foodItem.id,
            nome: foodItem.nome,
            categoria: foodItem.categoria,
            descricaoQuantidade: foodItem.descricaoQuantidade,
            diasAteVencimento: foodItem.diasAteVencimento,
            status: foodItem.status,
            statusLabel: statusVO.label
        };
    }

    /**
     * Converte array de FoodItems para array de FoodItemOutputDTO
     */
    static toOutputDTOList(foodItems: FoodItem[]): FoodItemOutputDTO[] {
        return foodItems.map(item => FoodItemDTOMapper.toOutputDTO(item));
    }

    /**
     * Converte array de FoodItems para array de FoodItemSummaryDTO
     */
    static toSummaryDTOList(foodItems: FoodItem[]): FoodItemSummaryDTO[] {
        return foodItems.map(item => FoodItemDTOMapper.toSummaryDTO(item));
    }

    /**
     * Agrupa alimentos por categoria
     */
    static groupByCategory(foodItems: FoodItem[]): FoodItemsByCategoryDTO[] {
        const grouped = new Map<string, FoodItem[]>();

        foodItems.forEach(item => {
            const items = grouped.get(item.categoria) || [];
            items.push(item);
            grouped.set(item.categoria, items);
        });

        return Array.from(grouped.entries()).map(([categoria, items]) => {
            const categoryVO = FoodCategory.create(categoria);

            return {
                categoria,
                categoriaIcon: categoryVO.icon,
                categoriaCor: categoryVO.color,
                itens: FoodItemDTOMapper.toSummaryDTOList(items),
                totalItens: items.length,
                itensVencidos: items.filter(i => i.isVencido()).length,
                itensVencendo: items.filter(i => i.isVencendoEmBreve()).length
            };
        });
    }

    /**
     * Converte alimentos vencendo para alertas
     */
    static toExpirationAlerts(foodItems: FoodItem[]): ExpirationAlertDTO[] {
        return foodItems
            .filter(item => item.isVencido() || item.isVencendoEmBreve())
            .map(item => {
                const dias = item.diasAteVencimento;
                let prioridade: 'alta' | 'media' | 'baixa';
                let acaoRecomendada: string;

                if (dias < 0) {
                    prioridade = 'alta';
                    acaoRecomendada = 'Descarte imediatamente o produto vencido';
                } else if (dias === 0) {
                    prioridade = 'alta';
                    acaoRecomendada = 'Consuma hoje ou descarte';
                } else if (dias === 1) {
                    prioridade = 'alta';
                    acaoRecomendada = 'Consuma amanhã ou congele';
                } else if (dias <= 3) {
                    prioridade = 'media';
                    acaoRecomendada = 'Planeje consumir nos próximos dias';
                } else {
                    prioridade = 'baixa';
                    acaoRecomendada = 'Monitore a validade';
                }

                return {
                    id: item.id,
                    nome: item.nome,
                    diasAteVencimento: dias,
                    dataValidade: item.dataValidade,
                    descricaoQuantidade: item.descricaoQuantidade,
                    categoria: item.categoria,
                    prioridade,
                    mensagem: item.mensagemValidade,
                    acaoRecomendada
                };
            })
            .sort((a, b) => a.diasAteVencimento - b.diasAteVencimento);
    }

    /**
     * Calcula estatísticas de alimentos
     */
    static calculateStatistics(foodItems: FoodItem[]): FoodItemStatisticsDTO {
        const total = foodItems.length;
        const vencidos = foodItems.filter(i => i.isVencido()).length;
        const vencendo = foodItems.filter(i => i.isVencendoEmBreve() && !i.isVencido()).length;
        const frescos = foodItems.filter(i => i.isFresco()).length;

        // Itens por categoria
        const categorias = new Map<string, number>();
        foodItems.forEach(item => {
            categorias.set(item.categoria, (categorias.get(item.categoria) || 0) + 1);
        });

        const itensPorCategoria = Array.from(categorias.entries())
            .map(([categoria, quantidade]) => ({
                categoria,
                quantidade,
                percentual: Math.round((quantidade / total) * 100)
            }))
            .sort((a, b) => b.quantidade - a.quantidade);

        // Dias média até vencimento
        const somasDias = foodItems
            .filter(i => !i.isVencido())
            .reduce((sum, item) => sum + item.diasAteVencimento, 0);
        const diasMediaVencimento = total > vencidos
            ? Math.round(somasDias / (total - vencidos))
            : 0;

        // Categoria com mais itens
        const categoriaComMaisItens = itensPorCategoria.length > 0
            ? itensPorCategoria[0].categoria
            : 'N/A';

        // Estimativa de desperdício (simplificada)
        const valorEstimadoDesperdicio = vencidos * 15; // R$ 15 por item (média)

        return {
            totalItens: total,
            totalVencidos: vencidos,
            totalVencendo: vencendo,
            totalFrescos: frescos,
            itensPorCategoria,
            diasMediaVencimento,
            categoriaComMaisItens,
            valorEstimadoDesperdicio
        };
    }

    /**
     * Valida CreateFoodItemInputDTO
     */
    static validateCreateInput(dto: CreateFoodItemInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.nome || dto.nome.trim().length === 0) {
            errors.push('Nome do alimento é obrigatório');
        }

        if (!dto.quantidade || dto.quantidade <= 0) {
            errors.push('Quantidade deve ser maior que zero');
        }

        if (!dto.unidadeMedida || dto.unidadeMedida.trim().length === 0) {
            errors.push('Unidade de medida é obrigatória');
        }

        if (!dto.dataValidade) {
            errors.push('Data de validade é obrigatória');
        } else {
            const dataValidade = new Date(dto.dataValidade);
            if (isNaN(dataValidade.getTime())) {
                errors.push('Data de validade inválida');
            }
        }

        if (!dto.categoria || dto.categoria.trim().length === 0) {
            errors.push('Categoria é obrigatória');
        } else if (!FoodCategory.isValid(dto.categoria)) {
            errors.push('Categoria inválida');
        }

        if (!dto.usuarioId || dto.usuarioId.trim().length === 0) {
            errors.push('ID do usuário é obrigatório');
        }

        if (dto.dataCompra) {
            const dataCompra = new Date(dto.dataCompra);
            const dataValidade = new Date(dto.dataValidade);
            if (dataCompra > dataValidade) {
                errors.push('Data de compra não pode ser posterior à data de validade');
            }
        }

        return errors;
    }

    /**
     * Valida UpdateFoodItemInputDTO
     */
    static validateUpdateInput(dto: UpdateFoodItemInputDTO): string[] {
        const errors: string[] = [];

        if (dto.nome !== undefined && dto.nome.trim().length === 0) {
            errors.push('Nome do alimento não pode ser vazio');
        }

        if (dto.quantidade !== undefined && dto.quantidade <= 0) {
            errors.push('Quantidade deve ser maior que zero');
        }

        if (dto.unidadeMedida !== undefined && dto.unidadeMedida.trim().length === 0) {
            errors.push('Unidade de medida não pode ser vazia');
        }

        if (dto.dataValidade !== undefined) {
            const dataValidade = new Date(dto.dataValidade);
            if (isNaN(dataValidade.getTime())) {
                errors.push('Data de validade inválida');
            }
        }

        if (dto.categoria !== undefined) {
            if (dto.categoria.trim().length === 0) {
                errors.push('Categoria não pode ser vazia');
            } else if (!FoodCategory.isValid(dto.categoria)) {
                errors.push('Categoria inválida');
            }
        }

        return errors;
    }
}