// Domain Entity - Ticket
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

export class TicketEntity implements Ticket {
  constructor(
    public id: string,
    public category: TicketCategory,
    public status: TicketStatus,
    public priority: TicketPriority,
    public title: string,
    public description: string,
    public createdAt: Date,
    public updatedAt: Date,
    public history: TicketHistoryEntry[],
    public customerId?: string,
    public customerName?: string,
    public assignedTo?: string,
    public slaDeadline?: Date
  ) {}

  changeStatus(newStatus: TicketStatus, user: string, description: string): void {
    const historyEntry: TicketHistoryEntry = {
      id: `${Date.now()}`,
      timestamp: new Date(),
      action: 'status_change',
      user,
      previousStatus: this.status,
      newStatus,
      description,
    };
    
    this.status = newStatus;
    this.updatedAt = new Date();
    this.history.push(historyEntry);
  }

  assignTo(userId: string, userName: string): void {
    this.assignedTo = userId;
    this.updatedAt = new Date();
    this.history.push({
      id: `${Date.now()}`,
      timestamp: new Date(),
      action: 'assignment',
      user: userName,
      description: `Ticket assigned to ${userName}`,
    });
  }

  isOverdue(): boolean {
    if (!this.slaDeadline) return false;
    return new Date() > this.slaDeadline;
  }

  escalate(): void {
    if (this.priority === 'low') this.priority = 'medium';
    else if (this.priority === 'medium') this.priority = 'high';
    else if (this.priority === 'high') this.priority = 'urgent';
    
    this.updatedAt = new Date();
  }
}
