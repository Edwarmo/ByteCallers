// Port - Auth Service Interface
import { User } from '../../entities/User';

export interface IAuthService {
  validateCredentials(phoneNumber: string, password: string): Promise<boolean>;
  generateToken(user: User): Promise<string>;
  validateToken(token: string): Promise<User | null>;
  hashPassword(password: string): Promise<string>;
}
