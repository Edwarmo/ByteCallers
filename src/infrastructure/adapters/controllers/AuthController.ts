import { User } from '../../../core/domain/types/Auth';
import { LoginCredentials } from '../../../core/domain/value-objects/LoginCredentials';
import { LoginUseCase } from '../../../core/application/usecases/auth/LoginUseCase';
import { IUserRepository } from '../../../core/domain/ports/repositories/IUserRepository';

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private userRepository: IUserRepository
  ) {}

  async handleLogin(phoneNumber: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    try {
      const credentials = new LoginCredentials(phoneNumber, password);
      const result = await this.loginUseCase.execute(credentials);
      return { success: true, message: 'Login exitoso', user: result.user, token: result.token };
    } catch (error: any) {
      return { success: false, message: error.message || 'Error en login' };
    }
  }

  async handleLogout(): Promise<void> {
    // Implementar logout use case
  }

  async getCurrentUser(): Promise<User | null> {
    // Implementar get current user use case
    return null;
  }

  async registerUser(phoneNumber: string, password: string, role: 'agent' | 'supervisor' | 'admin' = 'agent'): Promise<{ success: boolean; message: string }> {
    // Implementar register use case
    return { success: false, message: 'Not implemented' };
  }
}
