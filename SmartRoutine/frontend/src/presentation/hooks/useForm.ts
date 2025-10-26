import { useState, useCallback, FormEvent } from 'react';

/**
* Opções do formulário
*/
export interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit: (values: T) => void | Promise<void>;
}

/**
* Resultado do hook useForm
*/
export interface UseFormResult<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;

    handleChange: (field: keyof T) => (value: any) => void;
    handleBlur: (field: keyof T) => () => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
    setFieldValue: (field: keyof T, value: any) => void;
    setFieldError: (field: keyof T, error: string) => void;
    setFieldTouched: (field: keyof T, touched: boolean) => void;
    resetForm: () => void;
    setValues: (values: Partial<T>) => void;
}

/**
* Hook para gerenciar formulários
*/
export function useForm<T extends Record<string, any>>(
    options: UseFormOptions<T>
): UseFormResult<T> {
    const { initialValues, validate, onSubmit } = options;

    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Verifica se formulário é válido
     */
    const isValid = Object.keys(errors).length === 0;

    /**
     * Verifica se formulário foi modificado
     */
    const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

    /**
     * Handle change de campo
     */
    const handleChange = useCallback((field: keyof T) => (value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));

        // Validar se campo já foi tocado
        if (touched[field] && validate) {
            const validationErrors = validate({ ...values, [field]: value });
            setErrors(validationErrors);
        }
    }, [values, touched, validate]);

    /**
     * Handle blur de campo
     */
    const handleBlur = useCallback((field: keyof T) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Validar ao sair do campo
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    }, [values, validate]);

    /**
     * Handle submit
     */
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        // Marcar todos os campos como tocados
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
        }, {} as Partial<Record<keyof T, boolean>>);
        setTouched(allTouched);

        // Validar
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        // Submit
        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } catch (error) {
            console.error('Erro ao submeter formulário:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate, onSubmit]);

    /**
     * Define valor de campo
     */
    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Define erro de campo
     */
    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors(prev => ({ ...prev, [field]: error }));
    }, []);

    /**
     * Define touched de campo
     */
    const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
        setTouched(prev => ({ ...prev, [field]: isTouched }));
    }, []);

    /**
     * Reseta formulário
     */
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    /**
     * Define múltiplos valores
     */
    const setFormValues = useCallback((newValues: Partial<T>) => {
        setValues(prev => ({ ...prev, ...newValues }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        isDirty,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        resetForm,
        setValues: setFormValues
    };
}