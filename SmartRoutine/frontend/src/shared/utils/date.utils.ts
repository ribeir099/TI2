/**
* Utilitários Específicos de Data
*/

/**
* Adiciona dias a uma data
*/
export function addDays(date: Date | string, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

/**
* Subtrai dias de uma data
*/
export function subtractDays(date: Date | string, days: number): Date {
    return addDays(date, -days);
}

/**
* Adiciona meses
*/
export function addMonths(date: Date | string, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

/**
* Adiciona anos
*/
export function addYears(date: Date | string, years: number): Date {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
}

/**
* Início do dia (00:00:00)
*/
export function startOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
* Fim do dia (23:59:59)
*/
export function endOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

/**
* Início da semana (domingo)
*/
export function startOfWeek(date: Date | string): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

/**
* Fim da semana (sábado)
*/
export function endOfWeek(date: Date | string): Date {
    const start = startOfWeek(date);
    return addDays(start, 6);
}

/**
* Início do mês
*/
export function startOfMonth(date: Date | string): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
* Fim do mês
*/
export function endOfMonth(date: Date | string): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
* Verifica se é hoje
*/
export function isToday(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();

    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

/**
* Verifica se é amanhã
*/
export function isTomorrow(date: Date | string): boolean {
    const d = new Date(date);
    const tomorrow = addDays(new Date(), 1);

    return (
        d.getDate() === tomorrow.getDate() &&
        d.getMonth() === tomorrow.getMonth() &&
        d.getFullYear() === tomorrow.getFullYear()
    );
}

/**
* Verifica se é ontem
*/
export function isYesterday(date: Date | string): boolean {
    const d = new Date(date);
    const yesterday = subtractDays(new Date(), 1);

    return (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
    );
}

/**
* Verifica se está na mesma semana
*/
export function isSameWeek(date1: Date | string, date2: Date | string): boolean {
    const start1 = startOfWeek(date1);
    const start2 = startOfWeek(date2);

    return start1.getTime() === start2.getTime();
}

/**
* Verifica se está no mesmo mês
*/
export function isSameMonth(date1: Date | string, date2: Date | string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
}

/**
* Diferença em dias entre duas datas
*/
export function diffInDays(date1: Date | string, date2: Date | string): number {
    const d1 = startOfDay(date1);
    const d2 = startOfDay(date2);

    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
* Diferença em horas
*/
export function diffInHours(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60));
}

/**
* Diferença em minutos
*/
export function diffInMinutes(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60));
}

/**
* Lista datas entre intervalo
*/
export function getDateRange(startDate: Date | string, endDate: Date | string): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dates;
}

/**
* Obtém nome do dia da semana
*/
export function getDayName(date: Date | string, short: boolean = false): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
        weekday: short ? 'short' : 'long'
    });
}

/**
* Obtém nome do mês
*/
export function getMonthName(date: Date | string, short: boolean = false): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
        month: short ? 'short' : 'long'
    });
}

/**
* Verifica se é fim de semana
*/
export function isWeekend(date: Date | string): boolean {
    const d = new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
}

/**
* Verifica se é dia útil
*/
export function isWeekday(date: Date | string): boolean {
    return !isWeekend(date);
}

/**
* Calcula idade
*/
export function calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
* Próximo aniversário
*/
export function getNextBirthday(birthDate: Date | string): Date {
    const birth = new Date(birthDate);
    const today = new Date();

    const nextBirthday = new Date(
        today.getFullYear(),
        birth.getMonth(),
        birth.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    return nextBirthday;
}

/**
* Dias até próximo aniversário
*/
export function daysUntilBirthday(birthDate: Date | string): number {
    const nextBirthday = getNextBirthday(birthDate);
    return diffInDays(new Date(), nextBirthday);
}