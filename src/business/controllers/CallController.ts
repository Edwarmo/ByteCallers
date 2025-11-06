import { CallModel } from '../models/CallModel';
import { Call } from '../../types/Call';

export class CallController {
  private callModel: CallModel;

  constructor() {
    this.callModel = new CallModel();
  }

  handleIncomingCall(phoneNumber: string, description?: string): Call {
    return this.callModel.addCall(phoneNumber, description);
  }

  getAllCalls(): Call[] {
    return this.callModel.getCalls();
  }

  acceptCall(callId: string): void {
    this.callModel.updateCallStatus(callId, 'active');
  }

  completeCall(callId: string): void {
    this.callModel.updateCallStatus(callId, 'completed');
  }

  getCallsByType(type: Call['type']): Call[] {
    return this.callModel.getCalls().filter(call => call.type === type);
  }
}
