/**
* Mensagens da Aplicação
*/

/**
* Mensagens de sucesso
*/
export const SUCCESS_MESSAGES = {
    // Auth
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    SIGNUP_SUCCESS: 'Conta criada com sucesso! Bem-vindo ao SmartRoutine.',
    LOGOUT_SUCCESS: 'Você saiu da sua conta.',
    PASSWORD_CHANGED: 'Senha alterada com sucesso.',

    // User
    PROFILE_UPDATED: 'Perfil atualizado com sucesso.',
    PREFERENCES_SAVED: 'Preferências salvas.',

    // Food
    FOOD_ADDED: 'Alimento adicionado à despensa.',
    FOOD_UPDATED: 'Alimento atualizado com sucesso.',
    FOOD_DELETED: 'Alimento removido da despensa.',
    EXPIRED_ITEMS_DELETED: 'Itens vencidos removidos com sucesso.',

    // Recipe
    RECIPE_CREATED: 'Receita criada com sucesso.',
    RECIPE_UPDATED: 'Receita atualizada com sucesso.',
    RECIPE_DELETED: 'Receita excluída com sucesso.',
    RECIPE_FAVORITED: 'Receita adicionada aos favoritos.',
    RECIPE_UNFAVORITED: 'Receita removida dos favoritos.',

    // Export
    EXPORT_SUCCESS: 'Exportação realizada com sucesso.',
    IMPORT_SUCCESS: 'Importação realizada com sucesso.',
    COPIED_TO_CLIPBOARD: 'Copiado para a área de transferência.',

    // General
    SAVE_SUCCESS: 'Alterações salvas com sucesso.',
    DELETE_SUCCESS: 'Item excluído com sucesso.',
    OPERATION_SUCCESS: 'Operação realizada com sucesso.'
} as const;

/**
* Mensagens de erro
*/
export const ERROR_MESSAGES = {
    // Auth
    INVALID_CREDENTIALS: 'Email ou senha inválidos.',
    EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado.',
    WEAK_PASSWORD: 'Senha muito fraca. Use pelo menos 8 caracteres.',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem.',
    SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',

    // Validation
    REQUIRED_FIELD: 'Este campo é obrigatório.',
    INVALID_EMAIL: 'Email inválido.',
    INVALID_DATE: 'Data inválida.',
    INVALID_NUMBER: 'Número inválido.',
    MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres.`,
    MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres.`,
    MIN_VALUE: (min: number) => `Valor mínimo: ${min}`,
    MAX_VALUE: (max: number) => `Valor máximo: ${max}`,

    // Food
    FOOD_NOT_FOUND: 'Alimento não encontrado.',
    EMPTY_PANTRY: 'Sua despensa está vazia.',
    INVALID_EXPIRATION: 'Data de validade inválida.',

    // Recipe
    RECIPE_NOT_FOUND: 'Receita não encontrada.',
    NO_INGREDIENTS: 'A receita deve ter pelo menos um ingrediente.',
    ALREADY_FAVORITED: 'Esta receita já está nos favoritos.',

    // Network
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    TIMEOUT_ERROR: 'Tempo de requisição esgotado.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',

    // General
    UNEXPECTED_ERROR: 'Ocorreu um erro inesperado.',
    OPERATION_FAILED: 'Operação falhou. Tente novamente.',
    NOT_FOUND: 'Não encontrado.',
    FORBIDDEN: 'Você não tem permissão para esta ação.'
} as const;

/**
* Mensagens de confirmação
*/
export const CONFIRMATION_MESSAGES = {
    DELETE_FOOD: 'Tem certeza que deseja remover este alimento?',
    DELETE_RECIPE: 'Tem certeza que deseja excluir esta receita?',
    DELETE_ACCOUNT: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    CLEAR_PANTRY: 'Tem certeza que deseja limpar toda a despensa?',
    DELETE_EXPIRED: 'Tem certeza que deseja remover todos os itens vencidos?',
    LOGOUT: 'Tem certeza que deseja sair?',
    DISCARD_CHANGES: 'Tem certeza que deseja descartar as alterações?',
    OVERWRITE_DATA: 'Isso irá sobrescrever os dados existentes. Continuar?'
} as const;

/**
* Mensagens de aviso
*/
export const WARNING_MESSAGES = {
    ITEM_EXPIRING_TODAY: 'Este item vence hoje!',
    ITEM_EXPIRING_TOMORROW: 'Este item vence amanhã!',
    ITEM_EXPIRED: 'Este item está vencido.',
    LOW_STORAGE: 'Armazenamento local quase cheio.',
    UNSAVED_CHANGES: 'Você tem alterações não salvas.',
    OFFLINE_MODE: 'Você está offline. Algumas funcionalidades estão limitadas.',
    BETA_FEATURE: 'Esta é uma funcionalidade em beta.',
    PREMIUM_FEATURE: 'Esta funcionalidade requer plano premium.'
} as const;

/**
* Mensagens informativas
*/
export const INFO_MESSAGES = {
    NO_ITEMS: 'Nenhum item encontrado.',
    NO_RESULTS: 'Nenhum resultado encontrado para sua busca.',
    LOADING: 'Carregando...',
    SAVING: 'Salvando...',
    DELETING: 'Excluindo...',
    PROCESSING: 'Processando...',
    SYNCING: 'Sincronizando...',
    UPLOADING: 'Enviando...',
    DOWNLOADING: 'Baixando...',
    EMPTY_LIST: 'A lista está vazia.',
    START_ADDING: 'Comece adicionando alguns itens.',
    FIRST_TIME: 'Parece que é sua primeira vez aqui!'
} as const;

/**
* Placeholders
*/
export const PLACEHOLDERS = {
    SEARCH: 'Buscar...',
    SEARCH_FOOD: 'Buscar alimentos...',
    SEARCH_RECIPE: 'Buscar receitas...',
    EMAIL: 'seu@email.com',
    PASSWORD: '••••••••',
    NAME: 'Seu nome completo',
    FOOD_NAME: 'Ex: Leite, Pão, Maçãs',
    RECIPE_TITLE: 'Ex: Bolo de Chocolate',
    QUANTITY: 'Ex: 1, 500, 2.5',
    SELECT: 'Selecione uma opção',
    DATE: 'dd/mm/yyyy',
    OPTIONAL: '(Opcional)'
} as const;

/**
* Labels
*/
export const LABELS = {
    // Auth
    EMAIL: 'Email',
    PASSWORD: 'Senha',
    CONFIRM_PASSWORD: 'Confirmar Senha',
    NAME: 'Nome',
    BIRTH_DATE: 'Data de Nascimento',
    REMEMBER_ME: 'Lembrar-me',

    // Food
    FOOD_NAME: 'Nome do Alimento',
    QUANTITY: 'Quantidade',
    UNIT: 'Unidade',
    CATEGORY: 'Categoria',
    EXPIRATION_DATE: 'Data de Validade',
    PURCHASE_DATE: 'Data de Compra',
    BATCH: 'Lote',

    // Recipe
    RECIPE_TITLE: 'Título da Receita',
    PREP_TIME: 'Tempo de Preparo',
    SERVINGS: 'Porções',
    DIFFICULTY: 'Dificuldade',
    MEAL_TYPE: 'Tipo de Refeição',
    CALORIES: 'Calorias',
    INGREDIENTS: 'Ingredientes',
    INSTRUCTIONS: 'Modo de Preparo',
    TAGS: 'Tags',
    IMAGE_URL: 'URL da Imagem',

    // General
    SEARCH: 'Buscar',
    FILTER: 'Filtrar',
    SORT: 'Ordenar',
    ACTIONS: 'Ações',
    STATUS: 'Status',
    DATE: 'Data',
    TIME: 'Hora'
} as const;

/**
* Botões
*/
export const BUTTON_LABELS = {
    // Actions
    ADD: 'Adicionar',
    EDIT: 'Editar',
    DELETE: 'Excluir',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    CLOSE: 'Fechar',
    CONFIRM: 'Confirmar',
    SUBMIT: 'Enviar',
    RESET: 'Resetar',
    CLEAR: 'Limpar',

    // Navigation
    BACK: 'Voltar',
    NEXT: 'Próximo',
    PREVIOUS: 'Anterior',
    HOME: 'Início',

    // Auth
    LOGIN: 'Entrar',
    LOGOUT: 'Sair',
    SIGNUP: 'Criar Conta',
    FORGOT_PASSWORD: 'Esqueci a Senha',

    // Operations
    EXPORT: 'Exportar',
    IMPORT: 'Importar',
    DOWNLOAD: 'Baixar',
    UPLOAD: 'Enviar',
    SHARE: 'Compartilhar',
    COPY: 'Copiar',

    // Food
    ADD_FOOD: 'Adicionar Alimento',
    ADD_TO_PANTRY: 'Adicionar à Despensa',

    // Recipe
    ADD_RECIPE: 'Adicionar Receita',
    VIEW_RECIPE: 'Ver Receita',
    FAVORITE: 'Favoritar',
    UNFAVORITE: 'Desfavoritar',
    GENERATE_RECIPE: 'Gerar Receita',

    // Other
    TRY_AGAIN: 'Tentar Novamente',
    LEARN_MORE: 'Saiba Mais',
    VIEW_DETAILS: 'Ver Detalhes',
    SHOW_MORE: 'Mostrar Mais',
    SHOW_LESS: 'Mostrar Menos'
} as const;

/**
* Tooltips
*/
export const TOOLTIPS = {
    EDIT: 'Editar',
    DELETE: 'Excluir',
    FAVORITE: 'Adicionar aos favoritos',
    UNFAVORITE: 'Remover dos favoritos',
    SHARE: 'Compartilhar',
    EXPORT: 'Exportar',
    REFRESH: 'Atualizar',
    SETTINGS: 'Configurações',
    HELP: 'Ajuda',
    NOTIFICATIONS: 'Notificações',
    PROFILE: 'Perfil',
    SEARCH: 'Buscar'
} as const;