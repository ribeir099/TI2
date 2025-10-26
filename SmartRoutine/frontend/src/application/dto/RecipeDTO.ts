import { Recipe } from '@/domain/entities/Recipe';

/**
* DTO para entrada de criação de receita
*/
export interface CreateRecipeInputDTO {
    titulo: string;
    tempoPreparo: number;
    porcao: string;
    imagem?: string;
    ingredientes: string[];
    modoPreparo: string[];
    dificuldade?: string;
    tipoRefeicao?: string;
    calorias?: number;
    tags?: string[];
}

/**
* DTO para entrada de atualização de receita
*/
export interface UpdateRecipeInputDTO {
    titulo?: string;
    tempoPreparo?: number;
    porcao?: string;
    imagem?: string;
    ingredientes?: string[];
    modoPreparo?: string[];
    dificuldade?: string;
    tipoRefeicao?: string;
    calorias?: number;
    tags?: string[];
}

/**
* DTO para saída de receita
*/
export interface RecipeOutputDTO {
    id: number;
    titulo: string;
    tempoPreparo: number;
    porcao: string;
    imagem: string;
    ingredientes: string[];
    modoPreparo: string[];
    dificuldade?: string;
    tipoRefeicao?: string;
    calorias?: number;
    tags?: string[];
    isFavorita: boolean;
    // Campos calculados
    tempoFormatado: string;
    quantidadeIngredientes: number;
    quantidadePassos: number;
    isRapida: boolean;
    isMedia: boolean;
    isDemorada: boolean;
    classificacaoTempo: 'Rápida' | 'Média' | 'Demorada';
    caloriasFormatadas?: string;
    resumo: string;
}

/**
* DTO resumido de receita (para listagens)
*/
export interface RecipeSummaryDTO {
    id: number;
    titulo: string;
    tempoPreparo: number;
    tempoFormatado: string;
    imagem: string;
    quantidadeIngredientes: number;
    isFavorita: boolean;
    tags?: string[];
    classificacaoTempo: 'Rápida' | 'Média' | 'Demorada';
}

/**
* DTO para card de receita
*/
export interface RecipeCardDTO {
    id: number;
    titulo: string;
    tempoFormatado: string;
    imagem: string;
    porcao: string;
    isFavorita: boolean;
    tags?: string[];
    ingredientesVisiveis: string[]; // Primeiros 3 ingredientes
    totalIngredientes: number;
    calorias?: number;
    dificuldade?: string;
}

/**
* DTO para detalhes completos da receita
*/
export interface RecipeDetailsDTO extends RecipeOutputDTO {
    totalFavoritos?: number;
    ingredientesDisponiveis?: string[];
    ingredientesFaltando?: string[];
    percentualMatch?: number;
    podeFazer?: boolean;
}

/**
* DTO para filtros de busca de receitas
*/
export interface RecipeFiltersDTO {
    titulo?: string;
    tempoPreparoMax?: number;
    tempoPreparoMin?: number;
    dificuldade?: string;
    tipoRefeicao?: string;
    caloriasMax?: number;
    caloriasMin?: number;
    tags?: string[];
    ingredientes?: string[];
    classificacaoTempo?: 'rapida' | 'media' | 'demorada';
    apenasRapidas?: boolean;
    apenasFavoritas?: boolean;
}

/**
* DTO para receita com match de ingredientes
*/
export interface RecipeWithMatchDTO extends RecipeSummaryDTO {
    percentualMatch: number;
    ingredientesDisponiveis: string[];
    ingredientesFaltando: string[];
    podeFazer: boolean;
}

/**
* DTO para estatísticas de receitas
*/
export interface RecipeStatisticsDTO {
    totalReceitas: number;
    receitasFavoritas: number;
    receitasRapidas: number;
    receitasMedias: number;
    receitasDemoradas: number;
    tagsPopulares: Array<{ tag: string; quantidade: number }>;
    dificuldadesDistribuicao: Array<{ dificuldade: string; quantidade: number }>;
    tiposRefeicaoDistribuicao: Array<{ tipo: string; quantidade: number }>;
    tempoMedioPreparo: number;
    caloriaMedia?: number;
}

/**
* DTO para sugestão de receita com IA
*/
export interface AIRecipeSuggestionInputDTO {
    opcao: 'pantry-only' | 'pantry-based' | 'custom';
    ingredientesDisponiveis?: string[];
    promptPersonalizado?: string;
    preferencias?: {
        tempoMaximo?: number;
        dificuldadeMaxima?: string;
        tipoRefeicao?: string;
        restricoes?: string[];
    };
}

/**
* Mapper/Transformer para Recipe
*/
export class RecipeDTOMapper {
    /**
     * Converte Recipe Entity para RecipeOutputDTO
     */
    static toOutputDTO(recipe: Recipe): RecipeOutputDTO {
        return {
            id: recipe.id,
            titulo: recipe.titulo,
            tempoPreparo: recipe.tempoPreparo,
            porcao: recipe.porcao,
            imagem: recipe.imagem,
            ingredientes: recipe.ingredientes,
            modoPreparo: recipe.modoPreparo,
            dificuldade: recipe.dificuldade,
            tipoRefeicao: recipe.tipoRefeicao,
            calorias: recipe.calorias,
            tags: recipe.tags,
            isFavorita: recipe.isFavorita,
            // Campos calculados
            tempoFormatado: recipe.tempoFormatado,
            quantidadeIngredientes: recipe.quantidadeIngredientes,
            quantidadePassos: recipe.quantidadePassos,
            isRapida: recipe.isRapida,
            isMedia: recipe.isMedia,
            isDemorada: recipe.isDemorada,
            classificacaoTempo: recipe.classificacaoTempo,
            caloriasFormatadas: recipe.caloriasFormatadas || undefined,
            resumo: recipe.resumo
        };
    }

    /**
     * Converte Recipe Entity para RecipeSummaryDTO
     */
    static toSummaryDTO(recipe: Recipe): RecipeSummaryDTO {
        return {
            id: recipe.id,
            titulo: recipe.titulo,
            tempoPreparo: recipe.tempoPreparo,
            tempoFormatado: recipe.tempoFormatado,
            imagem: recipe.imagem,
            quantidadeIngredientes: recipe.quantidadeIngredientes,
            isFavorita: recipe.isFavorita,
            tags: recipe.tags,
            classificacaoTempo: recipe.classificacaoTempo
        };
    }

    /**
     * Converte Recipe Entity para RecipeCardDTO
     */
    static toCardDTO(recipe: Recipe): RecipeCardDTO {
        return {
            id: recipe.id,
            titulo: recipe.titulo,
            tempoFormatado: recipe.tempoFormatado,
            imagem: recipe.imagem,
            porcao: recipe.porcao,
            isFavorita: recipe.isFavorita,
            tags: recipe.tags,
            ingredientesVisiveis: recipe.ingredientes.slice(0, 3),
            totalIngredientes: recipe.quantidadeIngredientes,
            calorias: recipe.calorias,
            dificuldade: recipe.dificuldade
        };
    }

    /**
     * Converte Recipe Entity para RecipeDetailsDTO
     */
    static toDetailsDTO(
        recipe: Recipe,
        totalFavoritos?: number,
        ingredientesDisponiveis?: string[]
    ): RecipeDetailsDTO {
        const output = RecipeDTOMapper.toOutputDTO(recipe);

        let percentualMatch: number | undefined;
        let podeFazer: boolean | undefined;
        let disponiveis: string[] | undefined;
        let faltando: string[] | undefined;

        if (ingredientesDisponiveis) {
            percentualMatch = recipe.calcularMatchIngredientes(ingredientesDisponiveis);
            podeFazer = recipe.podeFazerCom(ingredientesDisponiveis);
            disponiveis = recipe.ingredientesDisponiveis(ingredientesDisponiveis);
            faltando = recipe.ingredientesFaltando(ingredientesDisponiveis);
        }

        return {
            ...output,
            totalFavoritos,
            ingredientesDisponiveis: disponiveis,
            ingredientesFaltando: faltando,
            percentualMatch,
            podeFazer
        };
    }

    /**
     * Converte Recipe Entity para RecipeWithMatchDTO
     */
    static toWithMatchDTO(recipe: Recipe, ingredientesDisponiveis: string[]): RecipeWithMatchDTO {
        const summary = RecipeDTOMapper.toSummaryDTO(recipe);

        return {
            ...summary,
            percentualMatch: recipe.calcularMatchIngredientes(ingredientesDisponiveis),
            ingredientesDisponiveis: recipe.ingredientesDisponiveis(ingredientesDisponiveis),
            ingredientesFaltando: recipe.ingredientesFaltando(ingredientesDisponiveis),
            podeFazer: recipe.podeFazerCom(ingredientesDisponiveis)
        };
    }

    /**
     * Converte array de Recipes para array de RecipeOutputDTO
     */
    static toOutputDTOList(recipes: Recipe[]): RecipeOutputDTO[] {
        return recipes.map(recipe => RecipeDTOMapper.toOutputDTO(recipe));
    }

    /**
     * Converte array de Recipes para array de RecipeSummaryDTO
     */
    static toSummaryDTOList(recipes: Recipe[]): RecipeSummaryDTO[] {
        return recipes.map(recipe => RecipeDTOMapper.toSummaryDTO(recipe));
    }

    /**
     * Converte array de Recipes para array de RecipeCardDTO
     */
    static toCardDTOList(recipes: Recipe[]): RecipeCardDTO[] {
        return recipes.map(recipe => RecipeDTOMapper.toCardDTO(recipe));
    }

    /**
     * Calcula estatísticas de receitas
     */
    static calculateStatistics(recipes: Recipe[]): RecipeStatisticsDTO {
        const total = recipes.length;
        const favoritas = recipes.filter(r => r.isFavorita).length;
        const rapidas = recipes.filter(r => r.isRapida).length;
        const medias = recipes.filter(r => r.isMedia).length;
        const demoradas = recipes.filter(r => r.isDemorada).length;

        // Tags populares
        const tagsMap = new Map<string, number>();
        recipes.forEach(recipe => {
            recipe.tags?.forEach(tag => {
                tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
            });
        });
        const tagsPopulares = Array.from(tagsMap.entries())
            .map(([tag, quantidade]) => ({ tag, quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 10);

        // Dificuldades
        const dificuldadesMap = new Map<string, number>();
        recipes.forEach(recipe => {
            if (recipe.dificuldade) {
                dificuldadesMap.set(
                    recipe.dificuldade,
                    (dificuldadesMap.get(recipe.dificuldade) || 0) + 1
                );
            }
        });
        const dificuldadesDistribuicao = Array.from(dificuldadesMap.entries())
            .map(([dificuldade, quantidade]) => ({ dificuldade, quantidade }));

        // Tipos de refeição
        const tiposMap = new Map<string, number>();
        recipes.forEach(recipe => {
            if (recipe.tipoRefeicao) {
                tiposMap.set(
                    recipe.tipoRefeicao,
                    (tiposMap.get(recipe.tipoRefeicao) || 0) + 1
                );
            }
        });
        const tiposRefeicaoDistribuicao = Array.from(tiposMap.entries())
            .map(([tipo, quantidade]) => ({ tipo, quantidade }));

        // Tempo médio
        const somaTempos = recipes.reduce((sum, recipe) => sum + recipe.tempoPreparo, 0);
        const tempoMedioPreparo = total > 0 ? Math.round(somaTempos / total) : 0;

        // Calorias média
        const receitasComCalorias = recipes.filter(r => r.calorias !== undefined);
        const somaCalorias = receitasComCalorias.reduce((sum, r) => sum + (r.calorias || 0), 0);
        const caloriaMedia = receitasComCalorias.length > 0
            ? Math.round(somaCalorias / receitasComCalorias.length)
            : undefined;

        return {
            totalReceitas: total,
            receitasFavoritas: favoritas,
            receitasRapidas: rapidas,
            receitasMedias: medias,
            receitasDemoradas: demoradas,
            tagsPopulares,
            dificuldadesDistribuicao,
            tiposRefeicaoDistribuicao,
            tempoMedioPreparo,
            caloriaMedia
        };
    }

    /**
     * Valida CreateRecipeInputDTO
     */
    static validateCreateInput(dto: CreateRecipeInputDTO): string[] {
        const errors: string[] = [];

        if (!dto.titulo || dto.titulo.trim().length === 0) {
            errors.push('Título da receita é obrigatório');
        }

        if (!dto.tempoPreparo || dto.tempoPreparo <= 0) {
            errors.push('Tempo de preparo deve ser maior que zero');
        }

        if (!dto.porcao || dto.porcao.trim().length === 0) {
            errors.push('Porção é obrigatória');
        }

        if (!dto.ingredientes || dto.ingredientes.length === 0) {
            errors.push('Receita deve ter pelo menos um ingrediente');
        }

        if (!dto.modoPreparo || dto.modoPreparo.length === 0) {
            errors.push('Receita deve ter pelo menos um passo no modo de preparo');
        }

        if (dto.calorias !== undefined && dto.calorias < 0) {
            errors.push('Calorias não podem ser negativas');
        }

        return errors;
    }

    /**
     * Valida UpdateRecipeInputDTO
     */
    static validateUpdateInput(dto: UpdateRecipeInputDTO): string[] {
        const errors: string[] = [];

        if (dto.titulo !== undefined && dto.titulo.trim().length === 0) {
            errors.push('Título não pode ser vazio');
        }

        if (dto.tempoPreparo !== undefined && dto.tempoPreparo <= 0) {
            errors.push('Tempo de preparo deve ser maior que zero');
        }

        if (dto.porcao !== undefined && dto.porcao.trim().length === 0) {
            errors.push('Porção não pode ser vazia');
        }

        if (dto.ingredientes !== undefined && dto.ingredientes.length === 0) {
            errors.push('Receita deve ter pelo menos um ingrediente');
        }

        if (dto.modoPreparo !== undefined && dto.modoPreparo.length === 0) {
            errors.push('Receita deve ter pelo menos um passo no modo de preparo');
        }

        if (dto.calorias !== undefined && dto.calorias < 0) {
            errors.push('Calorias não podem ser negativas');
        }

        return errors;
    }
}