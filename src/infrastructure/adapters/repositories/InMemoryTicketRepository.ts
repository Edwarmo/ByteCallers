import { ITicketRepository } from '../../../core/domain/ports/repositories/ITicketRepository';
import { Ticket, TicketCategory, TicketStatus } from '../../../core/domain/types/Ticket';
import { BaseRepository } from './BaseRepository';
import { TicketFactory } from '../../../core/domain/entities/TicketFactory';

export class InMemoryTicketRepository extends BaseRepository<Ticket> implements ITicketRepository {
  constructor() {
    super();
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    const demoTickets = [
      TicketFactory.createTicket('support', 'TKT-001', 'Error en aplicación móvil', 'La app se cierra inesperadamente al intentar hacer login', 'Juan Pérez'),
      TicketFactory.createTicket('complaints', 'TKT-002', 'Cobro indebido en factura', 'Se realizó un cobro duplicado en mi cuenta', 'María García'),
      TicketFactory.createTicket('sales', 'TKT-003', 'Consulta sobre plan premium', 'Interesado en upgrade a plan premium', 'Carlos López')
    ];
    demoTickets.forEach(ticket => this.storage.set(ticket.id, ticket));
  }

  async findByCategory(category: TicketCategory): Promise<Ticket[]> {
    return this.findBy(ticket => ticket.category === category);
  }

  async findByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.findBy(ticket => ticket.status === status);
  }

  async save(ticket: Ticket): Promise<void> {
    this.saveEntity(ticket.id, ticket);
  }

  async update(ticket: Ticket): Promise<void> {
    this.saveEntity(ticket.id, ticket);
  }
}
