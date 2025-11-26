// Adapter - Metrics Service using FastAPI
import { apiClient } from '../api/ApiClient';
import { Call } from './CallService';

export interface Metric {
  id: number;
  fecha: string;
  llamadas_totales?: number;
  llamadas_resueltas?: number;
  tiempo_promedio?: number;
  satisfaccion?: number;
  [key: string]: any;
}

export interface MonthlySatisfaction {
  month: string;
  monthLabel: string;
  satisfaction: number;
  callsResolved: number;
  totalCalls: number;
}

export class MetricsService {
  /**
   * Obtiene métricas de la API
   */
  async getMetrics(skip: number = 0, limit: number = 100): Promise<{ 
    success: boolean; 
    data?: Metric[]; 
    error?: string 
  }> {
    try {
      const response = await apiClient.get<Metric[]>(
        `/api/metricas/?skip=${skip}&limit=${limit}`,
        true
      );

      if (response.error) {
        console.error('Error obteniendo métricas:', response.error);
        return { 
          success: false, 
          error: response.error 
        };
      }

      if (response.data) {
        const metrics = Array.isArray(response.data) ? response.data : [];
        return { 
          success: true, 
          data: metrics 
        };
      }

      return { 
        success: false, 
        error: 'No se recibieron datos de métricas' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { 
        success: false, 
        error: `Error de conexión: ${errorMessage}` 
      };
    }
  }

  /**
   * Calcula satisfacción mensual basada en las llamadas
   * Usa la tasa de resolución como indicador de satisfacción
   */
  calculateMonthlySatisfaction(calls: Call[]): MonthlySatisfaction[] {
    if (!calls || calls.length === 0) {
      return this.getEmptyMonthlyData();
    }

    // Agrupar llamadas por mes
    const callsByMonth = new Map<string, { total: number; resolved: number }>();
    
    calls.forEach(call => {
      if (call.fecha_hora) {
        const date = new Date(call.fecha_hora);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('es-ES', { month: 'short' });
        
        if (!callsByMonth.has(monthKey)) {
          callsByMonth.set(monthKey, { total: 0, resolved: 0 });
        }
        
        const monthData = callsByMonth.get(monthKey)!;
        monthData.total++;
        
        if (call.resultado && call.resultado.toLowerCase() === 'resuelta') {
          monthData.resolved++;
        }
      }
    });

    // Convertir a array y calcular satisfacción
    const monthlyData: MonthlySatisfaction[] = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Obtener los últimos 6 meses
    const sortedMonths = Array.from(callsByMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    sortedMonths.forEach(([monthKey, data]) => {
      const date = new Date(monthKey + '-01');
      const monthIndex = date.getMonth();
      
      // Calcular satisfacción basada en tasa de resolución
      // Convertimos el porcentaje (0-100%) a escala 1-5
      // 100% resolución = 5.0, 50% = 3.0, 0% = 1.0
      const resolutionRate = data.total > 0 ? (data.resolved / data.total) : 0;
      const satisfaction = 1 + (resolutionRate * 4); // Escala de 1 a 5

      monthlyData.push({
        month: monthKey,
        monthLabel: monthNames[monthIndex],
        satisfaction: Math.round(satisfaction * 10) / 10, // Redondear a 1 decimal
        callsResolved: data.resolved,
        totalCalls: data.total,
      });
    });

    // Si hay menos de 6 meses, completar con datos vacíos al inicio
    while (monthlyData.length < 6) {
      const firstMonth = monthlyData.length > 0 
        ? new Date(monthlyData[0].month + '-01')
        : new Date();
      
      const prevMonth = new Date(firstMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      
      const monthIndex = prevMonth.getMonth();
      monthlyData.unshift({
        month: `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`,
        monthLabel: monthNames[monthIndex],
        satisfaction: 0,
        callsResolved: 0,
        totalCalls: 0,
      });
    }

    return monthlyData.slice(-6); // Solo los últimos 6 meses
  }

  /**
   * Retorna datos vacíos para 6 meses
   */
  private getEmptyMonthlyData(): MonthlySatisfaction[] {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const today = new Date();
    
    return monthNames.map((label, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
      return {
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        monthLabel: label,
        satisfaction: 0,
        callsResolved: 0,
        totalCalls: 0,
      };
    });
  }

  /**
   * Calcula el promedio de satisfacción
   */
  calculateAverageSatisfaction(monthlyData: MonthlySatisfaction[]): number {
    if (!monthlyData || monthlyData.length === 0) {
      return 0;
    }

    const validMonths = monthlyData.filter(m => m.totalCalls > 0);
    if (validMonths.length === 0) {
      return 0;
    }

    const sum = validMonths.reduce((acc, month) => acc + month.satisfaction, 0);
    return Math.round((sum / validMonths.length) * 10) / 10;
  }
}

