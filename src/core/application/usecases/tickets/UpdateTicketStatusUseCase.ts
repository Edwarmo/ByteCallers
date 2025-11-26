import { ITicketRepository } from '../../../domain/ports/repositories/ITicketRepository';
import { TicketStatus } from '../../../domain/types/Ticket';

export class UpdateTicketStatusUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(ticketId: string, newStatus: TicketStatus, userId: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.status = newStatus;
    ticket.updatedAt = new Date();
    // Assuming a history entry should be added here.
    // This logic was in TicketModel and should be here.
    ticket.history.push({
        id: `history_${Date.now()}`,
        timestamp: new Date(),
        action: 'status_change',
        user: userId,
        previousStatus: ticket.status,
        newStatus: newStatus,
        description: `Status changed to ${newStatus}`
    });


    await this.ticketRepository.update(ticket);
  }
}
