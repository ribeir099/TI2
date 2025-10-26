/**
* Utilitários de Formatação
* 
* Responsabilidades:
* - Formatar datas
* - Formatar números
* - Formatar moeda
* - Formatar texto
*/

/**
* Formatador de Datas
*/
export class DateFormatter {
    /**
     * Converte para ISO (YYYY-MM-DD)
     */
    static toISO(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Formata para padrão brasileiro (DD/MM/YYYY)
     */
    static toBrazilian(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    }

    /**
     * Formata data e hora (DD/MM/YYYY HH:MM)
     */
    static toDateTime(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Formata data por extenso (1 de janeiro de 2024)
     */
    static toExtensive(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Formata data relativa (há 2 dias, daqui a 3 dias)
     */
    static toRelative(date: Date | string): string {
        const d = new Date(date);
        const now = new Date();
        const diffMs = d.getTime() - now.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Amanhã';
        if (diffDays === -1) return 'Ontem';
        if (diffDays > 0) return `Daqui a ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
        return `Há ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'}`;
    }

    /**
     * Formata tempo relativo detalhado
     */
    static toRelativeDetailed(date: Date | string): string {
        const d = new Date(date);
        const now = new Date();
        const diffMs = Math.abs(d.getTime() - now.getTime());

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        const isFuture = d > now;
        const prefix = isFuture ? 'em' : 'há';
        const suffix = '';

        if (years > 0) {
            return `${prefix} ${years} ${years === 1 ? 'ano' : 'anos'}${suffix}`;
        }
        if (months > 0) {
            return `${prefix} ${months} ${months === 1 ? 'mês' : 'meses'}${suffix}`;
        }
        if (days > 0) {
            return `${prefix} ${days} ${days === 1 ? 'dia' : 'dias'}${suffix}`;
        }
        if (hours > 0) {
            return `${prefix} ${hours} ${hours === 1 ? 'hora' : 'horas'}${suffix}`;
        }
        if (minutes > 0) {
            return `${prefix} ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}${suffix}`;
        }

        return 'agora mesmo';
    }

    /**
     * Calcula dias até/desde uma data
     */
    static daysUntil(date: Date | string): number {
        const target = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Formata duração em minutos para string legível
     */
    static formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (mins === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${mins}min`;
    }

    /**
     * Formata timestamp para data
     */
    static fromTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        return this.toBrazilian(date);
    }
}

/**
* Formatador de Números
*/
export class NumberFormatter {
    /**
     * Formata como moeda brasileira
     */
    static currency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Formata com decimais
     */
    static decimal(value: number, decimals: number = 2): string {
        return value.toFixed(decimals);
    }

    /**
     * Formata como percentual
     */
    static percentage(value: number, decimals: number = 0): string {
        return `${value.toFixed(decimals)}%`;
    }

    /**
     * Formata número grande (1.5K, 2.3M)
     */
    static compact(value: number): string {
        if (value < 1000) return value.toString();
        if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
        if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
        return `${(value / 1000000000).toFixed(1)}B`;
    }

    /**
     * Formata bytes para leitura humana
     */
    static bytes(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
    }

    /**
     * Adiciona separador de milhares
     */
    static withSeparator(value: number): string {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    /**
     * Formata número ordinal (1º, 2º, 3º)
     */
    static ordinal(value: number): string {
        return `${value}º`;
    }
}

/**
* Formatador de Texto
*/
export class TextFormatter {
    /**
     * Capitaliza primeira letra
     */
    static capitalize(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    /**
     * Capitaliza todas as palavras
     */
    static capitalizeWords(text: string): string {
        if (!text) return '';
        return text
            .split(' ')
            .map(word => this.capitalize(word))
            .join(' ');
    }

    /**
     * Trunca texto
     */
    static truncate(text: string, maxLength: number, suffix: string = '...'): string {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Formata nome próprio (mantém preposições minúsculas)
     */
    static formatName(name: string): string {
        if (!name) return '';

        const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e'];

        return name
            .split(' ')
            .map((word, index) => {
                // Primeira e última palavra sempre maiúscula
                if (index === 0 || index === name.split(' ').length - 1) {
                    return this.capitalize(word);
                }
                // Preposições minúsculas
                if (prepositions.includes(word.toLowerCase())) {
                    return word.toLowerCase();
                }
                return this.capitalize(word);
            })
            .join(' ');
    }

    /**
     * Remove acentos
     */
    static removeAccents(text: string): string {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Converte para slug (URL-friendly)
     */
    static toSlug(text: string): string {
        return this.removeAccents(text)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Mascara email
     */
    static maskEmail(email: string): string {
        const [local, domain] = email.split('@');
        if (!domain) return email;

        const visibleChars = Math.min(2, Math.floor(local.length / 3));
        const masked = local.substring(0, visibleChars) + '***';

        return `${masked}@${domain}`;
    }

    /**
     * Mascara telefone
     */
    static maskPhone(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 11) return phone;

        return `(${cleaned.substring(0, 2)}) *****-${cleaned.substring(7)}`;
    }

    /**
     * Formata CPF
     */
    static formatCPF(cpf: string): string {
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return cpf;

        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    /**
     * Pluraliza palavra
     */
    static pluralize(count: number, singular: string, plural: string): string {
        return count === 1 ? singular : plural;
    }
}

/**
* Formatador de Listas
*/
export class ListFormatter {
    /**
     * Formata lista com "e" (item1, item2 e item3)
     */
    static toList(items: string[]): string {
        if (items.length === 0) return '';
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} e ${items[1]}`;

        const lastItem = items[items.length - 1];
        const otherItems = items.slice(0, -1);

        return `${otherItems.join(', ')} e ${lastItem}`;
    }

    /**
     * Formata lista enumerada
     */
    static toEnumerated(items: string[]): string {
        return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    }

    /**
     * Formata lista com bullets
     */
    static toBulletList(items: string[]): string {
        return items.map(item => `• ${item}`).join('\n');
    }
}