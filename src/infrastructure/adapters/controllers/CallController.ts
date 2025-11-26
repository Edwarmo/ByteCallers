import { Call } from '../../../core/domain/entities/Call';
import { ICallRepository } from '../../../core/domain/ports/repositories/ICallRepository';

export class CallController {
  constructor(private callRepository: ICallRepository) {}

  async handleIncomingCall(phoneNumber: string, description?: string): Promise<Call> {
    const call: Call = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
      type: 'Ventas',
      status: 'active',
      duration: 0,
      aiConfidence: 50,
      urgency: 'low',
      description
    };
    await this.callRepository.save(call);
    return call;
  }

  async getAllCalls(): Promise<Call[]> {
    return await this.callRepository.findAll();
  }

  async acceptCall(callId: string): Promise<void> {
    const call = await this.callRepository.findById(callId);
    if (call) {
      call.status = 'active';
      await this.callRepository.update(call);
    }
  }

  async completeCall(callId: string): Promise<void> {
    const call = await this.callRepository.findById(callId);
    if (call) {
      call.status = 'completed';
      await this.callRepository.update(call);
    }
  }

  async getCallsByType(type: Call['type']): Promise<Call[]> {
    const allCalls = await this.callRepository.findAll();
    return allCalls.filter(call => call.type === type);
  }
}
