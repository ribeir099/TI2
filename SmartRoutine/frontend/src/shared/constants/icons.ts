/**
* Mapeamento de Ícones (lucide-react)
*/

/**
* Ícones de navegação
*/
export const NAV_ICONS = {
    HOME: 'Home',
    DASHBOARD: 'LayoutDashboard',
    PANTRY: 'Package',
    RECIPES: 'ChefHat',
    FAVORITES: 'Heart',
    PROFILE: 'User',
    SETTINGS: 'Settings',
    NOTIFICATIONS: 'Bell',
    LOGOUT: 'LogOut'
} as const;

/**
* Ícones de ações
*/
export const ACTION_ICONS = {
    ADD: 'Plus',
    EDIT: 'Edit',
    DELETE: 'Trash2',
    SAVE: 'Save',
    CANCEL: 'X',
    SEARCH: 'Search',
    FILTER: 'Filter',
    SORT: 'ArrowUpDown',
    REFRESH: 'RefreshCw',
    DOWNLOAD: 'Download',
    UPLOAD: 'Upload',
    SHARE: 'Share2',
    COPY: 'Copy',
    PRINT: 'Printer',
    EXPORT: 'FileDown',
    IMPORT: 'FileUp'
} as const;

/**
* Ícones de status
*/
export const STATUS_ICONS = {
    SUCCESS: 'CheckCircle',
    ERROR: 'XCircle',
    WARNING: 'AlertTriangle',
    INFO: 'AlertCircle',
    LOADING: 'Loader2',
    PENDING: 'Clock',
    EXPIRED: 'XCircle',
    EXPIRING: 'AlertTriangle',
    FRESH: 'CheckCircle'
} as const;

/**
* Ícones de categorias (alimentos)
*/
export const CATEGORY_ICONS = {
    'Laticínios': 'Milk',
    'Carnes': 'Beef',
    'Vegetais': 'Carrot',
    'Frutas': 'Apple',
    'Padaria': 'Croissant',
    'Grãos': 'Wheat',
    'Condimentos': 'Droplet',
    'Temperos': 'Leaf',
    'Bebidas': 'Coffee',
    'Proteínas': 'Egg',
    'Massas': 'UtensilsCrossed',
    'Outros': 'Package'
} as const;

/**
* Ícones de features
*/
export const FEATURE_ICONS = {
    AI: 'Sparkles',
    CALENDAR: 'Calendar',
    CHART: 'BarChart3',
    LIST: 'List',
    GRID: 'Grid',
    TABLE: 'Table',
    CARD: 'CreditCard',
    IMAGE: 'Image',
    VIDEO: 'Video',
    FILE: 'File',
    FOLDER: 'Folder',
    TAG: 'Tag',
    BOOKMARK: 'Bookmark',
    STAR: 'Star',
    HEART: 'Heart',
    THUMBS_UP: 'ThumbsUp',
    THUMBS_DOWN: 'ThumbsDown'
} as const;

/**
* Ícones de mídia social
*/
export const SOCIAL_ICONS = {
    FACEBOOK: 'Facebook',
    TWITTER: 'Twitter',
    INSTAGRAM: 'Instagram',
    LINKEDIN: 'Linkedin',
    YOUTUBE: 'Youtube',
    GITHUB: 'Github'
} as const;

/**
* Ícones de ajuda
*/
export const HELP_ICONS = {
    HELP: 'HelpCircle',
    INFO: 'Info',
    QUESTION: 'CircleHelp',
    EXTERNAL_LINK: 'ExternalLink',
    LINK: 'Link'
} as const;

/**
* Ícones de conexão
*/
export const CONNECTION_ICONS = {
    ONLINE: 'Wifi',
    OFFLINE: 'WifiOff',
    SYNCING: 'RefreshCw',
    CONNECTED: 'Link',
    DISCONNECTED: 'Unlink'
} as const;

/**
* Ícones diversos
*/
export const MISC_ICONS = {
    CHEVRON_LEFT: 'ChevronLeft',
    CHEVRON_RIGHT: 'ChevronRight',
    CHEVRON_UP: 'ChevronUp',
    CHEVRON_DOWN: 'ChevronDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    MORE_HORIZONTAL: 'MoreHorizontal',
    MORE_VERTICAL: 'MoreVertical',
    MENU: 'Menu',
    CLOSE: 'X',
    CHECK: 'Check',
    MINUS: 'Minus',
    PLUS: 'Plus'
} as const;

/**
* Todos os ícones
*/
export const ICONS = {
    ...NAV_ICONS,
    ...ACTION_ICONS,
    ...STATUS_ICONS,
    ...CATEGORY_ICONS,
    ...FEATURE_ICONS,
    ...SOCIAL_ICONS,
    ...HELP_ICONS,
    ...CONNECTION_ICONS,
    ...MISC_ICONS
} as const;