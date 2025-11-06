export interface User {
  id: string;
  phoneNumber: string;
  role: 'agent' | 'supervisor' | 'admin';
  isBlocked: boolean;
  failedAttempts: number;
  lastFailedAttempt?: Date;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}
