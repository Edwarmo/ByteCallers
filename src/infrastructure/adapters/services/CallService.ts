import { Call } from '../../../core/domain/entities/Call';
import { BaseService } from './BaseService';

export interface IncomingCallData {
  id: string;
  phoneNumber: string;
  audioStreamUrl?: string;
  metadata?: Record<string, any>;
}

export class CallService extends BaseService {
  protected serviceName = 'CallService';
  private activeCall: Call | null = null;
  private isMuted: boolean = false;
  private isOnHold: boolean = false;

  private CallControls = class {
    constructor(
      private service: CallService
    ) {}

    async mute(): Promise<void> {
      this.service.isMuted = true;
      this.service.log('Call muted');
    }

    async unmute(): Promise<void> {
      this.service.isMuted = false;
      this.service.log('Call unmuted');
    }

    async hold(): Promise<void> {
      this.service.isOnHold = true;
      if (this.service.activeCall) {
        this.service.activeCall.status = 'on-hold';
      }
      this.service.log('Call on hold');
    }

    async resume(): Promise<void> {
      this.service.isOnHold = false;
      if (this.service.activeCall) {
        this.service.activeCall.status = 'active';
      }
      this.service.log('Call resumed');
    }

    async hangup(): Promise<void> {
      if (this.service.activeCall) {
        this.service.activeCall.status = 'completed';
      }
      this.service.activeCall = null;
      this.service.isMuted = false;
      this.service.isOnHold = false;
      this.service.log('Call ended');
    }

    async transfer(targetNumber: string): Promise<void> {
      if (this.service.activeCall) {
        this.service.activeCall.status = 'transferring';
      }
      this.service.log(`Transferring call to ${targetNumber}`);
    }
  };

  async receiveCall(data: IncomingCallData): Promise<Call> {
    return this.executeWithLogging('receiveCall', async () => {
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
    });
  }

  getControls() {
    return new this.CallControls(this);
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
