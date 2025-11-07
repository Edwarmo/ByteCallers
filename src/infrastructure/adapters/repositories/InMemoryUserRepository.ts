// Adapter - In-Memory User Repository
import { IUserRepository } from '../../../core/domain/ports/repositories/IUserRepository';
import { User } from '../../../core/domain/entities/User';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    // Mock users for development
    this.users.set('+57 300 123 4567', {
      id: '1',
      phoneNumber: '+57 300 123 4567',
      role: 'agent',
      isBlocked: false,
      failedAttempts: 0,
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.users.get(phoneNumber) || null;
  }

  async findById(id: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.phoneNumber, user);
  }

  async update(user: User): Promise<void> {
    this.users.set(user.phoneNumber, user);
  }

  async delete(id: string): Promise<void> {
    for (const [key, user] of this.users.entries()) {
      if (user.id === id) {
        this.users.delete(key);
        break;
      }
    }
  }
}
