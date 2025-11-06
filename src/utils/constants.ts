import { TicketCategory, TicketStatus, TicketPriority } from '../types/Ticket';

export const TICKET_COLORS = {
  new: '#4FC3F7',
  in_progress: '#FFB300',
  pending_user: '#AB47BC',
  waiting_third_party: '#78909C',
  resolved: '#4CAF50',
  closed: '#0288D1'
};

export const PRIORITY_COLORS = {
  low: '#81C784',
  medium: '#FFB74D',
  high: '#FF8A65',
  urgent: '#F44336'
};

export const CATEGORY_ICONS = {
  support: '⚙️',
  complaints: '⚠️',
  sales: '🛒'
};

export const STATUS_ICONS = {
  new: '🆕',
  in_progress: '⏳',
  pending_user: '👤',
  waiting_third_party: '⏸️',
  resolved: '✅',
  closed: '🔒'
};

export const CATEGORY_LABELS = {
  support: 'Soporte Técnico',
  complaints: 'Quejas y Reclamos',
  sales: 'Ventas'
};

export const STATUS_LABELS = {
  new: 'Nuevo',
  in_progress: 'En Progreso',
  pending_user: 'Pendiente de Usuario',
  waiting_third_party: 'Esperando Tercero',
  resolved: 'Resuelto',
  closed: 'Cerrado'
};
