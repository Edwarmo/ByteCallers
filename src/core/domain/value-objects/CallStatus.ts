export enum CallStatusValue {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  WAITING = 'waiting',
}

export class CallStatus {
  private readonly value: CallStatusValue;

  constructor(value: CallStatusValue) {
    this.value = value;
  }

  getValue(): CallStatusValue {
    return this.value;
  }
}
