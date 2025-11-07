import { User, LoginCredentials } from '../../../domain/entities/User';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User; token?: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  createUser(phoneNumber: string, password: string, role: 'agent' | 'supervisor' | 'admin'): Promise<void>;
}
