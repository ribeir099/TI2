/**
* Unidades de Medida
*/

/**
* Tipos de unidades
*/
export const MEASUREMENT_UNITS = {
    // Massa
    MASS: ['kg', 'g', 'mg', 'lb', 'oz'] as const,

    // Volume
    VOLUME: ['L', 'ml', 'gal', 'fl oz', 'cup', 'tbsp', 'tsp'] as const,

    // Quantidade
    QUANTITY: ['unidade', 'dúzia', 'pacote', 'caixa', 'lata', 'garrafa', 'saco'] as const,

    // Outros
    OTHER: ['fatia', 'pedaço', 'porção'] as const
};

/**
* Todas as unidades
*/
export const ALL_UNITS = [
    ...MEASUREMENT_UNITS.MASS,
    ...MEASUREMENT_UNITS.VOLUME,
    ...MEASUREMENT_UNITS.QUANTITY,
    ...MEASUREMENT_UNITS.OTHER
] as const;

/**
* Tipo de unidade
*/
export type Unit = typeof ALL_UNITS[number];

/**
* Unidades mais comuns (para select)
*/
export const COMMON_UNITS: Unit[] = [
    'kg',
    'g',
    'L',
    'ml',
    'unidade',
    'pacote',
    'caixa'
];

/**
* Labels amigáveis para unidades
*/
export const UNIT_LABELS: Record<string, string> = {
    // Massa
    'kg': 'Quilograma (kg)',
    'g': 'Grama (g)',
    'mg': 'Miligrama (mg)',
    'lb': 'Libra (lb)',
    'oz': 'Onça (oz)',

    // Volume
    'L': 'Litro (L)',
    'ml': 'Mililitro (ml)',
    'gal': 'Galão (gal)',
    'fl oz': 'Onça Fluida (fl oz)',
    'cup': 'Xícara',
    'tbsp': 'Colher de Sopa',
    'tsp': 'Colher de Chá',

    // Quantidade
    'unidade': 'Unidade',
    'dúzia': 'Dúzia',
    'pacote': 'Pacote',
    'caixa': 'Caixa',
    'lata': 'Lata',
    'garrafa': 'Garrafa',
    'saco': 'Saco',

    // Outros
    'fatia': 'Fatia',
    'pedaço': 'Pedaço',
    'porção': 'Porção'
};

/**
* Conversões de unidades
*/
export const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
    // Massa
    'kg': { 'g': 1000, 'mg': 1000000, 'lb': 2.20462, 'oz': 35.274 },
    'g': { 'kg': 0.001, 'mg': 1000, 'oz': 0.035274 },
    'mg': { 'g': 0.001, 'kg': 0.000001 },

    // Volume
    'L': { 'ml': 1000, 'cup': 4.22675, 'gal': 0.264172 },
    'ml': { 'L': 0.001, 'cup': 0.00422675, 'tsp': 0.202884, 'tbsp': 0.067628 },
    'cup': { 'L': 0.236588, 'ml': 236.588, 'tbsp': 16, 'tsp': 48 },
    'tbsp': { 'ml': 14.7868, 'tsp': 3 },
    'tsp': { 'ml': 4.92892, 'tbsp': 0.333333 }
};

/**
* Opções para select de unidades
*/
export const UNIT_OPTIONS = COMMON_UNITS.map(unit => ({
    label: UNIT_LABELS[unit] || unit,
    value: unit
}));

/**
* Agrupa unidades por tipo
*/
export const GROUPED_UNIT_OPTIONS = [
    {
        label: 'Massa',
        options: MEASUREMENT_UNITS.MASS.map(unit => ({
            label: UNIT_LABELS[unit] || unit,
            value: unit
        }))
    },
    {
        label: 'Volume',
        options: MEASUREMENT_UNITS.VOLUME.map(unit => ({
            label: UNIT_LABELS[unit] || unit,
            value: unit
        }))
    },
    {
        label: 'Quantidade',
        options: MEASUREMENT_UNITS.QUANTITY.map(unit => ({
            label: UNIT_LABELS[unit] || unit,
            value: unit
        }))
    }
];

/**
* Helper: Converter unidades
*/
export const convertUnit = (
    value: number,
    fromUnit: string,
    toUnit: string
): number => {
    if (fromUnit === toUnit) return value;

    const conversion = UNIT_CONVERSIONS[fromUnit]?.[toUnit];
    if (!conversion) {
        console.warn(`Conversão de ${fromUnit} para ${toUnit} não disponível`);
        return value;
    }

    return value * conversion;
};