import { Ticket, TicketCategory } from './model';
import { SupportTicket, ComplaintsTicket, SalesTicket } from './model/index';

export class TicketFactory {
    public static createTicket(
        category: TicketCategory,
        id: string,
        title: string,
        description: string,
        customerId?: string,
        customerName?: string
    ): Ticket {
        switch (category) {
            case 'support':
                return new SupportTicket(id, title, description, customerId, customerName);
            case 'complaints':
                return new ComplaintsTicket(id, title, description, customerId, customerName);
            case 'sales':
                return new SalesTicket(id, title, description, customerId, customerName);
            default:
                throw new Error(`Ticket category ${category} not supported.`);
        }
    }
}
