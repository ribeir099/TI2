/**
* Utility Types Avançados
*/

/**
* Omit multiple keys
*/
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
* Pick multiple keys
*/
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

/**
* Require some fields
*/
export type RequireSome<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
* Optional some fields
*/
export type OptionalSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
* Nullable fields
*/
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
* Non-nullable fields
*/
export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

/**
* Keys of type
*/
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
* Writable (remove readonly)
*/
export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
* Function keys
*/
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
* Non-function keys
*/
export type NonFunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
* Promise type
*/
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

/**
* Array element type
*/
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
* Flatten array type
*/
export type Flatten<T> = T extends any[] ? T[number] : T;

/**
* Stringify (converte todos os campos para string)
*/
export type Stringify<T> = {
    [P in keyof T]: string;
};

/**
* Numberify (converte todos os campos para number)
*/
export type Numberify<T> = {
    [P in keyof T]: number;
};

/**
* Constructor parameters
*/
export type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

/**
* Instance type
*/
export type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : any;

/**
* ReturnType de async function
*/
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any;

/**
* Exact (não permite propriedades extras)
*/
export type Exact<T, Shape> = T extends Shape
    ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
    : never;

/**
* Union to intersection
*/
export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;