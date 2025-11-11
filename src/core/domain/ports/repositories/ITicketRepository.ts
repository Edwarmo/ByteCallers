import { Ticket, TicketCategory, TicketStatus } from '../../types/Ticket';

// Port - Ticket Repository Interface
export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByCategory(category: TicketCategory): Promise<Ticket[]>;
  findByStatus(status: TicketStatus): Promise<Ticket[]>;
  save(ticket: Ticket): Promise<void>;
  update(ticket: Ticket): Promise<void>;
  delete(id: string): Promise<void>;
}
