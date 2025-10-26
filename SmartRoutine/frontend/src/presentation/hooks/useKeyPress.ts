import { useState, useEffect } from 'react';

/**
* Hook para detectar tecla pressionada
* 
* @param targetKey - Tecla alvo (ex: 'Enter', 'Escape')
*/
export function useKeyPress(targetKey: string): boolean {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) {
                setKeyPressed(true);
            }
        };

        const upHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKey]);

    return keyPressed;
}

/**
* Hook para detectar combinação de teclas
*/
export function useKeyCombo(keys: string[]): boolean {
    const [allPressed, setAllPressed] = useState(false);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            setPressedKeys(prev => new Set(prev).add(key));
        };

        const upHandler = ({ key }: KeyboardEvent) => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    useEffect(() => {
        const allKeysPressed = keys.every(key => pressedKeys.has(key));
        setAllPressed(allKeysPressed);
    }, [pressedKeys, keys]);

    return allPressed;
}

/**
* Atalhos de teclado comuns
*/
export const useEscapeKey = (callback: () => void) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                callback();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [callback]);
};

export const useEnterKey = (callback: () => void) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                callback();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [callback]);
};