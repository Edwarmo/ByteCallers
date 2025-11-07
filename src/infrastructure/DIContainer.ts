// Dependency Injection Container
import { LoginUseCase } from '../core/application/usecases/auth/LoginUseCase';
import { InMemoryUserRepository } from './adapters/repositories/InMemoryUserRepository';
import { MockAuthService } from './adapters/services/MockAuthService';

import { InterveneCallUseCase } from '../core/application/usecases/calls/InterveneCallUseCase';
import { UpdateContextUseCase } from '../core/application/usecases/calls/UpdateContextUseCase';
import { InMemoryCallRepository } from './adapters/repositories/InMemoryCallRepository';

export class DIContainer {
  private static userRepository = new InMemoryUserRepository();
  private static authService = new MockAuthService();
  private static callRepository = new InMemoryCallRepository();

  static getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.userRepository, this.authService);
  }

  static getInterveneCallUseCase(): InterveneCallUseCase {
    return new InterveneCallUseCase(this.callRepository);
  }

  static getUpdateContextUseCase(): UpdateContextUseCase {
    return new UpdateContextUseCase(this.callRepository);
  }
}
