// Adapter - Mock Auth Service
import { IAuthService } from '../../../core/domain/ports/services/IAuthService';
import { User } from '../../../core/domain/entities/User';

export class MockAuthService implements IAuthService {
  private readonly mockPassword = '1234'; // Mock password for development

  async validateCredentials(phoneNumber: string, password: string): Promise<boolean> {
    // Mock validation - in production, this would check against a database
    return password === this.mockPassword;
  }

  async generateToken(user: User): Promise<string> {
    // Mock token generation - in production, use JWT
    return `mock-token-${user.id}-${Date.now()}`;
  }

  async validateToken(token: string): Promise<User | null> {
    // Mock token validation - in production, verify JWT
    if (token.startsWith('mock-token-')) {
      return {
        id: '1',
        phoneNumber: '+57 300 123 4567',
        role: 'agent',
        isBlocked: false,
        failedAttempts: 0,
      };
    }
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    // Mock hashing - in production, use bcrypt
    return `hashed-${password}`;
  }
}
