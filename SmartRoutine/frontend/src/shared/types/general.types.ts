/**
* Tipos TypeScript Compartilhados
* 
* Este arquivo centraliza tipos comuns usados em toda a aplicação
*/

/**
* ID types
*/
export type ID = string | number;
export type UserId = string;
export type RecipeId = number;
export type FoodItemId = number;
export type FavoriteId = number;

/**
* Status types
*/
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type NetworkStatus = 'online' | 'offline' | 'slow';

/**
* Pages da aplicação
*/
export type Page =
    | 'home'
    | 'login'
    | 'signup'
    | 'dashboard'
    | 'pantry'
    | 'recipes'
    | 'profile'
    | 'settings'
    | 'about';

/**
* Temas da aplicação
*/
export type Theme = 'light' | 'dark' | 'auto';

/**
* Idiomas suportados
*/
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

/**
* Ordenação
*/
export type SortOrder = 'asc' | 'desc';

/**
* Densidade da interface
*/
export type Density = 'comfortable' | 'compact';

/**
* Tipos de notificação
*/
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
* Tipos de alerta
*/
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
* Variantes de componentes (shadcn/ui)
*/
export type ComponentVariant =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

/**
* Tamanhos de componentes
*/
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

/**
* Posições
*/
export type Position = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'center' | 'end';

/**
* Tipo de arquivo
*/
export type FileType =
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'pdf'
    | 'csv'
    | 'json';

/**
* Tipo de exportação
*/
export type ExportFormat = 'json' | 'csv' | 'xml' | 'pdf' | 'txt';

/**
* Tipo de importação
*/
export type ImportFormat = 'json' | 'csv';

/**
* Nullable types
*/
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

/**
* Mutable type (remove readonly)
*/
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
* DeepPartial type
*/
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
* DeepReadonly type
*/
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
* ValueOf type (valores de objeto)
*/
export type ValueOf<T> = T[keyof T];

/**
* AsyncReturnType (tipo de retorno de async function)
*/
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any;

/**
* Constructor type
*/
export type Constructor<T = any> = new (...args: any[]) => T;

/**
* Function type genérica
*/
export type AnyFunction = (...args: any[]) => any;

/**
* Callback genérico
*/
export type Callback<T = void> = (data: T) => void;

/**
* Event handler genérico
*/
export type EventHandler<T = any> = (event: T) => void;

/**
* Promisify type
*/
export type Promisify<T> = T extends Promise<any> ? T : Promise<T>;

/**
* Required fields (pelo menos um campo obrigatório)
*/
export type AtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

/**
* Exact type (não permite campos extras)
*/
export type Exact<T, Shape> = T extends Shape
    ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
    : never;

/**
* Dictionary type
*/
export type Dictionary<T = any> = Record<string, T>;

/**
* Tuple type helpers
*/
export type Tuple<T, N extends number> = N extends N
    ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
    : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

/**
* Replace type (substitui tipo de propriedade)
*/
export type Replace<T, K extends keyof T, NewType> = Omit<T, K> & {
    [P in K]: NewType;
};

/**
* Merge types
*/
export type Merge<T, U> = Omit<T, keyof U> & U;