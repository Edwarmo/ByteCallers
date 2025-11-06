import { Ticket, TicketCategory, TicketStatus, TicketPriority, TicketHistoryEntry } from '../model';

export class BaseTicket implements Ticket {
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

    constructor(id: string, title: string, description: string, customerId?: string, customerName?: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.customerId = customerId;
        this.customerName = customerName;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = 'new';
        this.history = [{
            id: 'hist-0',
            timestamp: new Date(),
            action: 'Ticket created',
            user: 'System',
            description: `Ticket created with title: ${title}`
        }];
    }
}

export class SupportTicket extends BaseTicket {
    constructor(id: string, title: string, description: string, customerId?: string, customerName?: string) {
        super(id, title, description, customerId, customerName);
        this.category = 'support';
        this.priority = 'medium';
    }
}

export class ComplaintsTicket extends BaseTicket {
    constructor(id: string, title: string, description: string, customerId?: string, customerName?: string) {
        super(id, title, description, customerId, customerName);
        this.category = 'complaints';
        this.priority = 'high';
    }
}

export class SalesTicket extends BaseTicket {
    constructor(id: string, title: string, description: string, customerId?: string, customerName?: string) {
        super(id, title, description, customerId, customerName);
        this.category = 'sales';
        this.priority = 'low';
    }
}