/**
* Barrel export de todos os Use Cases de usuário
* 
* Facilita imports:
* import { 
*   GetUserByIdUseCase, 
*   UpdateUserUseCase,
*   DeleteUserUseCase 
* } from '@/application/use-cases/user';
*/

// Busca de usuários
export * from './GetUserByIdUseCase';
export * from './GetUserByEmailUseCase';
export * from './GetAllUsersUseCase';

// Atualização de usuários
export * from './UpdateUserUseCase';
export * from './UpdateUserProfileUseCase';
export * from './UpdateUserPreferencesUseCase';

// Deleção de usuários
export * from './DeleteUserUseCase';
export * from './DeactivateUserAccountUseCase';

// Validações
export * from './ValidateUserDataUseCase';

// Estatísticas e exportação
export * from './GetUserStatisticsUseCase';
export * from './ExportUserDataUseCase';