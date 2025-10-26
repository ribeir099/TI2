/**
* Coordenadas geográficas
*/
export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
}

/**
* Serviço de Geolocalização
* 
* Responsabilidades:
* - Obter localização do usuário
* - Buscar estabelecimentos próximos (futuro)
* - Sugestões baseadas em localização
*/
export class GeolocationService {
    /**
     * Verifica se geolocalização é suportada
     */
    isSupported(): boolean {
        return 'geolocation' in navigator;
    }

    /**
     * Obtém posição atual
     */
    async getCurrentPosition(): Promise<Coordinates> {
        if (!this.isSupported()) {
            throw new Error('Geolocalização não suportada');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    reject(new Error(this.getErrorMessage(error.code)));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutos
                }
            );
        });
    }

    /**
     * Observa mudanças de posição
     */
    watchPosition(
        onSuccess: (coords: Coordinates) => void,
        onError?: (error: Error) => void
    ): number {
        if (!this.isSupported()) {
            throw new Error('Geolocalização não suportada');
        }

        return navigator.geolocation.watchPosition(
            (position) => {
                onSuccess({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                if (onError) {
                    onError(new Error(this.getErrorMessage(error.code)));
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }

    /**
     * Para de observar posição
     */
    clearWatch(watchId: number): void {
        if (this.isSupported()) {
            navigator.geolocation.clearWatch(watchId);
        }
    }

    /**
     * Calcula distância entre dois pontos (Haversine)
     */
    calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Raio da Terra em km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 100) / 100; // Arredondar para 2 casas
    }

    /**
     * Converte graus para radianos
     */
    private toRad(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    /**
     * Obtém mensagem de erro
     */
    private getErrorMessage(code: number): string {
        switch (code) {
            case 1:
                return 'Permissão de localização negada';
            case 2:
                return 'Localização indisponível';
            case 3:
                return 'Timeout ao obter localização';
            default:
                return 'Erro desconhecido ao obter localização';
        }
    }
}

// Singleton instance
export const geolocationService = new GeolocationService();