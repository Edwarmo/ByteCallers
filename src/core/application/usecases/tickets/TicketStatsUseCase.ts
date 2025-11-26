import { Ticket, TicketStats } from '../../../domain/types/Ticket';

// Use Case separado para cálculo de estadísticas (Single Responsibility)
export class TicketStatsUseCase {
  execute(tickets: Ticket[]): TicketStats {
    const stats: TicketStats = {
      total: tickets.length,
      byCategory: { support: 0, complaints: 0, sales: 0 },
      byStatus: { new: 0, in_progress: 0, pending_user: 0, waiting_third_party: 0, resolved: 0, closed: 0 },
      urgent: 0
    };

    tickets.forEach(ticket => {
      stats.byCategory[ticket.category]++;
      stats.byStatus[ticket.status]++;
      if (ticket.priority === 'urgent') stats.urgent++;
    });

    return stats;
  }
}
