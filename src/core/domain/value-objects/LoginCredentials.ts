// Value Object - Login Credentials
export class LoginCredentials {
  constructor(
    public readonly phoneNumber: string,
    public readonly password: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.phoneNumber || this.phoneNumber.trim() === '') {
      throw new Error('Phone number is required');
    }
    if (!this.password || this.password.trim() === '') {
      throw new Error('Password is required');
    }
  }
}
