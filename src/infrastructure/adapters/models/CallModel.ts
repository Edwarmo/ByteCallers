import { Call, CallType } from '../../../core/domain/entities/Call';

interface CallClassification {
  keywords: string[];
  type: CallType;
}

export class CallModel {
  private calls: Call[] = [];
  private classifications: CallClassification[] = [
    { keywords: ['problema', 'error', 'falla', 'no funciona'], type: 'Soporte Técnico' },
    { keywords: ['comprar', 'precio', 'venta', 'producto'], type: 'Ventas' },
    { keywords: ['queja', 'reclamo', 'insatisfecho'], type: 'Reclamación' }
  ];

  addCall(phoneNumber: string, description?: string): Call {
    const call: Call = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
      type: this.classifyCall(description || ''),
      status: 'active',
      duration: 0,
      aiConfidence: 50,
      urgency: 'low',
      description
    };
    
    this.calls.push(call);
    return call;
  }

  private classifyCall(description: string): CallType {
    const lowerDesc = description.toLowerCase();
    
    for (const classification of this.classifications) {
      if (classification.keywords.some((keyword: string) => lowerDesc.includes(keyword))) {
        return classification.type;
      }
    }
    
    return 'Soporte Técnico';
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