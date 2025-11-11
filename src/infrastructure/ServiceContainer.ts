// DEPRECATED: Use DIContainer instead
// This file is kept for backward compatibility only
// All functionality has been moved to DIContainer.ts

import { container } from './DIContainer';

export class ServiceContainer {
  private static instance: ServiceContainer;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get controllers() {
    return {
      auth: container.getAuthController(),
      call: container.getCallController(),
    };
  }

  get auth() {
    const authController = container.getAuthController();
    return {
      login: container.getLoginUseCase().execute.bind(container.getLoginUseCase()),
      logout: authController.handleLogout.bind(authController),
      getCurrentUser: authController.getCurrentUser.bind(authController),
      register: authController.registerUser.bind(authController),
    };
  }

  get repositories() {
    return {
      users: container.getUserRepository(),
      calls: container.getCallRepository(),
    };
  }

  get calls() {
    const callService = container.getCallService();
    return {
      receive: callService.receiveCall.bind(callService),
      getActive: callService.getActiveCall.bind(callService),
      controls: callService.getControls.bind(callService),
      isMuted: callService.isMutedStatus.bind(callService),
      isOnHold: callService.isOnHoldStatus.bind(callService),
    };
  }

  get buttons() {
    return container.getButtons();
  }
}

export const services = ServiceContainer.getInstance();
