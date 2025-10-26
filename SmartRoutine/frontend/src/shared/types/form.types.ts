/**
* Tipos relacionados a Formulários
*/

/**
* Estado do campo de formulário
*/
export interface FieldState<T = any> {
    value: T;
    error: string | null;
    touched: boolean;
    dirty: boolean;
    valid: boolean;
}

/**
* Erro de validação
*/
export interface ValidationError {
    field: string;
    message: string;
    type?: string;
}

/**
* Resultado de validação
*/
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
* Regra de validação
*/
export interface ValidationRule<T = any> {
    validate: (value: T) => boolean | Promise<boolean>;
    message: string;
}

/**
* Campo de formulário
*/
export interface FormField<T = any> {
    name: string;
    label: string;
    type: InputType;
    value: T;
    placeholder?: string;
    defaultValue?: T;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rules?: ValidationRule<T>[];
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    accept?: string;
    multiple?: boolean;
}

/**
* Tipo de input
*/
export type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'month'
    | 'week'
    | 'color'
    | 'file'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'textarea'
    | 'switch';

/**
* Estado do formulário
*/
export interface FormState<T = any> {
    values: T;
    errors: Record<keyof T, string | null>;
    touched: Record<keyof T, boolean>;
    dirty: boolean;
    valid: boolean;
    submitting: boolean;
    submitted: boolean;
}

/**
* Opções de formulário
*/
export interface FormOptions<T = any> {
    initialValues: T;
    validationSchema?: any;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    onSubmit: (values: T) => void | Promise<void>;
    onError?: (errors: ValidationError[]) => void;
}

/**
* Handlers de formulário
*/
export interface FormHandlers<T = any> {
    handleChange: (field: keyof T, value: any) => void;
    handleBlur: (field: keyof T) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleReset: () => void;
    setFieldValue: (field: keyof T, value: any) => void;
    setFieldError: (field: keyof T, error: string | null) => void;
    setFieldTouched: (field: keyof T, touched: boolean) => void;
    validateField: (field: keyof T) => Promise<boolean>;
    validateForm: () => Promise<boolean>;
}

/**
* Form hook result
*/
export interface UseFormResult<T = any> extends FormState<T>, FormHandlers<T> {
    reset: () => void;
    setValues: (values: Partial<T>) => void;
    setErrors: (errors: Partial<Record<keyof T, string>>) => void;
}

/**
* Opções de select
*/
export interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
    group?: string;
}

/**
* Grupo de opções
*/
export interface OptionGroup<T = string> {
    label: string;
    options: SelectOption<T>[];
}