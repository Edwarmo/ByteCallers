import { AuthModel } from '../models/AuthModel';
import { LoginCredentials, User } from '../../types/Auth';
import { validatePhoneNumber, validatePassword } from '../../utils/validation';

export class AuthController {
  static async handleLogin(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    // Validar formato de teléfono
    const phoneValidation = validatePhoneNumber(credentials.phoneNumber);
    if (!phoneValidation.isValid) {
      return { success: false, message: phoneValidation.message };
    }

    // Validar contraseña
    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.message };
    }

    return await AuthModel.login(credentials);
  }

  static async handleLogout(): Promise<void> {
    await AuthModel.logout();
  }

  static async getCurrentUser(): Promise<User | null> {
    return await AuthModel.getCurrentUser();
  }

  static async registerUser(phoneNumber: string, password: string, role: 'agent' | 'supervisor' | 'admin' = 'agent'): Promise<{ success: boolean; message: string }> {
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      return { success: false, message: phoneValidation.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.message };
    }

    try {
      await AuthModel.createUser(phoneNumber, password, role);
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      return { success: false, message: 'Error al registrar usuario' };
    }
  }
}
