import axios, { AxiosInstance } from 'axios';
import { IA_CONFIG, IAProvider } from '@/shared/constants/ia.config';
import {
    AIRecipeGenerationOutput,
    AIRecipeAnalysis
} from '@/application/dto/IADTO';
import { AppError } from '@/shared/errors/AppError';
import { IAError } from '@/shared/errors/IAError';

/**
* Request para API de IA
*/
interface IARequest {
    model: string;
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
}

/**
* Response padrão de IA
*/
interface IAResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

/**
* Serviço de Integração com APIs de IA
* 
* Suporta:
* - OpenAI (GPT-4, GPT-3.5)
* - Anthropic (Claude)
* - Google (Gemini)
* - Cohere
* 
* Responsabilidades:
* - Gerar receitas com IA
* - Analisar receitas
* - Sugerir melhorias
* - Sugerir substitutos
*/
export class IAService {
    private client: AxiosInstance;
    private requestCount: number = 0;
    private lastRequestTime: number = 0;
    private readonly MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requisições

    constructor() {
        if (!IA_CONFIG.isConfigured()) {
            throw new Error('IA não configurada. Configure VITE_IA_API_KEY no .env');
        }

        this.client = axios.create({
            timeout: IA_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Gera receita usando IA
     */
    async generateRecipe(
        prompt: string,
        systemPrompt?: string
    ): Promise<AIRecipeGenerationOutput> {
        await this.rateLimit();

        try {
            const request: IARequest = {
                model: IA_CONFIG.MODEL,
                prompt,
                systemPrompt: systemPrompt || this.getDefaultRecipeSystemPrompt(),
                temperature: IA_CONFIG.TEMPERATURE,
                maxTokens: IA_CONFIG.MAX_TOKENS
            };

            const response = await this.callProvider(request);
            return this.parseRecipeResponse(response.content);
        } catch (error) {
            this.handleIAError(error);
            throw error;
        }
    }

    /**
     * Analisa receita
     */
    async analyzeRecipe(
        titulo: string,
        ingredientes: string[],
        modoPreparo: string[]
    ): Promise<AIRecipeAnalysis> {
        await this.rateLimit();

        try {
            const prompt = this.buildAnalysisPrompt(titulo, ingredientes, modoPreparo);

            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt,
                systemPrompt: 'Você é um chef especialista em análise nutricional e culinária.',
                temperature: 0.3,
                maxTokens: 1500
            });

            return this.parseAnalysisResponse(response.content);
        } catch (error) {
            this.handleIAError(error);
            throw error;
        }
    }

    /**
     * Sugere melhorias
     */
    async suggestImprovements(
        titulo: string,
        ingredientes: string[],
        modoPreparo: string[]
    ): Promise<string[]> {
        await this.rateLimit();

        try {
            const prompt = `Analise esta receita e sugira 5 melhorias práticas:

Receita: ${titulo}

Ingredientes:
${ingredientes.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}

Modo de Preparo:
${modoPreparo.map((passo, i) => `${i + 1}. ${passo}`).join('\n')}

Retorne apenas a lista de melhorias, uma por linha, sem numeração.`;

            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt,
                temperature: 0.5,
                maxTokens: 500
            });

            return response.content
                .split('\n')
                .map(line => line.replace(/^\d+\.\s*|-\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 5);
        } catch (error) {
            console.error('Erro ao sugerir melhorias:', error);
            return [];
        }
    }

    /**
     * Sugere substitutos de ingredientes
     */
    async suggestSubstitutes(ingrediente: string): Promise<Array<{
        substituto: string;
        razao: string;
    }>> {
        await this.rateLimit();

        try {
            const prompt = `Liste 3 substitutos práticos para o ingrediente "${ingrediente}".

Formato de resposta (uma por linha):
[substituto] - [razão breve]

Exemplo:
Leite de amêndoas - Alternativa vegana e sem lactose`;

            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt,
                temperature: 0.4,
                maxTokens: 300
            });

            return this.parseSubstitutesResponse(response.content);
        } catch (error) {
            console.error('Erro ao sugerir substitutos:', error);
            return [];
        }
    }

    /**
     * Gera descrição de receita
     */
    async generateDescription(
        titulo: string,
        ingredientes: string[]
    ): Promise<string> {
        await this.rateLimit();

        try {
            const prompt = `Crie uma descrição atraente e apetitosa (máximo 2 frases) para esta receita:

Receita: ${titulo}
Ingredientes principais: ${ingredientes.slice(0, 5).join(', ')}

Retorne apenas a descrição, sem formatação extra.`;

            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt,
                temperature: 0.7,
                maxTokens: 150
            });

            return response.content.trim();
        } catch (error) {
            return `Deliciosa receita de ${titulo} com ingredientes frescos.`;
        }
    }

    /**
     * Sugere nome para receita
     */
    async suggestRecipeName(ingredientes: string[]): Promise<string[]> {
        await this.rateLimit();

        try {
            const prompt = `Sugira 3 nomes criativos para uma receita usando estes ingredientes:
${ingredientes.join(', ')}

Retorne apenas os nomes, um por linha.`;

            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt,
                temperature: 0.8,
                maxTokens: 100
            });

            return response.content
                .split('\n')
                .filter(line => line.trim().length > 0)
                .slice(0, 3);
        } catch (error) {
            return ['Receita Criativa', 'Prato Especial', 'Delícia Caseira'];
        }
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.callProvider({
                model: IA_CONFIG.MODEL,
                prompt: 'Hello',
                maxTokens: 5
            });

            return !!response.content;
        } catch (error) {
            return false;
        }
    }

    /**
     * Estima custo em tokens
     */
    estimateTokens(text: string): number {
        // Estimativa simples: ~4 caracteres por token
        return Math.ceil(text.length / 4);
    }

    /**
     * Obtém contagem de requisições
     */
    getRequestCount(): number {
        return this.requestCount;
    }

    // ==================== MÉTODOS PRIVADOS ====================

    /**
     * Chama provider de IA apropriado
     */
    private async callProvider(request: IARequest): Promise<IAResponse> {
        this.requestCount++;

        switch (IA_CONFIG.PROVIDER) {
            case IAProvider.OPENAI:
                return await this.callOpenAI(request);

            case IAProvider.ANTHROPIC:
                return await this.callAnthropic(request);

            case IAProvider.GOOGLE:
                return await this.callGoogle(request);

            default:
                throw IAError.notConfigured();
        }
    }

    /**
     * Chama OpenAI API
     */
    private async callOpenAI(request: IARequest): Promise<IAResponse> {
        try {
            const response = await this.client.post(
                IA_CONFIG.getEndpoint(),
                {
                    model: request.model,
                    messages: [
                        ...(request.systemPrompt ? [{
                            role: 'system',
                            content: request.systemPrompt
                        }] : []),
                        {
                            role: 'user',
                            content: request.prompt
                        }
                    ],
                    temperature: request.temperature,
                    max_tokens: request.maxTokens,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${IA_CONFIG.API_KEY}`
                    }
                }
            );

            return {
                content: response.data.choices[0].message.content,
                usage: {
                    promptTokens: response.data.usage.prompt_tokens,
                    completionTokens: response.data.usage.completion_tokens,
                    totalTokens: response.data.usage.total_tokens
                }
            };
        } catch (error) {
            throw this.handleProviderError(error, IAProvider.OPENAI);
        }
    }

    /**
     * Chama Anthropic API (Claude)
     */
    private async callAnthropic(request: IARequest): Promise<IAResponse> {
        try {
            const response = await this.client.post(
                IA_CONFIG.getEndpoint(),
                {
                    model: request.model,
                    max_tokens: request.maxTokens,
                    temperature: request.temperature,
                    messages: [
                        {
                            role: 'user',
                            content: request.prompt
                        }
                    ],
                    system: request.systemPrompt
                },
                {
                    headers: {
                        'x-api-key': IA_CONFIG.API_KEY,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            return {
                content: response.data.content[0].text,
                usage: {
                    promptTokens: response.data.usage.input_tokens,
                    completionTokens: response.data.usage.output_tokens,
                    totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens
                }
            };
        } catch (error) {
            throw this.handleProviderError(error, IAProvider.ANTHROPIC);
        }
    }

    /**
     * Chama Google AI (Gemini)
     */
    private async callGoogle(request: IARequest): Promise<IAResponse> {
        try {
            const endpoint = `${IA_CONFIG.getEndpoint()}/${request.model}:generateContent?key=${IA_CONFIG.API_KEY}`;

            const response = await this.client.post(endpoint, {
                contents: [{
                    parts: [{
                        text: request.systemPrompt
                            ? `${request.systemPrompt}\n\n${request.prompt}`
                            : request.prompt
                    }]
                }],
                generationConfig: {
                    temperature: request.temperature,
                    maxOutputTokens: request.maxTokens
                }
            });

            return {
                content: response.data.candidates[0].content.parts[0].text
            };
        } catch (error) {
            throw this.handleProviderError(error, IAProvider.GOOGLE);
        }
    }

    /**
     * Rate limiting simples
     */
    private async rateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
            const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Trata erros do provider
     */
    private handleProviderError(error: any, provider: IAProvider): never {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 401) {
                throw IAError.apiKeyInvalid();
            }

            if (status === 429) {
                throw IAError.rateLimitExceeded();
            }

            if (status === 402 || status === 403) {
                throw IAError.quotaExceeded();
            }
        }

        throw IAError.invalidResponse();
    }

    /**
     * Trata erros genéricos de IA
     */
    private handleIAError(error: any): void {
        if (error instanceof IAError) {
            console.error('Erro de IA:', error.message);
        } else {
            console.error('Erro inesperado na IA:', error);
        }
    }

    /**
     * Parseia resposta de receita
     */
    private parseRecipeResponse(content: string): AIRecipeGenerationOutput {
        try {
            const parsed = JSON.parse(content);
            return this.normalizeRecipeOutput(parsed);
        } catch (error) {
            // Fallback: retornar estrutura mínima
            return {
                titulo: 'Receita Gerada',
                tempoPreparo: 30,
                porcao: '2-4 porções',
                ingredientes: [{ nome: 'Ingrediente 1' }],
                modoPreparo: [{ numero: 1, descricao: 'Preparar conforme instruções' }],
                dificuldade: 'Média',
                tipoRefeicao: 'Almoço/Jantar',
                tags: ['ia-gerada']
            };
        }
    }

    /**
     * Normaliza output de receita
     */
    private normalizeRecipeOutput(data: any): AIRecipeGenerationOutput {
        return {
            titulo: data.titulo || data.title || 'Receita Gerada',
            tempoPreparo: data.tempoPreparo || data.prepTime || 30,
            porcao: data.porcao || data.servings || '2-4 porções',
            ingredientes: this.normalizeIngredients(data.ingredientes || data.ingredients || []),
            modoPreparo: this.normalizeInstructions(data.modoPreparo || data.instructions || data.steps || []),
            dificuldade: data.dificuldade || data.difficulty || 'Média',
            tipoRefeicao: data.tipoRefeicao || data.mealType || 'Almoço/Jantar',
            calorias: data.calorias || data.calories,
            tags: data.tags || [],
            dicas: data.dicas || data.tips,
            variacao: data.variacao || data.variation,
            substitutos: data.substitutos || data.substitutes
        };
    }

    /**
     * Normaliza ingredientes
     */
    private normalizeIngredients(ingredientes: any[]): Array<{
        nome: string;
        quantidade?: string;
        observacao?: string;
    }> {
        return ingredientes.map(ing => {
            if (typeof ing === 'string') {
                return { nome: ing };
            }
            return {
                nome: ing.nome || ing.name || ing,
                quantidade: ing.quantidade || ing.quantity,
                observacao: ing.observacao || ing.note
            };
        });
    }

    /**
     * Normaliza instruções
     */
    private normalizeInstructions(instrucoes: any[]): Array<{
        numero: number;
        descricao: string;
        dica?: string;
    }> {
        return instrucoes.map((passo, index) => {
            if (typeof passo === 'string') {
                return { numero: index + 1, descricao: passo };
            }
            return {
                numero: passo.numero || index + 1,
                descricao: passo.descricao || passo.description || passo,
                dica: passo.dica || passo.tip
            };
        });
    }

    /**
     * Parseia resposta de análise
     */
    private parseAnalysisResponse(content: string): AIRecipeAnalysis {
        try {
            return JSON.parse(content);
        } catch (error) {
            return {
                nivelDificuldade: 'medio',
                tempoEstimado: 30,
                caloriasEstimadas: 400,
                valorNutricional: {
                    proteinas: 0,
                    carboidratos: 0,
                    gorduras: 0
                },
                sugestoesMelhoria: [],
                tagsSugeridas: [],
                ingredientesSubstitutos: []
            };
        }
    }

    /**
     * Parseia substitutos
     */
    private parseSubstitutesResponse(content: string): Array<{
        substituto: string;
        razao: string;
    }> {
        const lines = content
            .split('\n')
            .filter(line => line.trim().length > 0);

        return lines.map(line => {
            const parts = line.split('-').map(p => p.trim());
            return {
                substituto: parts[0]?.replace(/^\d+\.\s*/, '') || '',
                razao: parts[1] || ''
            };
        }).filter(s => s.substituto.length > 0);
    }

    /**
     * Constrói prompt de análise
     */
    private buildAnalysisPrompt(
        titulo: string,
        ingredientes: string[],
        modoPreparo: string[]
    ): string {
        return `Analise esta receita e retorne no formato JSON:

Receita: ${titulo}

Ingredientes:
${ingredientes.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}

Modo de Preparo:
${modoPreparo.map((passo, i) => `${i + 1}. ${passo}`).join('\n')}

Retorne:
{
 "nivelDificuldade": "muito-facil|facil|medio|dificil|muito-dificil",
 "tempoEstimado": 30,
 "caloriasEstimadas": 400,
 "valorNutricional": {
   "proteinas": 25,
   "carboidratos": 45,
   "gorduras": 15
 },
 "sugestoesMelhoria": ["sugestão 1", "sugestão 2"],
 "tagsSugeridas": ["tag1", "tag2"],
 "ingredientesSubstitutos": [
   {
     "original": "ingrediente",
     "substituto": "alternativa",
     "razao": "motivo"
   }
 ]
}`;
    }

    /**
     * System prompt padrão para receitas
     */
    private getDefaultRecipeSystemPrompt(): string {
        return `Você é um chef profissional especializado em criar receitas práticas e deliciosas.

Suas receitas devem:
- Ser claras e fáceis de seguir
- Incluir tempo de preparo realista
- Listar ingredientes com quantidades precisas
- Ter passos detalhados mas concisos
- Incluir dicas úteis quando relevante

Sempre retorne no formato JSON:
{
 "titulo": "Nome da Receita",
 "tempoPreparo": 30,
 "porcao": "4 porções",
 "ingredientes": [
   {
     "nome": "Ingrediente",
     "quantidade": "200g",
     "observacao": "opcional"
   }
 ],
 "modoPreparo": [
   {
     "numero": 1,
     "descricao": "Passo detalhado",
     "dica": "Dica útil"
   }
 ],
 "dificuldade": "Fácil|Média|Difícil",
 "tipoRefeicao": "Café da Manhã|Almoço|Jantar|Lanche",
 "calorias": 350,
 "tags": ["tag1", "tag2"],
 "dicas": ["Dica geral 1"]
}`;
    }
}

// Singleton instance
export const iaService = new IAService();