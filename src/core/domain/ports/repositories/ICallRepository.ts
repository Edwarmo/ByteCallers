// Port - Call Repository Interface
import { Call } from '../../entities/Call';

export interface ICallRepository {
  findById(id: string): Promise<Call | null>;
  findAll(): Promise<Call[]>;
  findByStatus(status: string): Promise<Call[]>;
  findUrgent(): Promise<Call[]>;
  save(call: Call): Promise<void>;
  update(call: Call): Promise<void>;
  delete(id: string): Promise<void>;
}
