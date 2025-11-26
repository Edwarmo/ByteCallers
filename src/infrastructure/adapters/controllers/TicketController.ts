import { ITicketRepository } from '../../../core/domain/ports/repositories/ITicketRepository';
import { TicketStatsUseCase } from '../../../core/application/usecases/tickets/TicketStatsUseCase';
import { UpdateTicketStatusUseCase } from '../../../core/application/usecases/tickets/UpdateTicketStatusUseCase';
import { Ticket, TicketCategory, TicketStatus } from '../../../core/domain/types/Ticket';

export class TicketController {
  constructor(
    private ticketRepository: ITicketRepository,
    private ticketStatsUseCase: TicketStatsUseCase,
    private updateTicketStatusUseCase: UpdateTicketStatusUseCase
  ) {}

  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    return this.ticketRepository.findById(id);
  }

  async getTicketsByCategory(category: TicketCategory): Promise<Ticket[]> {
    return this.ticketRepository.findByCategory(category);
  }

  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.ticketRepository.findByStatus(status);
  }

  async updateTicketStatus(ticketId: string, newStatus: TicketStatus, userId: string): Promise<void> {
    return this.updateTicketStatusUseCase.execute(ticketId, newStatus, userId);
  }

  async getTicketStats() {
    const tickets = await this.ticketRepository.findAll();
    return this.ticketStatsUseCase.execute(tickets);
  }
}
