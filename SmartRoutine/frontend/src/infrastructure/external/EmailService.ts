import axios from 'axios';
import { User } from '@/domain/entities/User';
import { FoodItem } from '@/domain/entities/FoodItem';

/**
* Configuração de email
*/
const EMAIL_CONFIG = {
    API_KEY: import.meta.env.VITE_EMAIL_API_KEY || '',
    FROM_EMAIL: import.meta.env.VITE_FROM_EMAIL || 'noreply@smartroutine.com',
    FROM_NAME: 'SmartRoutine',
    API_URL: import.meta.env.VITE_EMAIL_API_URL || 'https://api.emailprovider.com/send'
};

/**
* Template de email
*/
export interface EmailTemplate {
    subject: string;
    htmlBody: string;
    textBody: string;
}

/**
* Serviço de Email (Simulado)
* 
* Responsabilidades:
* - Enviar emails de notificação
* - Alertas de vencimento
* - Reset de senha
* - Boas-vindas
* 
* Nota: Implementação simulada. Em produção, integrar com:
* - SendGrid
* - AWS SES
* - Mailgun
* - Resend
*/
export class EmailService {
    private isConfigured: boolean;

    constructor() {
        this.isConfigured = !!EMAIL_CONFIG.API_KEY;
    }

    /**
     * Envia email genérico
     */
    async sendEmail(
        to: string,
        subject: string,
        htmlBody: string,
        textBody?: string
    ): Promise<boolean> {
        if (!this.isConfigured) {
            console.warn('Email service não configurado. Email não enviado:', { to, subject });
            return false;
        }

        try {
            // Simulação - em produção fazer chamada real
            console.log('📧 Email enviado:', {
                from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
                to,
                subject,
                preview: htmlBody.substring(0, 100)
            });

            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }

    /**
     * Envia email de boas-vindas
     */
    async sendWelcomeEmail(user: User): Promise<boolean> {
        const template = this.getWelcomeTemplate(user);

        return await this.sendEmail(
            user.email,
            template.subject,
            template.htmlBody,
            template.textBody
        );
    }

    /**
     * Envia alerta de vencimento
     */
    async sendExpirationAlert(user: User, items: FoodItem[]): Promise<boolean> {
        const template = this.getExpirationAlertTemplate(user, items);

        return await this.sendEmail(
            user.email,
            template.subject,
            template.htmlBody,
            template.textBody
        );
    }

    /**
     * Envia email de reset de senha
     */
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
        const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
        const template = this.getPasswordResetTemplate(email, resetUrl);

        return await this.sendEmail(
            email,
            template.subject,
            template.htmlBody,
            template.textBody
        );
    }

    /**
     * Envia resumo semanal
     */
    async sendWeeklySummary(
        user: User,
        summary: {
            totalItems: number;
            expiringItems: number;
            newRecipes: number;
        }
    ): Promise<boolean> {
        const template = this.getWeeklySummaryTemplate(user, summary);

        return await this.sendEmail(
            user.email,
            template.subject,
            template.htmlBody,
            template.textBody
        );
    }

    /**
     * Envia notificação de nova receita
     */
    async sendNewRecipeNotification(user: User, recipeTitle: string): Promise<boolean> {
        const template = this.getNewRecipeTemplate(user, recipeTitle);

        return await this.sendEmail(
            user.email,
            template.subject,
            template.htmlBody,
            template.textBody
        );
    }

    // ==================== TEMPLATES ====================

    /**
     * Template de boas-vindas
     */
    private getWelcomeTemplate(user: User): EmailTemplate {
        return {
            subject: 'Bem-vindo ao SmartRoutine! 🎉',
            htmlBody: `
       <h1>Olá, ${user.primeiroNome}!</h1>
       <p>Bem-vindo ao <strong>SmartRoutine</strong>!</p>
       <p>Estamos felizes em ter você conosco. Aqui você poderá:</p>
       <ul>
         <li>📦 Gerenciar sua despensa</li>
         <li>🍳 Descobrir receitas incríveis</li>
         <li>⏰ Receber alertas de validade</li>
         <li>⭐ Salvar suas receitas favoritas</li>
       </ul>
       <p>Comece agora mesmo adicionando seus primeiros alimentos!</p>
       <p>Equipe SmartRoutine</p>
     `,
            textBody: `Olá, ${user.primeiroNome}!\n\nBem-vindo ao SmartRoutine!\n\nComece agora mesmo gerenciando sua despensa.`
        };
    }

    /**
     * Template de alerta de vencimento
     */
    private getExpirationAlertTemplate(user: User, items: FoodItem[]): EmailTemplate {
        const itemsList = items
            .map(item => `- ${item.nome}: vence em ${item.diasAteVencimento} dia(s)`)
            .join('\n');

        return {
            subject: '⚠️ Alerta: Alimentos vencendo em breve',
            htmlBody: `
       <h1>Olá, ${user.primeiroNome}!</h1>
       <p>Você tem <strong>${items.length}</strong> ${items.length === 1 ? 'alimento' : 'alimentos'} vencendo nos próximos dias:</p>
       <ul>
         ${items.map(item => `
           <li>
             <strong>${item.nome}</strong>: 
             ${item.mensagemValidade}
           </li>
         `).join('')}
       </ul>
       <p>Não esqueça de consumir esses alimentos para evitar desperdício!</p>
       <p>Equipe SmartRoutine</p>
     `,
            textBody: `Olá, ${user.primeiroNome}!\n\nAlimentos vencendo:\n${itemsList}`
        };
    }

    /**
     * Template de reset de senha
     */
    private getPasswordResetTemplate(email: string, resetUrl: string): EmailTemplate {
        return {
            subject: 'Recuperação de Senha - SmartRoutine',
            htmlBody: `
       <h1>Recuperação de Senha</h1>
       <p>Você solicitou a recuperação de senha para a conta: <strong>${email}</strong></p>
       <p>Clique no link abaixo para criar uma nova senha:</p>
       <p>
         <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
           Resetar Senha
         </a>
       </p>
       <p>Este link é válido por 1 hora.</p>
       <p>Se você não solicitou esta recuperação, ignore este email.</p>
       <p>Equipe SmartRoutine</p>
     `,
            textBody: `Recuperação de Senha\n\nAcesse: ${resetUrl}\n\nVálido por 1 hora.`
        };
    }

    /**
     * Template de resumo semanal
     */
    private getWeeklySummaryTemplate(user: User, summary: any): EmailTemplate {
        return {
            subject: '📊 Seu Resumo Semanal - SmartRoutine',
            htmlBody: `
       <h1>Resumo da Semana</h1>
       <p>Olá, ${user.primeiroNome}!</p>
       <p>Aqui está o resumo da sua semana no SmartRoutine:</p>
       <ul>
         <li>📦 Total de itens na despensa: <strong>${summary.totalItems}</strong></li>
         <li>⚠️ Itens vencendo: <strong>${summary.expiringItems}</strong></li>
         <li>🍳 Novas receitas disponíveis: <strong>${summary.newRecipes}</strong></li>
       </ul>
       <p>Continue aproveitando o SmartRoutine!</p>
       <p>Equipe SmartRoutine</p>
     `,
            textBody: `Resumo da Semana\n\nTotal: ${summary.totalItems}\nVencendo: ${summary.expiringItems}\nNovas receitas: ${summary.newRecipes}`
        };
    }

    /**
     * Template de nova receita
     */
    private getNewRecipeTemplate(user: User, recipeTitle: string): EmailTemplate {
        return {
            subject: '🍳 Nova Receita Sugerida para Você!',
            htmlBody: `
       <h1>Nova Receita!</h1>
       <p>Olá, ${user.primeiroNome}!</p>
       <p>Temos uma nova receita que combina com os ingredientes da sua despensa:</p>
       <h2>${recipeTitle}</h2>
       <p>Acesse o SmartRoutine para ver a receita completa!</p>
       <p>Equipe SmartRoutine</p>
     `,
            textBody: `Nova receita: ${recipeTitle}\n\nAcesse o SmartRoutine para ver mais!`
        };
    }

    /**
     * Verifica se email service está configurado
     */
    isEmailServiceConfigured(): boolean {
        return this.isConfigured;
    }
}

// Singleton instance
export const emailService = new EmailService();