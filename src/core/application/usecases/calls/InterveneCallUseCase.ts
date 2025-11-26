// Use Case - Intervene in Call
import { ICallRepository } from '../../../domain/ports/repositories/ICallRepository';
import { CallEntity } from '../../../domain/entities/Call';

export class InterveneCallUseCase {
  constructor(private callRepository: ICallRepository) {}

  async execute(callId: string, agentId: string): Promise<void> {
    const call = await this.callRepository.findById(callId);
    
    if (!call) {
      throw new Error('Call not found');
    }

    const callEntity = new CallEntity(
      call.id,
      call.phoneNumber,
      call.type,
      call.status,
      call.duration,
      call.aiConfidence,
      call.urgency,
      call.timestamp,
      call.description
    );

    // Change status to indicate agent intervention
    callEntity.changeStatus('on-hold');
    
    await this.callRepository.update(callEntity);
  }
}
