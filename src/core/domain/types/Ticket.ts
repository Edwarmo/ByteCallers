export type TicketCategory = 'support' | 'complaints' | 'sales';
export type TicketStatus = 'new' | 'in_progress' | 'pending_user' | 'waiting_third_party' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketHistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  previousStatus?: TicketStatus;
  newStatus?: TicketStatus;
  description: string;
}

export interface Ticket {
  id: string;
  customerId?: string;
  customerName?: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  slaDeadline?: Date;
  history: TicketHistoryEntry[];
}

export interface TicketStats {
  total: number;
  byCategory: Record<TicketCategory, number>;
  byStatus: Record<TicketStatus, number>;
  urgent: number;
}
