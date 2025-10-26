import { useState, useEffect } from 'react';

/**
* Hook para detectar status online/offline
*/
export function useOnline(): boolean {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

/**
* Hook com callbacks
*/
export function useOnlineStatus(
    onOnline?: () => void,
    onOffline?: () => void
) {
    const isOnline = useOnline();

    useEffect(() => {
        if (isOnline && onOnline) {
            onOnline();
        } else if (!isOnline && onOffline) {
            onOffline();
        }
    }, [isOnline, onOnline, onOffline]);

    return isOnline;
}