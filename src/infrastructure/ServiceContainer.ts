import { AuthController } from './adapters/controllers/AuthController';
import { CallController } from './adapters/controllers/CallController';
import { APIButtonController } from './adapters/services/APIButtonController';
import { InMemoryUserRepository } from './adapters/repositories/InMemoryUserRepository';
import { InMemoryCallRepository } from './adapters/repositories/InMemoryCallRepository';
import { LoginUseCase } from '../core/application/usecases/auth/LoginUseCase';
import { MockAuthService } from './adapters/services/MockAuthService';
import { CallService } from './adapters/services/CallService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private userRepository = new InMemoryUserRepository();
  private callRepository = new InMemoryCallRepository();
  private authService = new MockAuthService();
  private callService = new CallService();
  private loginUseCase = new LoginUseCase(this.userRepository, this.authService);

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get controllers() {
    const authController = new AuthController(this.loginUseCase, this.userRepository);
    const callController = new CallController();
    return {
      auth: authController,
      call: callController,
    };
  }

  get auth() {
    return {
      login: this.loginUseCase.execute.bind(this.loginUseCase),
      logout: this.controllers.auth.handleLogout.bind(this.controllers.auth),
      getCurrentUser: this.controllers.auth.getCurrentUser.bind(this.controllers.auth),
      register: this.controllers.auth.registerUser.bind(this.controllers.auth),
    };
  }

  get repositories() {
    return {
      users: this.userRepository,
      calls: this.callRepository,
    };
  }

  get calls() {
    return {
      receive: this.callService.receiveCall.bind(this.callService),
      getActive: this.callService.getActiveCall.bind(this.callService),
      controls: this.callService.getControls.bind(this.callService),
      isMuted: this.callService.isMutedStatus.bind(this.callService),
      isOnHold: this.callService.isOnHoldStatus.bind(this.callService),
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
