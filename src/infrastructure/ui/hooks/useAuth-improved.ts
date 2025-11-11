import { useState } from 'react';
import { User } from '../../../core/domain/entities/User';
import { AuthController } from '../../adapters/controllers/AuthController';

// Hook desacoplado - recibe dependencias por parámetro
export const useAuth = (authController: AuthController) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phoneNumber: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authController.handleLogin(phoneNumber, password);
      if (result.success && result.user) {
        setUser(result.user);
        return result;
      }
      setError(result.message);
      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authController.handleLogout();
    setUser(null);
  };

  const register = async (phoneNumber: string, password: string, role: 'agent' | 'supervisor' | 'admin' = 'agent') => {
    setLoading(true);
    setError(null);
    try {
      return await authController.registerUser(phoneNumber, password, role);
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout, register };
};
