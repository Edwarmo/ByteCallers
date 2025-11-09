import { Call } from '../../../core/domain/entities/Call';
import { services } from '../../ServiceContainer';

export class CallController {
  constructor() {}

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
    await services.repositories.calls.save(call);
    return call;
  }

  async getAllCalls(): Promise<Call[]> {
    return await services.repositories.calls.findAll();
  }

  async acceptCall(callId: string): Promise<void> {
    const call = await services.repositories.calls.findById(callId);
    if (call) {
      call.status = 'active';
      await services.repositories.calls.update(call);
    }
  }

  async completeCall(callId: string): Promise<void> {
    const call = await services.repositories.calls.findById(callId);
    if (call) {
      call.status = 'completed';
      await services.repositories.calls.update(call);
    }
  }

  async getCallsByType(type: Call['type']): Promise<Call[]> {
    const allCalls = await services.repositories.calls.findAll();
    return allCalls.filter(call => call.type === type);
  }
}
