export type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'pantry' | 'recipes' | 'profile';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type Theme = 'light' | 'dark' | 'system';

export type ValidationRule<T> = (value: T) => string | null;

export type SetValue<T> = T | ((val: T) => T);

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ViewMode = 'grid' | 'list';

export type SortBy = 'name' | 'date' | 'expiry' | 'quantity';

export type SortOrder = 'asc' | 'desc';

export type RecipeModalStep = 'choice' | 'manual' | 'ai';

export type AIRecipeOption = 'pantry-only' | 'pantry-based' | 'custom' | null;