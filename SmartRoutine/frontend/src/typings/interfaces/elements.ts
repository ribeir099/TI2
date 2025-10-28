export interface FilterOption {
    value: string;
    label: string;
}

export interface ScrollPosition {
    x: number;
    y: number;
}

export interface ToastOptions {
    title?: string;
    duration?: number;
}

export interface WindowSize {
    width: number;
    height: number;
}

export interface ProfileFormData {
    nome: string;
    email: string;
    dataNascimento: string;
}

export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}