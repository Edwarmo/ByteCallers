import { Call } from '../../../core/domain/entities/Call';

export interface IncomingCallData {
  id: string;
  phoneNumber: string;
  audioStreamUrl?: string;
  metadata?: Record<string, any>;
}

export interface CallControls {
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  hold: () => Promise<void>;
  resume: () => Promise<void>;
  hangup: () => Promise<void>;
  transfer: (targetNumber: string) => Promise<void>;
}

export class CallService {
  private activeCall: Call | null = null;
  private isMuted: boolean = false;
  private isOnHold: boolean = false;

  async receiveCall(data: IncomingCallData): Promise<Call> {
    const call: Call = {
      id: data.id,
      phoneNumber: data.phoneNumber,
      type: 'Ventas',
      status: 'active',
      duration: 0,
      aiConfidence: 50,
      urgency: 'low',
      timestamp: new Date(),
    };
    
    this.activeCall = call;
    return call;
  }

  getControls(): CallControls {
    return {
      mute: async () => {
        this.isMuted = true;
        console.log('Call muted');
      },
      unmute: async () => {
        this.isMuted = false;
        console.log('Call unmuted');
      },
      hold: async () => {
        this.isOnHold = true;
        if (this.activeCall) {
          this.activeCall.status = 'on-hold';
        }
        console.log('Call on hold');
      },
      resume: async () => {
        this.isOnHold = false;
        if (this.activeCall) {
          this.activeCall.status = 'active';
        }
        console.log('Call resumed');
      },
      hangup: async () => {
        if (this.activeCall) {
          this.activeCall.status = 'completed';
        }
        this.activeCall = null;
        this.isMuted = false;
        this.isOnHold = false;
        console.log('Call ended');
      },
      transfer: async (targetNumber: string) => {
        if (this.activeCall) {
          this.activeCall.status = 'transferring';
        }
        console.log(`Transferring call to ${targetNumber}`);
      },
    };
  }

  getActiveCall(): Call | null {
    return this.activeCall;
  }

  isMutedStatus(): boolean {
    return this.isMuted;
  }

  isOnHoldStatus(): boolean {
    return this.isOnHold;
  }
}
