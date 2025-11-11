// Improved Dependency Injection Container
import { IUserRepository } from '../core/domain/ports/repositories/IUserRepository';
import { ICallRepository } from '../core/domain/ports/repositories/ICallRepository';
import { ITicketRepository } from '../core/domain/ports/repositories/ITicketRepository';
import { IAuthService } from '../core/domain/ports/services/IAuthService';
import { InMemoryUserRepository } from './adapters/repositories/InMemoryUserRepository';
import { InMemoryCallRepository } from './adapters/repositories/InMemoryCallRepository';
import { InMemoryTicketRepository } from './adapters/repositories/InMemoryTicketRepository';
import { MockAuthService } from './adapters/services/MockAuthService';
import { CallService } from './adapters/services/CallService';
import { LoginUseCase } from '../core/application/usecases/auth/LoginUseCase';
import { InterveneCallUseCase } from '../core/application/usecases/calls/InterveneCallUseCase';
import { UpdateContextUseCase } from '../core/application/usecases/calls/UpdateContextUseCase';
import { TicketStatsUseCase } from '../core/application/usecases/tickets/TicketStatsUseCase';
import { UpdateTicketStatusUseCase } from '../core/application/usecases/tickets/UpdateTicketStatusUseCase';
import { AuthController } from './adapters/controllers/AuthController';
import { CallController } from './adapters/controllers/CallController';
import { TicketController } from './adapters/controllers/TicketController';

export class DIContainer {
  private static instance: DIContainer;
  
  // Repositories
  private userRepository: IUserRepository;
  private callRepository: ICallRepository;
  private ticketRepository: ITicketRepository;
  
  // Services
  private authService: IAuthService;
  private callService: CallService;
  
  // Use Cases
  private loginUseCase: LoginUseCase;
  private interveneCallUseCase: InterveneCallUseCase;
  private updateContextUseCase: UpdateContextUseCase;
  private ticketStatsUseCase: TicketStatsUseCase;
  private updateTicketStatusUseCase: UpdateTicketStatusUseCase;
  
  // Controllers
  private authController: AuthController;
  private callController: CallController;
  private ticketController: TicketController;

  private constructor() {
    // Repositories
    this.userRepository = new InMemoryUserRepository();
    this.callRepository = new InMemoryCallRepository();
    this.ticketRepository = new InMemoryTicketRepository();
    
    // Services
    this.authService = new MockAuthService();
    this.callService = new CallService();
    
    // Use Cases
    this.loginUseCase = new LoginUseCase(this.userRepository, this.authService);
    this.interveneCallUseCase = new InterveneCallUseCase(this.callRepository);
    this.updateContextUseCase = new UpdateContextUseCase(this.callRepository);
    this.ticketStatsUseCase = new TicketStatsUseCase();
    this.updateTicketStatusUseCase = new UpdateTicketStatusUseCase(this.ticketRepository);
    
    // Controllers
    this.authController = new AuthController(this.loginUseCase, this.userRepository);
    this.callController = new CallController();
    this.ticketController = new TicketController(this.ticketRepository, this.ticketStatsUseCase, this.updateTicketStatusUseCase);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Getters
  getAuthController(): AuthController {
    return this.authController;
  }

  getCallController(): CallController {
    return this.callController;
  }

  getTicketController(): TicketController {
    return this.ticketController;
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

  getTicketRepository(): ITicketRepository {
    return this.ticketRepository;
  }
}

export const container = DIContainer.getInstance();
