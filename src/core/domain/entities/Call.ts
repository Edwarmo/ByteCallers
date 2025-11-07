// Domain Entity - Call
export type CallType = 'Ventas' | 'Soporte Técnico' | 'Reclamación';
export type CallStatus = 'active' | 'on-hold' | 'transferring' | 'completed';
export type CallUrgency = 'high' | 'medium' | 'low';

export interface Call {
  id: string;
  phoneNumber: string;
  type: CallType;
  status: CallStatus;
  duration: number;
  aiConfidence: number;
  urgency: CallUrgency;
  timestamp?: Date;
  description?: string;
}

export class CallEntity implements Call {
  constructor(
    public id: string,
    public phoneNumber: string,
    public type: CallType,
    public status: CallStatus,
    public duration: number,
    public aiConfidence: number,
    public urgency: CallUrgency,
    public timestamp: Date = new Date(),
    public description?: string
  ) {}

  isUrgent(): boolean {
    return this.urgency === 'high' || this.duration > 300;
  }

  needsIntervention(): boolean {
    return this.aiConfidence < 70 || this.duration > 300;
  }

  updateDuration(seconds: number): void {
    this.duration = seconds;
    this.updateUrgency();
  }

  private updateUrgency(): void {
    if (this.duration > 300) {
      this.urgency = 'high';
    } else if (this.duration > 150) {
      this.urgency = 'medium';
    } else {
      this.urgency = 'low';
    }
  }

  reclassify(newType: CallType): void {
    this.type = newType;
  }

  changeStatus(newStatus: CallStatus): void {
    this.status = newStatus;
  }
}
