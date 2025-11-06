import { Call, CallClassification } from '../../types/Call';

export class CallModel {
  private calls: Call[] = [];
  private classifications: CallClassification[] = [
    { keywords: ['problema', 'error', 'falla', 'no funciona'], type: 'technical' },
    { keywords: ['consulta', 'información', 'ayuda', 'pregunta'], type: 'support' }
  ];

  addCall(phoneNumber: string, description?: string): Call {
    const call: Call = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
      type: this.classifyCall(description || ''),
      status: 'waiting',
      description
    };
    
    this.calls.push(call);
    return call;
  }

  private classifyCall(description: string): 'support' | 'technical' | 'pending' {
    const lowerDesc = description.toLowerCase();
    
    for (const classification of this.classifications) {
      if (classification.keywords.some(keyword => lowerDesc.includes(keyword))) {
        return classification.type;
      }
    }
    
    return 'pending';
  }

  getCalls(): Call[] {
    return this.calls;
  }

  updateCallStatus(id: string, status: Call['status']): void {
    const call = this.calls.find(c => c.id === id);
    if (call) {
      call.status = status;
    }
  }
}
