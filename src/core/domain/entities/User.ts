// Domain Entity - User
export interface User {
  id: string;
  phoneNumber: string;
  role: 'agent' | 'supervisor' | 'admin';
  isBlocked: boolean;
  failedAttempts: number;
  lastFailedAttempt?: Date;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public phoneNumber: string,
    public role: 'agent' | 'supervisor' | 'admin',
    public isBlocked: boolean,
    public failedAttempts: number,
    public lastFailedAttempt?: Date
  ) {}

  canLogin(): boolean {
    return !this.isBlocked && this.failedAttempts < 3;
  }

  incrementFailedAttempts(): void {
    this.failedAttempts++;
    this.lastFailedAttempt = new Date();
    if (this.failedAttempts >= 3) {
      this.isBlocked = true;
    }
  }

  resetFailedAttempts(): void {
    this.failedAttempts = 0;
    this.lastFailedAttempt = undefined;
  }

  block(): void {
    this.isBlocked = true;
  }

  unblock(): void {
    this.isBlocked = false;
    this.resetFailedAttempts();
  }
}
