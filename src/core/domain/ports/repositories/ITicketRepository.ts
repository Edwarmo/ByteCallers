// Port - Ticket Repository Interface
import { Ticket } from '../../entities/Ticket';

export interface ITicketRepository {
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  findByStatus(status: string): Promise<Ticket[]>;
  findByCategory(category: string): Promise<Ticket[]>;
  save(ticket: Ticket): Promise<void>;
  update(ticket: Ticket): Promise<void>;
  delete(id: string): Promise<void>;
}
