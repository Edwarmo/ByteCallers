import { User, LoginCredentials, AuthState } from '../../types/Auth';
import { StorageUtils } from '../../utils/storage';

export class AuthModel {
  private static readonly MAX_FAILED_ATTEMPTS = 3;
  private static readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

  static async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    try {
      // Simular fetch a base de datos
      await this.simulateDatabaseFetch(credentials.phoneNumber);
      
      let user = await this.getUserByPhone(credentials.phoneNumber);
      
      // Si el usuario no existe, crear uno nuevo y permitir el ingreso
      if (!user) {
        user = await this.createNewUser(credentials.phoneNumber, credentials.password);
        const token = await this.generateToken(user);
        return { success: true, message: 'Usuario creado e ingreso exitoso', user, token };
      }

      if (user.isBlocked && this.isStillBlocked(user)) {
        return { success: false, message: 'Cuenta bloqueada por seguridad. Espere 15 minutos o contacte al administrador.' };
      }

      // Simular verificación de contraseña (en producción usar bcrypt)
      const isValidPassword = await this.verifyPassword(credentials.password, user.phoneNumber);
      
      if (!isValidPassword) {
        await this.handleFailedAttempt(user);
        return { success: false, message: 'Credenciales incorrectas' };
      }

      await this.resetFailedAttempts(user);
      const token = await this.generateToken(user);
      
      return { success: true, message: 'Login exitoso', user, token };
    } catch (error) {
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  private static async getUserByPhone(phoneNumber: string): Promise<User | null> {
    try {
      const userData = await StorageUtils.getItem(`user_${phoneNumber}`);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private static async verifyPassword(password: string, phoneNumber: string): Promise<boolean> {
    try {
      const storedPassword = await StorageUtils.getSecureItem(`password_${phoneNumber}`);
      return storedPassword === password; // En producción usar bcrypt.compare
    } catch {
      return false;
    }
  }

  private static isStillBlocked(user: User): boolean {
    if (!user.lastFailedAttempt) return false;
    const timeSinceLastAttempt = Date.now() - new Date(user.lastFailedAttempt).getTime();
    return timeSinceLastAttempt < this.BLOCK_DURATION;
  }

  private static async handleFailedAttempt(user: User): Promise<void> {
    user.failedAttempts += 1;
    user.lastFailedAttempt = new Date();
    
    if (user.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      user.isBlocked = true;
    }
    
    await StorageUtils.setItem(`user_${user.phoneNumber}`, JSON.stringify(user));
  }

  private static async resetFailedAttempts(user: User): Promise<void> {
    user.failedAttempts = 0;
    user.isBlocked = false;
    user.lastFailedAttempt = undefined;
    await StorageUtils.setItem(`user_${user.phoneNumber}`, JSON.stringify(user));
  }

  private static async generateToken(user: User): Promise<string> {
    const token = `token_${user.id}_${Date.now()}`;
    await StorageUtils.setSecureItem('auth_token', token);
    return token;
  }

  static async logout(): Promise<void> {
    await StorageUtils.deleteSecureItem('auth_token');
    await StorageUtils.removeItem('current_user');
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await StorageUtils.getItem('current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Simular fetch a base de datos
  private static async simulateDatabaseFetch(phoneNumber: string): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Consultando base de datos para: ${phoneNumber}`);
  }

  // Crear nuevo usuario cuando no existe en la base de datos
  private static async createNewUser(phoneNumber: string, password: string): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}`,
      phoneNumber,
      role: 'agent',
      isBlocked: false,
      failedAttempts: 0
    };
    
    await StorageUtils.setItem(`user_${phoneNumber}`, JSON.stringify(user));
    await StorageUtils.setSecureItem(`password_${phoneNumber}`, password);
    
    return user;
  }

  static async createUser(phoneNumber: string, password: string, role: 'agent' | 'supervisor' | 'admin' = 'agent'): Promise<void> {
    const user: User = {
      id: `user_${Date.now()}`,
      phoneNumber,
      role,
      isBlocked: false,
      failedAttempts: 0
    };
    
    await StorageUtils.setItem(`user_${phoneNumber}`, JSON.stringify(user));
    await StorageUtils.setSecureItem(`password_${phoneNumber}`, password);
  }
}
