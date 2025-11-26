// Use Case - Update Call Context
import { ICallRepository } from '../../../domain/ports/repositories/ICallRepository';

export interface CallContext {
  callId: string;
  phoneNumber: string;
  type: string;
  duration: number;
  aiConfidence: number;
  problem: string;
}

export class UpdateContextUseCase {
  constructor(private callRepository: ICallRepository) {}

  async execute(context: CallContext): Promise<void> {
    const call = await this.callRepository.findById(context.callId);
    
    if (!call) {
      throw new Error('Call not found');
    }

    // Update call with new context information
    call.duration = context.duration;
    call.aiConfidence = context.aiConfidence;
    call.description = context.problem;
    
    await this.callRepository.update(call);
  }
}
