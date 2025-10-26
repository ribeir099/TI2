/**
* Tipos relacionados a Eventos
*/

/**
* Tipo de evento
*/
export type EventType =
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'user.login'
    | 'user.logout'
    | 'food.added'
    | 'food.updated'
    | 'food.deleted'
    | 'food.expiring'
    | 'food.expired'
    | 'recipe.created'
    | 'recipe.updated'
    | 'recipe.deleted'
    | 'recipe.favorited'
    | 'recipe.unfavorited'
    | 'favorite.added'
    | 'favorite.removed';

/**
* Evento base
*/
export interface BaseEvent {
    type: EventType;
    timestamp: Date;
    userId?: string;
}

/**
* Evento de usuário
*/
export interface UserEvent extends BaseEvent {
    type: 'user.created' | 'user.updated' | 'user.deleted' | 'user.login' | 'user.logout';
    userId: string;
    data?: any;
}

/**
* Evento de alimento
*/
export interface FoodEvent extends BaseEvent {
    type: 'food.added' | 'food.updated' | 'food.deleted' | 'food.expiring' | 'food.expired';
    foodItemId: number;
    userId: string;
    data?: any;
}

/**
* Evento de receita
*/
export interface RecipeEvent extends BaseEvent {
    type: 'recipe.created' | 'recipe.updated' | 'recipe.deleted' | 'recipe.favorited' | 'recipe.unfavorited';
    recipeId: number;
    userId?: string;
    data?: any;
}

/**
* Evento de favorito
*/
export interface FavoriteEvent extends BaseEvent {
    type: 'favorite.added' | 'favorite.removed';
    favoriteId: number;
    userId: string;
    recipeId: number;
    data?: any;
}

/**
* União de todos os eventos
*/
export type AppEvent = UserEvent | FoodEvent | RecipeEvent | FavoriteEvent;

/**
* Event emitter
*/
export interface EventEmitter {
    on: (event: EventType, handler: (data: any) => void) => void;
    off: (event: EventType, handler: (data: any) => void) => void;
    emit: (event: EventType, data: any) => void;
}

/**
* Event listener
*/
export type EventListener<T = any> = (event: T) => void;

/**
* Event handler
*/
export type EventHandler<T = any> = (event: T) => void | Promise<void>;