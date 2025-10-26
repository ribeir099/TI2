import { IRecipeRepository } from '@/domain/repositories/IRecipeRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { Recipe } from '@/domain/entities/Recipe';
import { AIRecipeSuggestionInputDTO, CreateRecipeInputDTO } from '@/application/dto/RecipeDTO';
import { AppError } from '@/shared/errors/AppError';

/**
* Use Case: Gerar Receita com IA
* 
* Responsabilidade:
* - Gerar receitas baseadas em IA (simulado)
* - Usar ingredientes da despensa
* - Criar receitas personalizadas
* 
* Nota: Implementação atual é simulada. Em produção, 
* integrar com API de IA (OpenAI, Claude, etc)
*/
export class GenerateAIRecipeUseCase {
    constructor(
        private readonly recipeRepository: IRecipeRepository,
        private readonly foodItemRepository: IFoodItemRepository
    ) { }

    /**
     * Gera receita com IA
     * 
     * @param input - Configurações de geração
     * @param usuarioId - ID do usuário
     * @returns Promise<Recipe> - Receita gerada
     * @throws AppError - Se validações falharem
     */
    async execute(input: AIRecipeSuggestionInputDTO, usuarioId: string): Promise<Recipe> {
        try {
            // Validar entrada
            this.validateInput(input, usuarioId);

            // Buscar ingredientes disponíveis
            let ingredientesDisponiveis = input.ingredientesDisponiveis || [];

            if (!ingredientesDisponiveis || ingredientesDisponiveis.length === 0) {
                const foodItems = await this.foodItemRepository.findByUserId(usuarioId);
                ingredientesDisponiveis = foodItems
                    .filter(item => !item.isVencido())
                    .map(item => item.nome);
            }

            // Gerar receita baseada na opção
            const recipeData = await this.generateRecipeByOption(
                input.opcao,
                ingredientesDisponiveis,
                input.promptPersonalizado,
                input.preferencias
            );

            // Criar receita
            const recipe = await this.recipeRepository.create(recipeData);

            return recipe;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Erro no GenerateAIRecipeUseCase:', error);
            throw AppError.internal('Erro ao gerar receita com IA');
        }
    }

    /**
     * Gera múltiplas sugestões de receitas
     * 
     * @param input - Configurações
     * @param usuarioId - ID do usuário
     * @param quantidade - Quantidade de sugestões
     * @returns Promise<Recipe[]> - Receitas geradas
     */
    async executeMultiple(
        input: AIRecipeSuggestionInputDTO,
        usuarioId: string,
        quantidade: number = 3
    ): Promise<Recipe[]> {
        try {
            if (quantidade <= 0 || quantidade > 10) {
                throw AppError.badRequest('Quantidade deve estar entre 1 e 10');
            }

            const recipes: Recipe[] = [];

            for (let i = 0; i < quantidade; i++) {
                try {
                    const recipe = await this.execute(input, usuarioId);
                    recipes.push(recipe);
                } catch (error) {
                    console.error(`Erro ao gerar receita ${i + 1}:`, error);
                }
            }

            return recipes;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao gerar múltiplas receitas');
        }
    }

    /**
     * Gera receita com feedback do usuário
     */
    async executeWithFeedback(
        input: AIRecipeSuggestionInputDTO,
        usuarioId: string,
        feedback?: {
            gostaDeApimentado?: boolean;
            vegetariano?: boolean;
            semGluten?: boolean;
            semLactose?: boolean;
        }
    ): Promise<Recipe> {
        try {
            // Ajustar preferências com base no feedback
            const preferencias = {
                ...input.preferencias,
                restricoes: [
                    ...(input.preferencias?.restricoes || []),
                    ...(feedback?.vegetariano ? ['vegetariano'] : []),
                    ...(feedback?.semGluten ? ['sem glúten'] : []),
                    ...(feedback?.semLactose ? ['sem lactose'] : [])
                ]
            };

            const adjustedInput: AIRecipeSuggestionInputDTO = {
                ...input,
                preferencias
            };

            return await this.execute(adjustedInput, usuarioId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao gerar receita com feedback');
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Valida entrada
     */
    private validateInput(input: AIRecipeSuggestionInputDTO, usuarioId: string): void {
        if (!usuarioId || usuarioId.trim().length === 0) {
            throw AppError.badRequest('ID do usuário é obrigatório');
        }

        if (!input.opcao) {
            throw AppError.badRequest('Opção de geração é obrigatória');
        }

        const opcoesValidas = ['pantry-only', 'pantry-based', 'custom'];
        if (!opcoesValidas.includes(input.opcao)) {
            throw AppError.badRequest('Opção de geração inválida');
        }

        if (input.opcao === 'custom') {
            if (!input.promptPersonalizado || input.promptPersonalizado.trim().length === 0) {
                throw AppError.badRequest('Prompt personalizado é obrigatório para opção custom');
            }

            if (input.promptPersonalizado.length > 500) {
                throw AppError.badRequest('Prompt muito longo (máximo 500 caracteres)');
            }
        }

        // Validar preferências se fornecidas
        if (input.preferencias) {
            if (input.preferencias.tempoMaximo !== undefined) {
                if (input.preferencias.tempoMaximo <= 0) {
                    throw AppError.badRequest('Tempo máximo deve ser maior que zero');
                }
            }
        }
    }

    /**
     * Gera receita baseada na opção escolhida
     * 
     * Nota: Implementação atual é simulada
     * Em produção, fazer chamada para API de IA real
     */
    private async generateRecipeByOption(
        opcao: 'pantry-only' | 'pantry-based' | 'custom',
        ingredientesDisponiveis: string[],
        promptPersonalizado?: string,
        preferencias?: AIRecipeSuggestionInputDTO['preferencias']
    ): Promise<CreateRecipeInputDTO> {
        let titulo = '';
        let ingredientes: string[] = [];
        let modoPreparo: string[] = [];
        let tags: string[] = ['ia-gerada'];

        switch (opcao) {
            case 'pantry-only':
                titulo = 'Receita Criativa com Ingredientes da Despensa';
                ingredientes = ingredientesDisponiveis.slice(0, 5);
                modoPreparo = [
                    'Prepare e higienize todos os ingredientes disponíveis',
                    'Corte os ingredientes em pedaços uniformes',
                    'Refogue os ingredientes aromáticos',
                    'Adicione os demais ingredientes gradualmente',
                    'Tempere a gosto com sal e pimenta',
                    'Cozinhe até os ingredientes ficarem macios',
                    'Sirva quente e aproveite'
                ];
                tags.push('despensa', 'criativa');
                break;

            case 'pantry-based':
                titulo = 'Receita Especial Baseada na sua Despensa';
                ingredientes = [
                    ...ingredientesDisponiveis.slice(0, 4),
                    'Azeite de oliva',
                    'Sal',
                    'Pimenta do reino',
                    'Alho'
                ];
                modoPreparo = [
                    'Separe e prepare todos os ingredientes',
                    'Aqueça o azeite em uma panela',
                    'Refogue o alho até dourar',
                    'Adicione os ingredientes principais',
                    'Tempere com sal e pimenta',
                    'Cozinhe em fogo médio por 15-20 minutos',
                    'Ajuste o tempero e sirva'
                ];
                tags.push('despensa-mix', 'prático');
                break;

            case 'custom':
                titulo = `Receita Personalizada: ${promptPersonalizado?.substring(0, 40) || 'IA'}`;
                ingredientes = [
                    ...ingredientesDisponiveis.slice(0, 3),
                    'Ingrediente sugerido 1',
                    'Ingrediente sugerido 2'
                ];
                modoPreparo = [
                    'Prepare os ingredientes conforme instruções',
                    'Siga o passo a passo da receita gerada',
                    'Ajuste temperos ao seu gosto',
                    'Finalize e sirva conforme preferência'
                ];
                tags.push('personalizada', 'custom');
                break;
        }

        // Aplicar preferências
        let tempoPreparo = 30;
        if (preferencias?.tempoMaximo) {
            tempoPreparo = Math.min(preferencias.tempoMaximo, 60);
        }

        const dificuldade = preferencias?.dificuldadeMaxima || 'Fácil';
        const tipoRefeicao = preferencias?.tipoRefeicao || 'Almoço/Jantar';

        // Adicionar tags de restrições
        if (preferencias?.restricoes) {
            tags.push(...preferencias.restricoes.map(r => r.toLowerCase()));
        }

        return {
            titulo,
            tempoPreparo,
            porcao: '2-4 porções',
            imagem: 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752',
            ingredientes,
            modoPreparo,
            dificuldade,
            tipoRefeicao,
            tags
        };
    }
}