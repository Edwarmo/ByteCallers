// Dependency Injection Container - Unified
import { IUserRepository } from '../core/domain/ports/repositories/IUserRepository';
import { ICallRepository } from '../core/domain/ports/repositories/ICallRepository';
import { IAuthService } from '../core/domain/ports/services/IAuthService';
import { InMemoryUserRepository } from './adapters/repositories/InMemoryUserRepository';
import { InMemoryCallRepository } from './adapters/repositories/InMemoryCallRepository';
import { MockAuthService } from './adapters/services/MockAuthService';
import { CallService } from './adapters/services/CallService';
import { LoginUseCase } from '../core/application/usecases/auth/LoginUseCase';
import { InterveneCallUseCase } from '../core/application/usecases/calls/InterveneCallUseCase';
import { UpdateContextUseCase } from '../core/application/usecases/calls/UpdateContextUseCase';
import { AuthController } from './adapters/controllers/AuthController';
import { CallController } from './adapters/controllers/CallController';
import { APIButtonController } from './adapters/services/APIButtonController';

export class DIContainer {
  private static instance: DIContainer;
  
  private userRepository: IUserRepository;
  private callRepository: ICallRepository;
  private authService: IAuthService;
  private callService: CallService;
  private loginUseCase: LoginUseCase;
  private interveneCallUseCase: InterveneCallUseCase;
  private updateContextUseCase: UpdateContextUseCase;
  private authController: AuthController;
  private callController: CallController;

  private constructor() {
    this.userRepository = new InMemoryUserRepository();
    this.callRepository = new InMemoryCallRepository();
    this.authService = new MockAuthService();
    this.callService = new CallService();
    this.loginUseCase = new LoginUseCase(this.userRepository, this.authService);
    this.interveneCallUseCase = new InterveneCallUseCase(this.callRepository);
    this.updateContextUseCase = new UpdateContextUseCase(this.callRepository);
    this.authController = new AuthController(this.loginUseCase, this.userRepository);
    this.callController = new CallController(this.callRepository);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getAuthController(): AuthController {
    return this.authController;
  }

  getCallController(): CallController {
    return this.callController;
  }

  getCallService(): CallService {
    return this.callService;
  }

  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  getCallRepository(): ICallRepository {
    return this.callRepository;
  }

  getLoginUseCase(): LoginUseCase {
    return this.loginUseCase;
  }

  getInterveneCallUseCase(): InterveneCallUseCase {
    return this.interveneCallUseCase;
  }

  getUpdateContextUseCase(): UpdateContextUseCase {
    return this.updateContextUseCase;
  }

  getButtons() {
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

export const container = DIContainer.getInstance();
