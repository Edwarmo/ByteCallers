import { AuthController } from './adapters/controllers/AuthController';
import { APIButtonController } from './adapters/services/APIButtonController';
import { InMemoryUserRepository } from './adapters/repositories/InMemoryUserRepository';
import { InMemoryCallRepository } from './adapters/repositories/InMemoryCallRepository';
import { LoginUseCase } from '../core/application/usecases/auth/LoginUseCase';
import { MockAuthService } from './adapters/services/MockAuthService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private userRepository = new InMemoryUserRepository();
  private callRepository = new InMemoryCallRepository();
  private authService = new MockAuthService();
  private loginUseCase = new LoginUseCase(this.userRepository, this.authService);

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get auth() {
    return {
      login: this.loginUseCase.execute.bind(this.loginUseCase),
      logout: AuthController.handleLogout.bind(AuthController),
      getCurrentUser: AuthController.getCurrentUser.bind(AuthController),
      register: AuthController.registerUser.bind(AuthController),
    };
  }

  get repositories() {
    return {
      users: this.userRepository,
      calls: this.callRepository,
    };
  }

  get buttons() {
    return {
      activate: APIButtonController.activateButton,
      disable: APIButtonController.disableButton,
      update: APIButtonController.updateButton,
      resetAll: APIButtonController.resetAll,
      simulateClick: APIButtonController.simulateHumanClick,
      sendCallInfo: APIButtonController.sendCallInfoToChatbot,
      getCurrentCallInfo: APIButtonController.getCurrentCallInfo,
    };
  }
}

export const services = ServiceContainer.getInstance();
