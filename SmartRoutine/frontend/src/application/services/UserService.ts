import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IFoodItemRepository } from '@/domain/repositories/IFoodItemRepository';
import { IReceitaFavoritaRepository } from '@/domain/repositories/IReceitaFavoritaRepository';
import { User } from '@/domain/entities/User';
import { UserOutputDTO, UpdateUserInputDTO, UserDTOMapper } from '@/application/dto/UserDTO';

// Use Cases
import { 
 GetUserByIdUseCase,
 GetUserByEmailUseCase,
 GetAllUsersUseCase,
 UpdateUserUseCase,
 UpdateUserProfileUseCase,
 UpdateUserPreferencesUseCase,
 DeleteUserUseCase,
 ValidateUserDataUseCase,
 GetUserStatisticsUseCase,
 ExportUserDataUseCase,
 UserPreferences,
 ExportFormat
} from '@/application/use-cases/user';

import { AppError } from '@/shared/errors/AppError';

/**
* Serviço de Usuários (Atualizado)
* 
* Orquestra os Use Cases de usuário
*/
export class UserService {
 // Use Cases
 private getUserByIdUseCase: GetUserByIdUseCase;
 private getUserByEmailUseCase: GetUserByEmailUseCase;
 private getAllUsersUseCase: GetAllUsersUseCase;
 private updateUserUseCase: UpdateUserUseCase;
 private updateUserProfileUseCase: UpdateUserProfileUseCase;
 private updateUserPreferencesUseCase: UpdateUserPreferencesUseCase;
 private deleteUserUseCase: DeleteUserUseCase;
 private validateUserDataUseCase: ValidateUserDataUseCase;
 private getUserStatisticsUseCase: GetUserStatisticsUseCase;
 private exportUserDataUseCase: ExportUserDataUseCase;

 constructor(
   private readonly userRepository: IUserRepository,
   private readonly foodItemRepository?: IFoodItemRepository,
   private readonly favoritaRepository?: IReceitaFavoritaRepository
 ) {
   // Inicializar Use Cases
   this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
   this.getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
   this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
   this.updateUserUseCase = new UpdateUserUseCase(userRepository);
   this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
   this.updateUserPreferencesUseCase = new UpdateUserPreferencesUseCase();
   this.deleteUserUseCase = new DeleteUserUseCase(
     userRepository,
     foodItemRepository,
     favoritaRepository
   );
   this.validateUserDataUseCase = new ValidateUserDataUseCase(userRepository);
   this.getUserStatisticsUseCase = new GetUserStatisticsUseCase(
     userRepository,
     foodItemRepository,
     favoritaRepository
   );
   this.exportUserDataUseCase = new ExportUserDataUseCase(
     userRepository,
     foodItemRepository,
     favoritaRepository
   );
 }

 // ==================== BUSCA ====================

 async getUserById(id: string): Promise<UserOutputDTO> {
   const user = await this.getUserByIdUseCase.execute(id);
   return UserDTOMapper.toOutputDTO(user);
 }

 async getUserByEmail(email: string): Promise<UserOutputDTO | null> {
   const user = await this.getUserByEmailUseCase.executeOrNull(email);
   return user ? UserDTOMapper.toOutputDTO(user) : null;
 }

 async getAllUsers(): Promise<UserOutputDTO[]> {
   const users = await this.getAllUsersUseCase.execute();
   return UserDTOMapper.toOutputDTOList(users);
 }

 async userExists(id: string): Promise<boolean> {
   return await this.getUserByIdUseCase.exists(id);
 }

 async emailExists(email: string): Promise<boolean> {
   return await this.getUserByEmailUseCase.emailExists(email);
 }

 // ==================== ATUALIZAÇÃO ====================

 async updateUser(id: string, input: UpdateUserInputDTO): Promise<UserOutputDTO> {
   const user = await this.updateUserUseCase.execute(id, input);
   return UserDTOMapper.toOutputDTO(user);
 }

 async updateName(id: string, nome: string): Promise<UserOutputDTO> {
   const user = await this.updateUserUseCase.updateName(id, nome);
   return UserDTOMapper.toOutputDTO(user);
 }

 async updateEmail(id: string, email: string): Promise<UserOutputDTO> {
   const user = await this.updateUserUseCase.updateEmail(id, email);
   return UserDTOMapper.toOutputDTO(user);
 }

 async updateProfile(userId: string, input: any): Promise<UserOutputDTO> {
   const user = await this.updateUserProfileUseCase.execute(userId, input);
   return UserDTOMapper.toOutputDTO(user);
 }

 // ==================== PREFERÊNCIAS ====================

 async updatePreferences(userId: string, preferences: Partial<UserPreferences>) {
   return await this.updateUserPreferencesUseCase.execute(userId, preferences);
 }

 getPreferences(userId: string) {
   return this.updateUserPreferencesUseCase.getPreferences(userId);
 }

 async resetPreferences(userId: string) {
   return await this.updateUserPreferencesUseCase.resetToDefault(userId);
 }

 async updateTheme(userId: string, tema: 'light' | 'dark' | 'auto') {
   return await this.updateUserPreferencesUseCase.updateTheme(userId, tema);
 }

 // ==================== DELEÇÃO ====================

 async deleteUser(id: string, requestingUserId: string) {
   return await this.deleteUserUseCase.execute(id, requestingUserId);
 }

 async deleteUserWithResult(id: string, requestingUserId: string) {
   return await this.deleteUserUseCase.executeWithResult(id, requestingUserId);
 }

 async previewDelete(id: string) {
   return await this.deleteUserUseCase.previewDelete(id);
 }

 // ==================== VALIDAÇÕES ====================

 async validateUserData(data: any) {
   return await this.validateUserDataUseCase.execute(data);
 }

 async validateField(field: any, value: string, currentUserId?: string) {
   return await this.validateUserDataUseCase.executeField(field, value, currentUserId);
 }

 async validateEmailAvailability(email: string, currentUserId?: string) {
   return await this.validateUserDataUseCase.validateEmailAvailability(email, currentUserId);
 }

 validatePasswordStrength(senha: string) {
   return this.validateUserDataUseCase.validatePasswordStrength(senha);
 }

 // ==================== ESTATÍSTICAS ====================

 async getUserStatistics(userId: string) {
   return await this.getUserStatisticsUseCase.execute(userId);
 }

 async getUserStatisticsSummary(userId: string) {
   return await this.getUserStatisticsUseCase.executeSummary(userId);
 }

 // ==================== EXPORTAÇÃO ====================

 async exportUserData(userId: string, format: ExportFormat = 'json') {
   return await this.exportUserDataUseCase.execute(userId, format);
 }

 async previewExportData(userId: string) {
   return await this.exportUserDataUseCase.previewData(userId);
 }

 // ==================== CONTAGEM ====================

 async countUsers(): Promise<number> {
   return await this.getAllUsersUseCase.count();
 }
}