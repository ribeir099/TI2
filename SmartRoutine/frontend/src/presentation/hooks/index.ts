/**
* Barrel export de todos os hooks
* 
* Facilita imports:
* import { 
*   useAuth, 
*   useFoodItems,
*   useDebounce 
* } from '@/presentation/hooks';
*/

// Domain hooks (com lógica de negócio)
export * from './useAuth';
export * from './useFoodItems';
export * from './useRecipes';
export * from './useFavorites';
export * from './useNotification';

// Storage hooks
export * from './useLocalStorage';
export * from './useLocalStorageSync';

// Utility hooks
export * from './useDebounce';
export * from './useThrottle';
export * from './usePagination';
export * from './useAsync';
export * from './useFetch';
export * from './useToggle';
export * from './usePrevious';
export * from './useInterval';
export * from './useTimeout';
export * from './useCounter';
export * from './useArray';

// UI hooks
export * from './useOnClickOutside';
export * from './useHover';
export * from './useMediaQuery';
export * from './useScrollPosition';
export * from './useWindowSize';
export * from './useDocumentTitle';
export * from './useDisclosure';
export * from './useIntersectionObserver';

// Browser hooks
export * from './useClipboard';
export * from './useOnline';
export * from './useKeyPress';
export * from './useEventListener';

// Form hooks
export * from './useForm';

// Lifecycle hooks
export * from './useMounted';
export * from './useUpdateEffect';