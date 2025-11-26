import { APP_CONFIG } from '../../../shared/config';
import { StorageUtils } from '../../../shared/utils/storage';
import { authEventManager } from '../../../shared/utils/authEvents';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl;
  }

  /**
   * Obtiene el token de acceso almacenado
   */
  private async getAccessToken(): Promise<string | null> {
    return await StorageUtils.getSecureItem('access_token');
  }

  /**
   * Construye los headers para las peticiones
   */
  private async buildHeaders(contentType: string = 'application/json', includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'accept': 'application/json',
      'Content-Type': contentType,
    };

    if (includeAuth) {
      const token = await this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Convierte un objeto a form-urlencoded
   */
  private objectToFormUrlEncoded(obj: Record<string, string>): string {
    return Object.keys(obj)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }

  /**
   * Maneja errores de respuesta
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      // Si es un error 401, limpiar el token y notificar que se requiere logout
      if (response.status === 401) {
        console.log('Error 401 detectado: Token expirado o inválido');
        await StorageUtils.deleteSecureItem('access_token');
        await StorageUtils.removeItem('current_user');
        // Notificar que se requiere logout/redirección al login
        authEventManager.notifyLogoutRequired();
      }

      // Manejar errores 422 (Unprocessable Entity) de FastAPI
      let errorMessage: any = data?.detail || data?.message || `Error ${response.status}: ${response.statusText}`;
      
      // Si es un error 422 y tiene detail como array (formato FastAPI)
      if (response.status === 422 && data?.detail && Array.isArray(data.detail)) {
        // Devolver el array completo de errores para que el servicio pueda procesarlo
        errorMessage = data.detail;
      }

      return {
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  }

  /**
   * Realiza una petición GET
   */
  async get<T = any>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const headers = await this.buildHeaders('application/json', includeAuth);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error de red',
        status: 0,
      };
    }
  }

  /**
   * Realiza una petición POST con JSON
   */
  async post<T = any>(endpoint: string, data: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const headers = await this.buildHeaders('application/json', includeAuth);
      const url = `${this.baseUrl}${endpoint}`;
      
      console.log('API POST Request:', {
        url,
        hasAuth: includeAuth,
        dataKeys: Object.keys(data),
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<T>(response);
      
      if (result.error) {
        console.error('API POST Error Response:', {
          status: result.status,
          error: result.error,
        });
      }

      return result;
    } catch (error) {
      console.error('API POST Exception:', error);
      return {
        error: error instanceof Error ? error.message : 'Error de red',
        status: 0,
      };
    }
  }

  /**
   * Realiza una petición POST con form-urlencoded
   */
  async postFormUrlEncoded<T = any>(endpoint: string, data: Record<string, string>, includeAuth: boolean = false): Promise<ApiResponse<T>> {
    try {
      const headers = await this.buildHeaders('application/x-www-form-urlencoded', includeAuth);
      const formData = this.objectToFormUrlEncoded(data);
      const fullUrl = `${this.baseUrl}${endpoint}`; // http://127.0.0.1:8181/api/usuarios/login
      
      console.log('API Request:', {
        url: fullUrl,
        method: 'POST',
        hasAuth: includeAuth,
        dataKeys: Object.keys(data),
      });
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Error de red',
        status: 0,
      };
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put<T = any>(endpoint: string, data: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const headers = await this.buildHeaders('application/json', includeAuth);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error de red',
        status: 0,
      };
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T = any>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const headers = await this.buildHeaders('application/json', includeAuth);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error de red',
        status: 0,
      };
    }
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();
