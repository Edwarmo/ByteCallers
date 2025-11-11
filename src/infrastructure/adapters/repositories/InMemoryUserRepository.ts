// Adapter - In-Memory User Repository
import { IUserRepository } from '../../../core/domain/ports/repositories/IUserRepository';
import { User } from '../../../core/domain/entities/User';
import { BaseRepository } from './BaseRepository';

export class InMemoryUserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super();
    const mockUser: User = {
      id: '1',
      phoneNumber: '+57 300 123 4567',
      role: 'agent',
      isBlocked: false,
      failedAttempts: 0,
    };
    this.storage.set(mockUser.id, mockUser);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.findBy(user => user.phoneNumber === phoneNumber)[0] || null;
  }

  async save(user: User): Promise<void> {
    this.saveEntity(user.id, user);
  }

  async update(user: User): Promise<void> {
    this.saveEntity(user.id, user);
  }
}
