/**
* Utilitários de Navegador
*/

/**
* Detecta tipo de navegador
*/
export function detectBrowser(): {
    name: string;
    version: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
} {
    const ua = navigator.userAgent;

    let browserName = 'Unknown';
    let browserVersion = '';

    // Chrome
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browserName = 'Chrome';
        browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    }
    // Firefox
    else if (ua.includes('Firefox')) {
        browserName = 'Firefox';
        browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    }
    // Safari
    else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browserName = 'Safari';
        browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    }
    // Edge
    else if (ua.includes('Edg')) {
        browserName = 'Edge';
        browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    }

    const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(ua);
    const isTablet = /Tablet|iPad/.test(ua);
    const isDesktop = !isMobile && !isTablet;

    return {
        name: browserName,
        version: browserVersion,
        isMobile,
        isTablet,
        isDesktop
    };
}

/**
* Detecta sistema operacional
*/
export function detectOS(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';

    return 'Unknown';
}

/**
* Verifica se está online
*/
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
* Copia para clipboard
*/
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    } catch (error) {
        return false;
    }
}

/**
* Download de arquivo
*/
export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
    const blob = content instanceof Blob
        ? content
        : new Blob([content], { type: mimeType || 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
* Print página
*/
export function printPage(): void {
    window.print();
}

/**
* Abre em nova aba
*/
export function openInNewTab(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
* Scroll para elemento
*/
export function scrollToElement(
    element: HTMLElement | string,
    behavior: ScrollBehavior = 'smooth'
): void {
    const el = typeof element === 'string'
        ? document.querySelector(element)
        : element;

    if (el) {
        el.scrollIntoView({ behavior, block: 'start' });
    }
}

/**
* Scroll para topo
*/
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: 0, behavior });
}

/**
* Obtém dimensões da viewport
*/
export function getViewportSize(): { width: number; height: number } {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

/**
* Verifica se elemento está visível na viewport
*/
export function isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}

/**
* Obtém preferência de tema do sistema
*/
export function getSystemTheme(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
* Vibrar dispositivo (se suportado)
*/
export function vibrate(pattern: number | number[]): boolean {
    if ('vibrate' in navigator) {
        return navigator.vibrate(pattern);
    }
    return false;
}

/**
* Obtém informações de conexão
*/
export function getConnectionInfo(): {
    isOnline: boolean;
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
} {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
        isOnline: navigator.onLine,
        type: connection?.type,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
    };
}

/**
* Requisita fullscreen
*/
export async function requestFullscreen(element?: HTMLElement): Promise<boolean> {
    const el = element || document.documentElement;

    try {
        if (el.requestFullscreen) {
            await el.requestFullscreen();
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}

/**
* Sai de fullscreen
*/
export async function exitFullscreen(): Promise<boolean> {
    try {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}

/**
* Verifica se está em fullscreen
*/
export function isFullscreen(): boolean {
    return !!document.fullscreenElement;
}
