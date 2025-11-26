// Adapter - Real Auth Service using FastAPI
import { IAuthService } from '../../../core/domain/ports/services/IAuthService';
import { User } from '../../../core/domain/entities/User';
import { apiClient } from '../api/ApiClient';
import { StorageUtils } from '../../../shared/utils/storage';

// Tipos para la respuesta de la API de FastAPI
export interface ApiLoginResponse {
  access_token: string;
  token_type: string;
  usuario: {
    nombre: string;
    email: string;
    rol: string;
    id: number;
  };
}

export interface LoginRequest extends Record<string, string> {
  grant_type: string;
  username: string;
  password: string;
  scope: string;
  client_id: string;
  client_secret: string;
}

export class AuthService implements IAuthService {
  /**
   * Valida las credenciales con la API de FastAPI
   */
  async validateCredentials(username: string, password: string): Promise<boolean> {
    try {
      const loginData: LoginRequest = {
        grant_type: 'password',
        username,
        password,
        scope: '',
        client_id: 'string',
        client_secret: 'string', // En producción, esto debería venir de variables de entorno
      };

      const response = await apiClient.postFormUrlEncoded<ApiLoginResponse>(
        '/api/usuarios/login',
        loginData,
        false // No incluir auth en el login
      );

      if (response.data && response.data.access_token) {
        // Guardar el token
        await StorageUtils.setSecureItem('access_token', response.data.access_token);
        
        // Guardar información del usuario
        const userData = {
          id: response.data.usuario.id.toString(),
          email: response.data.usuario.email,
          nombre: response.data.usuario.nombre,
          rol: response.data.usuario.rol,
        };
        await StorageUtils.setItem('current_user', JSON.stringify(userData));
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en validateCredentials:', error);
      return false;
    }
  }

  /**
   * Realiza el login completo y retorna el usuario y token
   */
  async login(username: string, password: string): Promise<{ user: User | null; token: string | null; error?: string }> {
    // Validar que los campos no estén vacíos
    if (!username.trim() || !password.trim()) {
      return { user: null, token: null, error: 'Por favor, completa todos los campos' };
    }

    try {
      const loginData: LoginRequest = {
        grant_type: 'password',
        username: username.trim(),
        password: password.trim(),
        scope: '',
        client_id: 'string',
        client_secret: 'string',
      };

      console.log('Intentando login con API:', { username: loginData.username, endpoint: '/api/usuarios/login' });

      const response = await apiClient.postFormUrlEncoded<ApiLoginResponse>(
        '/api/usuarios/login',
        loginData,
        false
      );

      console.log('Respuesta de la API:', { 
        hasData: !!response.data, 
        hasError: !!response.error, 
        status: response.status 
      });

      // Si hay un error en la respuesta
      if (response.error) {
        console.error('Error en login:', response.error);
        return { user: null, token: null, error: response.error };
      }

      // Si no hay datos o no hay token, es un error
      if (!response.data || !response.data.access_token) {
        console.error('No se recibió token de la API');
        return { user: null, token: null, error: 'Credenciales inválidas. Por favor, verifica tu email y contraseña.' };
      }

      const token = response.data.access_token;
      
      // Validar que el token no esté vacío
      if (!token || token.trim() === '') {
        console.error('Token vacío recibido de la API');
        return { user: null, token: null, error: 'Error al obtener token de autenticación' };
      }

      // Guardar el token
      await StorageUtils.setSecureItem('access_token', token);
      
      // Convertir el usuario de la API al formato de dominio
      const user: User = {
        id: response.data.usuario.id.toString(),
        phoneNumber: response.data.usuario.email, // Usamos email como phoneNumber temporalmente
        role: this.mapRoleFromApi(response.data.usuario.rol),
        isBlocked: false,
        failedAttempts: 0,
      };

      // Guardar información del usuario
      await StorageUtils.setItem('current_user', JSON.stringify({
        ...user,
        email: response.data.usuario.email,
        nombre: response.data.usuario.nombre,
      }));

      console.log('Login exitoso:', { userId: user.id, email: response.data.usuario.email });

      return { user, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Excepción en login:', error);
      return { user: null, token: null, error: `Error de conexión: ${errorMessage}. Por favor, verifica que la API esté disponible.` };
    }
  }

  /**
   * Mapea el rol de la API al formato del dominio
   */
  private mapRoleFromApi(apiRole: string): 'agent' | 'supervisor' | 'admin' {
    const roleMap: Record<string, 'agent' | 'supervisor' | 'admin'> = {
      'agente': 'agent',
      'supervisor': 'supervisor',
      'admin': 'admin',
      'administrador': 'admin',
    };

    return roleMap[apiRole.toLowerCase()] || 'agent';
  }

  /**
   * Genera un token (no se usa con la API real, el token viene del servidor)
   */
  async generateToken(user: User): Promise<string> {
    // Con la API real, el token se obtiene del servidor
    const token = await StorageUtils.getSecureItem('access_token');
    return token || '';
  }

  /**
   * Valida el token verificando si existe y está almacenado
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      // Verificar que el token existe
      const storedToken = await StorageUtils.getSecureItem('access_token');
      if (!storedToken || storedToken !== token) {
        return null;
      }

      // Obtener información del usuario almacenada
      const userData = await StorageUtils.getItem('current_user');
      if (!userData) {
        return null;
      }

      const parsed = JSON.parse(userData);
      return {
        id: parsed.id,
        phoneNumber: parsed.phoneNumber || parsed.email,
        role: parsed.role,
        isBlocked: false,
        failedAttempts: 0,
      };
    } catch (error) {
      console.error('Error en validateToken:', error);
      return null;
    }
  }

  /**
   * Obtiene el usuario actual desde el almacenamiento
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await StorageUtils.getItem('current_user');
      if (!userData) {
        return null;
      }

      const parsed = JSON.parse(userData);
      return {
        id: parsed.id,
        phoneNumber: parsed.phoneNumber || parsed.email,
        role: parsed.role,
        isBlocked: false,
        failedAttempts: 0,
      };
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return null;
    }
  }

  /**
   * Cierra la sesión limpiando el token y datos del usuario
   */
  async logout(): Promise<void> {
    await StorageUtils.deleteSecureItem('access_token');
    await StorageUtils.removeItem('current_user');
  }

  /**
   * Hash de contraseña (no se usa en el cliente, se hace en el servidor)
   */
  async hashPassword(password: string): Promise<string> {
    // El hash se hace en el servidor, esto es solo para compatibilidad con la interfaz
    return password;
  }
}

