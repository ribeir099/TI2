import { Theme } from "../types";
import { User, LoginCredentials, SignupData, Alimento, Registra, Notification, Receita, ReceitaFavorita } from "./entities";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<SignupData>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface FoodContextType {
  // Registros (Compras)
  foodItems: Registra[];
  loading: boolean;
  addFoodItem: (item: Omit<Registra, 'id'>) => Promise<void>;
  updateFoodItem: (id: number, item: Partial<Registra>) => Promise<void>;
  deleteFoodItem: (id: number) => Promise<void>;
  refreshFoodItems: () => Promise<void>;

  // Estatísticas
  expiringItems: Registra[];
  expiredItems: Registra[];
  totalItems: number;

  // Alimentos (Catálogo)
  alimentos: Alimento[];
  alimentosLoading: boolean;
  categorias: string[];
  getAlimentosByCategoria: (categoria: string) => Promise<Alimento[]>;
  searchAlimentos: (query: string) => Promise<Alimento[]>;
  addAlimento: (alimento: Omit<Alimento, 'id'>) => Promise<void>;
  refreshAlimentos: () => Promise<void>;
}

export interface NotificationContextType {
    notifications: Notification[];
    showNotification: (notification: Omit<Notification, 'id'>) => void;
    hideNotification: (id: string) => void;
    clearAll: () => void;
}

export interface RecipeContextType {
  recipes: Receita[];
  favorites: ReceitaFavorita[];
  loading: boolean;
  addRecipe: (recipe: Omit<Receita, 'id'>) => Promise<void>;
  updateRecipe: (id: number, recipe: Partial<Receita>) => Promise<void>;
  deleteRecipe: (id: number) => Promise<void>;
  toggleFavorite: (receitaId: number) => Promise<void>;
  isFavorite: (receitaId: number) => boolean;
  refreshRecipes: () => Promise<void>;
  searchRecipes: (query: string) => Promise<Receita[]>;
  getRecipesByTempo: (tempo: number) => Promise<Receita[]>;
  getRecipesByTag: (tag: string) => Promise<Receita[]>;
  getFavoriteRecipes: () => Receita[];
}

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: 'light' | 'dark';
}