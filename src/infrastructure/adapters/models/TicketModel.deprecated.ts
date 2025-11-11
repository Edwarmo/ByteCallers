import { Ticket, TicketCategory, TicketStatus, TicketStats, TicketHistoryEntry } from '../../../core/domain/types/Ticket';
import { StorageUtils } from '../../../shared/utils/storage';
import { TicketFactory } from '../../../core/domain/entities/TicketFactory';

export class TicketModel {
  private static tickets: Ticket[] = [];

  private static StatsCalculator = class {
    constructor(private tickets: Ticket[]) {}

    calculate(): TicketStats {
      const stats: TicketStats = {
        total: this.tickets.length,
        byCategory: { support: 0, complaints: 0, sales: 0 },
        byStatus: { new: 0, in_progress: 0, pending_user: 0, waiting_third_party: 0, resolved: 0, closed: 0 },
        urgent: 0
      };

      this.tickets.forEach(ticket => {
        stats.byCategory[ticket.category]++;
        stats.byStatus[ticket.status]++;
        if (ticket.priority === 'urgent') stats.urgent++;
      });

      return stats;
    }
  };

  static async loadTickets(): Promise<Ticket[]> {
    try {
      const data = await StorageUtils.getItem('tickets');
      this.tickets = data ? JSON.parse(data).map((ticket: any) => ({...ticket, createdAt: new Date(ticket.createdAt), updatedAt: new Date(ticket.updatedAt)})) : this.generateDemoTickets();
      return this.tickets;
    } catch {
      this.tickets = this.generateDemoTickets();
      return this.tickets;
    }
  }

  static async saveTickets(): Promise<void> {
    await StorageUtils.setItem('tickets', JSON.stringify(this.tickets));
  }

  static getAllTickets(): Ticket[] {
    return this.tickets;
  }

  static getTicketsByCategory(category: TicketCategory): Ticket[] {
    return this.tickets.filter(ticket => ticket.category === category);
  }

  static getTicketsByStatus(status: TicketStatus): Ticket[] {
    return this.tickets.filter(ticket => ticket.status === status);
  }

  static getTicketById(id: string): Ticket | undefined {
    return this.tickets.find(ticket => ticket.id === id);
  }

  static async updateTicketStatus(id: string, newStatus: TicketStatus, user: string, description?: string): Promise<boolean> {
    const ticket = this.getTicketById(id);
    if (!ticket) return false;

    const historyEntry: TicketHistoryEntry = {
      id: `history_${Date.now()}`,
      timestamp: new Date(),
      action: 'status_change',
      user,
      previousStatus: ticket.status,
      newStatus,
      description: description || `Estado cambiado a ${newStatus}`
    };

    ticket.status = newStatus;
    ticket.updatedAt = new Date();
    ticket.history.push(historyEntry);

    await this.saveTickets();
    return true;
  }

  static getStats(): TicketStats {
    return new this.StatsCalculator(this.tickets).calculate();
  }

  private static generateDemoTickets(): Ticket[] {
    return [
      TicketFactory.createTicket(
        'support',
        'TKT-001',
        'Error en aplicación móvil',
        'La app se cierra inesperadamente al intentar hacer login',
        'Juan Pérez'
      ),
      TicketFactory.createTicket(
        'complaints',
        'TKT-002',
        'Cobro indebido en factura',
        'Se realizó un cobro duplicado en mi cuenta',
        'María García'
      ),
      TicketFactory.createTicket(
        'sales',
        'TKT-003',
        'Consulta sobre plan premium',
        'Interesado en upgrade a plan premium',
        'Carlos López'
      )
    ];
  }
}
