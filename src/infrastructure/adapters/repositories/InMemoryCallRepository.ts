// Adapter - In-Memory Call Repository
import { ICallRepository } from '../../../core/domain/ports/repositories/ICallRepository';
import { Call } from '../../../core/domain/entities/Call';

export class InMemoryCallRepository implements ICallRepository {
  private calls: Map<string, Call> = new Map();

  constructor() {
    // Mock calls for development
    const mockCalls: Call[] = [
      { id: '001', phoneNumber: '+57 300 111 2222', type: 'Ventas', status: 'active', duration: 345, aiConfidence: 65, urgency: 'high' },
      { id: '002', phoneNumber: '+57 301 222 3333', type: 'Soporte Técnico', status: 'active', duration: 189, aiConfidence: 72, urgency: 'high' },
      { id: '003', phoneNumber: '+57 302 333 4444', type: 'Reclamación', status: 'on-hold', duration: 534, aiConfidence: 58, urgency: 'high' },
      { id: '004', phoneNumber: '+57 303 444 5555', type: 'Ventas', status: 'active', duration: 56, aiConfidence: 91, urgency: 'low' },
    ];
    
    mockCalls.forEach(call => this.calls.set(call.id, call));
  }

  async findById(id: string): Promise<Call | null> {
    return this.calls.get(id) || null;
  }

  async findAll(): Promise<Call[]> {
    return Array.from(this.calls.values());
  }

  async findByStatus(status: string): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(call => call.status === status);
  }

  async findUrgent(): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(call => call.urgency === 'high');
  }

  async save(call: Call): Promise<void> {
    this.calls.set(call.id, call);
  }

  async update(call: Call): Promise<void> {
    this.calls.set(call.id, call);
  }

  async delete(id: string): Promise<void> {
    this.calls.delete(id);
  }
}
