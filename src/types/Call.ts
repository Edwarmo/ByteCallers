export interface Call {
  id: string;
  phoneNumber: string;
  timestamp: Date;
  type: 'support' | 'technical' | 'pending';
  status: 'active' | 'completed' | 'waiting';
  description?: string;
}

export interface CallClassification {
  keywords: string[];
  type: 'support' | 'technical';
}
