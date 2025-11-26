// Use Case - Login
import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { IAuthService } from '../../../domain/ports/services/IAuthService';
import { User, UserEntity } from '../../../domain/entities/User';
import { LoginCredentials } from '../../../domain/value-objects/LoginCredentials';

export interface LoginResult {
  user: User;
  token: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    const user = await this.userRepository.findByPhoneNumber(credentials.phoneNumber);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const userEntity = new UserEntity(
      user.id,
      user.phoneNumber,
      user.role,
      user.isBlocked,
      user.failedAttempts,
      user.lastFailedAttempt
    );

    if (!userEntity.canLogin()) {
      throw new Error('User is blocked or exceeded failed attempts');
    }

    const isValid = await this.authService.validateCredentials(
      credentials.phoneNumber,
      credentials.password
    );
    
    if (!isValid) {
      userEntity.incrementFailedAttempts();
      await this.userRepository.update(userEntity);
      throw new Error('Invalid credentials');
    }

    userEntity.resetFailedAttempts();
    await this.userRepository.update(userEntity);
    
    const token = await this.authService.generateToken(userEntity);
    
    return { user: userEntity, token };
  }
}
