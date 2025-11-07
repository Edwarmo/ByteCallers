export class PhoneNumber {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid phone number');
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    // Add your validation logic here
    return /^\d{10}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}
