import { useState, useEffect } from 'react';
import { User } from '../../../core/domain/entities/User';
import { AuthService } from '../../adapters/services/AuthService';
import { StorageUtils } from '../../../shared/utils/storage';

export const useAuth = () => {
  const authService = new AuthService();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await StorageUtils.getSecureItem('access_token');
        if (token) {
          const currentUser = await authService.validateToken(token);
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            await authService.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error verificando autenticación:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(username, password);
      if (result.user && result.token) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user, token: result.token };
      }
      const errorMsg = result.error || 'Credenciales inválidas';
      setError(errorMsg);
      setIsAuthenticated(false);
      return { success: false, message: errorMsg };
    } catch (err: any) {
      const errorMsg = err.message || 'Error de conexión';
      setError(errorMsg);
      setIsAuthenticated(false);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err: any) {
      console.error('Error en logout:', err);
      // Aún así, limpiar el estado local
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        return currentUser;
      }
      return null;
    } catch (err) {
      console.error('Error obteniendo usuario actual:', err);
      return null;
    }
  };

  return { 
    user, 
    loading, 
    error, 
    isAuthenticated,
    login, 
    logout, 
    getCurrentUser 
  };
};
