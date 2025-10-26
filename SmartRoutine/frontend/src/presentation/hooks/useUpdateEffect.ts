import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
* Hook que executa effect apenas em updates (não no mount)
*/
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        return effect();
    }, deps);
}