import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

/**
* Dados mock
*/
export const MOCK_DATA = {
    users: [
        {
            id: '1',
            nome: 'João Silva',
            email: 'joao@email.com',
            dataNascimento: '1990-01-01'
        }
    ],
    foodItems: [
        {
            id: 1,
            nome: 'Leite',
            quantidade: 1,
            unidadeMedida: 'L',
            dataValidade: '2024-12-30',
            categoria: 'Laticínios',
            diasAteVencimento: 6
        }
    ],
    recipes: [
        {
            id: 1,
            titulo: 'Arroz com Feijão',
            tempoPreparo: 30,
            porcao: '4 porções',
            ingredientes: ['Arroz', 'Feijão', 'Alho', 'Cebola'],
            modoPreparo: ['Cozinhar arroz', 'Cozinhar feijão', 'Misturar']
        }
    ]
};

/**
* Configura mock da API para testes
*/
export const setupApiMock = (client: AxiosInstance): MockAdapter => {
    const mock = new MockAdapter(client, { delayResponse: 500 });

    // Mock de usuários
    mock.onGet('/usuario').reply(200, MOCK_DATA.users);
    mock.onGet(/\/usuario\/\d+/).reply(200, MOCK_DATA.users[0]);
    mock.onPost('/usuario').reply(201, { message: 'Usuário criado' });
    mock.onPost('/usuario/login').reply(200, MOCK_DATA.users[0]);

    // Mock de alimentos
    mock.onGet('/alimento').reply(200, MOCK_DATA.foodItems);
    mock.onGet(/\/alimento\/\d+/).reply(200, MOCK_DATA.foodItems[0]);

    // Mock de receitas
    mock.onGet('/receita').reply(200, MOCK_DATA.recipes);
    mock.onGet(/\/receita\/\d+/).reply(200, MOCK_DATA.recipes[0]);

    // Mock de favoritas
    mock.onGet('/favoritas').reply(200, []);

    // Mock de registra
    mock.onGet(/\/registra\/usuario\/\d+/).reply(200, MOCK_DATA.foodItems);

    // Health check
    mock.onGet('/').reply(200, {
        status: 'ok',
        message: 'Smart Routine API - Running (Mock)'
    });

    return mock;
};

/**
* Desabilita mock
*/
export const disableApiMock = (mock: MockAdapter): void => {
    mock.restore();
};