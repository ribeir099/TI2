import { ErrorCode } from '@/shared/types/error.types';
import { HttpStatusCode } from '@/shared/types/api.types';
import { AppError } from './AppError';
import { AuthenticationError } from './AuthenticationError';
import { BusinessError } from './BusinessError';
import { NetworkError } from './NetworkError';
import { ValidationError } from './ValidationError';

/**
* Mensagens de erro centralizadas
* 
* Responsabilidades:
* - Mensagens amigáveis ao usuário
* - Internacionalização futura
* - Consistência de mensagens
*/

/**
* Mensagens por código HTTP
*/
export const HTTP_ERROR_MESSAGES: Record<HttpStatusCode, string> = {
    [HttpStatusCode.OK]: 'Sucesso',
    [HttpStatusCode.CREATED]: 'Criado com sucesso',
    [HttpStatusCode.ACCEPTED]: 'Aceito',
    [HttpStatusCode.NO_CONTENT]: 'Sem conteúdo',
    [HttpStatusCode.BAD_REQUEST]: 'Requisição inválida. Verifique os dados enviados.',
    [HttpStatusCode.UNAUTHORIZED]: 'Não autorizado. Faça login novamente.',
    [HttpStatusCode.FORBIDDEN]: 'Você não tem permissão para acessar este recurso.',
    [HttpStatusCode.NOT_FOUND]: 'Recurso não encontrado.',
    [HttpStatusCode.CONFLICT]: 'Conflito. O recurso já existe.',
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: 'Dados inválidos. Verifique os campos.',
    [HttpStatusCode.TOO_MANY_REQUESTS]: 'Muitas requisições. Aguarde um momento.',
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor. Tente novamente.',
    [HttpStatusCode.BAD_GATEWAY]: 'Servidor indisponível temporariamente.',
    [HttpStatusCode.SERVICE_UNAVAILABLE]: 'Serviço em manutenção. Tente mais tarde.',
    [HttpStatusCode.GATEWAY_TIMEOUT]: 'Tempo de resposta do servidor esgotado.'
};

/**
* Mensagens por código de erro
*/
export const ERROR_CODE_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.INVALID_CREDENTIALS]: 'Email ou senha inválidos.',
    [ErrorCode.UNAUTHORIZED]: 'Você precisa estar logado para acessar este recurso.',
    [ErrorCode.TOKEN_EXPIRED]: 'Sua sessão expirou. Faça login novamente.',
    [ErrorCode.VALIDATION_ERROR]: 'Alguns campos estão inválidos. Verifique os dados.',
    [ErrorCode.INVALID_INPUT]: 'Dados de entrada inválidos.',
    [ErrorCode.NOT_FOUND]: 'O recurso solicitado não foi encontrado.',
    [ErrorCode.ALREADY_EXISTS]: 'Este recurso já existe.',
    [ErrorCode.FORBIDDEN]: 'Você não tem permissão para realizar esta ação.',
    [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissões insuficientes.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Você excedeu o limite de requisições.',
    [ErrorCode.QUOTA_EXCEEDED]: 'Quota de uso excedida.',
    [ErrorCode.INTERNAL_ERROR]: 'Ocorreu um erro interno. Tente novamente.',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Serviço temporariamente indisponível.',
    [ErrorCode.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet.',
    [ErrorCode.TIMEOUT]: 'Tempo de requisição esgotado.',
    [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Esta operação viola uma regra de negócio.',
    [ErrorCode.OPERATION_NOT_ALLOWED]: 'Esta operação não é permitida.'
};

/**
* Mensagens específicas de domínio
*/
export const DOMAIN_ERROR_MESSAGES = {
    // Usuário
    USER: {
        NOT_FOUND: 'Usuário não encontrado.',
        EMAIL_EXISTS: 'Este email já está cadastrado.',
        INVALID_EMAIL: 'Email inválido.',
        WEAK_PASSWORD: 'Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos.',
        PASSWORDS_DONT_MATCH: 'As senhas não coincidem.',
        UNDERAGE: 'Você deve ter pelo menos 13 anos para se cadastrar.',
        INVALID_BIRTH_DATE: 'Data de nascimento inválida.',
        DELETE_OWN_ACCOUNT_ONLY: 'Você só pode deletar sua própria conta.',
        UPDATE_OWN_ACCOUNT_ONLY: 'Você só pode atualizar sua própria conta.'
    },

    // Alimentos
    FOOD: {
        NOT_FOUND: 'Alimento não encontrado.',
        INVALID_QUANTITY: 'Quantidade inválida. Deve ser maior que zero.',
        INVALID_UNIT: 'Unidade de medida inválida.',
        INVALID_CATEGORY: 'Categoria inválida.',
        EXPIRED: 'Este alimento já está vencido.',
        INVALID_EXPIRATION_DATE: 'Data de validade inválida.',
        PURCHASE_AFTER_EXPIRATION: 'Data de compra não pode ser posterior à validade.',
        EMPTY_PANTRY: 'Sua despensa está vazia. Adicione alguns alimentos primeiro.'
    },

    // Receitas
    RECIPE: {
        NOT_FOUND: 'Receita não encontrada.',
        INVALID_TITLE: 'Título da receita inválido.',
        INVALID_TIME: 'Tempo de preparo inválido.',
        NO_INGREDIENTS: 'A receita deve ter pelo menos um ingrediente.',
        NO_INSTRUCTIONS: 'A receita deve ter pelo menos um passo.',
        ALREADY_FAVORITED: 'Esta receita já está nos seus favoritos.',
        NOT_FAVORITED: 'Esta receita não está nos seus favoritos.',
        INSUFFICIENT_INGREDIENTS: 'Você não tem ingredientes suficientes para esta receita.',
        GENERATION_FAILED: 'Falha ao gerar receita com IA. Tente novamente.'
    },

    // Favoritos
    FAVORITE: {
        NOT_FOUND: 'Favorito não encontrado.',
        ALREADY_EXISTS: 'Esta receita já está nos favoritos.',
        LIMIT_REACHED: 'Você atingiu o limite de receitas favoritas.',
        CANNOT_FAVORITE_OWN: 'Você não pode favoritar suas próprias receitas.'
    },

    // Geral
    GENERAL: {
        UNEXPECTED_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
        MAINTENANCE: 'Sistema em manutenção. Tente novamente em alguns minutos.',
        NO_INTERNET: 'Sem conexão com a internet.',
        TIMEOUT: 'Operação demorou muito. Tente novamente.',
        INVALID_DATA: 'Dados inválidos.',
        OPERATION_FAILED: 'Operação falhou. Tente novamente.',
        NOT_IMPLEMENTED: 'Funcionalidade ainda não implementada.'
    }
};

/**
* Títulos de erro (para exibição)
*/
export const ERROR_TITLES: Record<string, string> = {
    validation: 'Erro de Validação',
    authentication: 'Erro de Autenticação',
    authorization: 'Erro de Autorização',
    notFound: 'Não Encontrado',
    conflict: 'Conflito',
    network: 'Erro de Conexão',
    server: 'Erro no Servidor',
    business: 'Erro de Operação',
    unknown: 'Erro Desconhecido'
};

/**
* Obtém mensagem amigável por status code
*/
export function getMessageByStatusCode(statusCode: number): string {
    return (
        HTTP_ERROR_MESSAGES[statusCode as HttpStatusCode] ||
        'Ocorreu um erro. Tente novamente.'
    );
}

/**
* Obtém mensagem amigável por error code
*/
export function getMessageByErrorCode(code: ErrorCode): string {
    return (
        ERROR_CODE_MESSAGES[code] ||
        'Ocorreu um erro. Tente novamente.'
    );
}

/**
* Obtém título do erro
*/
export function getErrorTitle(error: Error | AppError): string {
    if (error instanceof ValidationError) {
        return ERROR_TITLES.validation;
    }

    if (error instanceof AuthenticationError) {
        return ERROR_TITLES.authentication;
    }

    if (error instanceof BusinessError) {
        return ERROR_TITLES.business;
    }

    if (error instanceof NetworkError) {
        return ERROR_TITLES.network;
    }

    if (error instanceof AppError) {
        if (error.statusCode === 404) return ERROR_TITLES.notFound;
        if (error.statusCode === 409) return ERROR_TITLES.conflict;
        if (error.statusCode >= 500) return ERROR_TITLES.server;
    }

    return ERROR_TITLES.unknown;
}

/**
* Obtém ícone do erro (lucide-react)
*/
export function getErrorIcon(error: Error | AppError): string {
    if (error instanceof ValidationError) return 'AlertCircle';
    if (error instanceof AuthenticationError) return 'Lock';
    if (error instanceof BusinessError) return 'AlertTriangle';
    if (error instanceof NetworkError) return 'WifiOff';
    if (error instanceof AppError) {
        if (error.statusCode === 404) return 'SearchX';
        if (error.statusCode >= 500) return 'ServerCrash';
    }
    return 'XCircle';
}

/**
* Obtém cor do erro
*/
export function getErrorColor(error: Error | AppError): string {
    if (error instanceof ValidationError) return '#f59e0b'; // amber
    if (error instanceof AuthenticationError) return '#ef4444'; // red
    if (error instanceof BusinessError) return '#f59e0b'; // amber
    if (error instanceof NetworkError) return '#6366f1'; // indigo
    return '#ef4444'; // red
}