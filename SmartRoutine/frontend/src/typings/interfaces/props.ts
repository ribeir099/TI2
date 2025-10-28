import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { AlertType, Page, ValidationRule } from "../types";
import { FilterOption } from "./elements";
import { Receita, Registra } from "./entities";

export interface AlertMessageProps {
    type: AlertType;
    title?: string;
    message: string;
    onClose?: () => void;
    className?: string;
    dismissible?: boolean;
}

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
    loading?: boolean;
}

export interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    children?: ReactNode;
}

export interface ExpiryBadgeProps {
    daysUntilExpiry?: number;
    compact?: boolean;
    className?: string;
}

export interface FilterSelectProps {
    label?: string;
    placeholder?: string;
    options: FilterOption[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export interface FoodItemCardProps {
    item: Registra;
    onEdit: (item: Registra) => void;
    onDelete: (item: Registra) => void;
    variant?: 'default' | 'compact';
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

export interface RecipeCardProps {
    recipe: Receita;
    isFavorite: boolean;
    onToggleFavorite: (recipeId: number) => void;
    onViewDetails: (recipe: Receita) => void;
    onDelete?: (recipeId: Receita) => void;
    variant?: 'default' | 'featured' | 'compact';
}

export interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
    className?: string;
    defaultValue?: string;
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    iconColor?: string;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    onClick?: () => void;
    className?: string;
}

export interface AppProviderProps {
    children: ReactNode;
}

export interface UseFormProps<T> {
    initialValues: T;
    validationRules?: Partial<Record<keyof T, ValidationRule<any>[]>>;
    onSubmit: (values: T) => void | Promise<void>;
}

export interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
    initialPage?: number;
}

export interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export interface HomeProps {
    onNavigate: (page: Page) => void;
}

export interface LoginProps {
  onNavigate: (page: Page) => void;
}

export interface PantryProps {
    onNavigate: (page: Page) => void;
}

export interface ProfileProps {
    onNavigate: (page: Page) => void;
}

export interface RecipesProps {
    onNavigate: (page: Page) => void;
}

export interface SignupProps {
    onNavigate: (page: Page) => void;
}