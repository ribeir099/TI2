import { APP_NAME, APP_URL } from './config';

/**
* Constantes de Metadados (SEO, Open Graph, etc)
*/

/**
* Meta tags por página
*/
export const PAGE_META = {
    HOME: {
        title: `${APP_NAME} - Gerencie sua Despensa e Descubra Receitas`,
        description: 'Organize sua despensa, controle validades e descubra receitas incríveis baseadas nos ingredientes que você tem em casa.',
        keywords: 'despensa, receitas, alimentos, validade, cozinha, organização, smart routine',
        ogImage: `${APP_URL}/og-home.jpg`
    },

    DASHBOARD: {
        title: `Dashboard - ${APP_NAME}`,
        description: 'Visão geral da sua despensa e receitas favoritas',
        keywords: 'dashboard, painel, visão geral'
    },

    PANTRY: {
        title: `Despensa - ${APP_NAME}`,
        description: 'Gerencie os alimentos da sua despensa e acompanhe as validades',
        keywords: 'despensa, alimentos, validade, estoque'
    },

    RECIPES: {
        title: `Receitas - ${APP_NAME}`,
        description: 'Explore receitas baseadas nos ingredientes disponíveis',
        keywords: 'receitas, culinária, cozinha, ingredientes'
    },

    PROFILE: {
        title: `Perfil - ${APP_NAME}`,
        description: 'Gerencie seu perfil e preferências',
        keywords: 'perfil, configurações, preferências'
    }
} as const;

/**
* Open Graph defaults
*/
export const OG_DEFAULTS = {
    type: 'website',
    siteName: APP_NAME,
    locale: 'pt_BR',
    image: `${APP_URL}/og-image.jpg`,
    imageWidth: 1200,
    imageHeight: 630
} as const;

/**
* Twitter Card defaults
*/
export const TWITTER_DEFAULTS = {
    card: 'summary_large_image',
    site: '@smartroutine',
    creator: '@smartroutine'
} as const;

/**
* Schema.org structured data
*/
export const SCHEMA_ORG = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': APP_NAME,
    'url': APP_URL,
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'BRL'
    }
} as const;