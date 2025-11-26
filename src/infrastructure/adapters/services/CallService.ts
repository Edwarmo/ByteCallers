// Adapter - Call Service using FastAPI
import { apiClient } from '../api/ApiClient';

// Tipos para las llamadas de la API
export interface Call {
  id: number;
  numero_cliente: string;
  duracion_segundos: number;
  tipo: string;
  resultado: string;
  usuario_id: number;
  fecha_hora: string;
}

export interface CallsResponse {
  calls: Call[];
  total: number;
}

export class CallService {
  /**
   * Obtiene la lista de llamadas con paginación
   */
  async getCalls(skip: number = 0, limit: number = 100): Promise<{ 
    success: boolean; 
    data?: Call[]; 
    error?: string 
  }> {
    try {
      const response = await apiClient.get<Call[]>(
        `/api/llamadas/?skip=${skip}&limit=${limit}`,
        true // Incluir token de autenticación
      );

      if (response.error) {
        console.error('Error obteniendo llamadas:', response.error);
        return { 
          success: false, 
          error: response.error 
        };
      }

      if (response.data) {
        // La API puede devolver un array directamente
        const calls = Array.isArray(response.data) ? response.data : [];
        console.log(`Llamadas obtenidas: ${calls.length}`);
        return { 
          success: true, 
          data: calls 
        };
      }

      return { 
        success: false, 
        error: 'No se recibieron datos de la API' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Excepción obteniendo llamadas:', error);
      return { 
        success: false, 
        error: `Error de conexión: ${errorMessage}` 
      };
    }
  }

  /**
   * Calcula estadísticas de las llamadas
   */
  calculateStats(calls: Call[]): {
    totalCalls: number;
    averageDuration: number;
    averageDurationFormatted: string;
    resolutionRate: number;
    resolutionRateFormatted: string;
    resolvedCalls: number;
    successRate: number;
    successRateFormatted: string;
  } {
    if (!calls || calls.length === 0) {
      return {
        totalCalls: 0,
        averageDuration: 0,
        averageDurationFormatted: '0:00',
        resolutionRate: 0,
        resolutionRateFormatted: '0%',
        resolvedCalls: 0,
        successRate: 0,
        successRateFormatted: '0%',
      };
    }

    const totalCalls = calls.length;
    const totalDuration = calls.reduce((sum, call) => sum + (call.duracion_segundos || 0), 0);
    const averageDuration = totalDuration / totalCalls;

    // Formatear duración promedio como MM:SS
    const minutes = Math.floor(averageDuration / 60);
    const seconds = Math.floor(averageDuration % 60);
    const averageDurationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calcular tasa de resolución (llamadas resueltas vs total)
    const resolvedCalls = calls.filter(call => 
      call.resultado && call.resultado.toLowerCase() === 'resuelta'
    ).length;
    const resolutionRate = totalCalls > 0 ? (resolvedCalls / totalCalls) * 100 : 0;
    const resolutionRateFormatted = `${resolutionRate.toFixed(0)}%`;

    // Calcular tasa de éxito (llamadas resueltas vs colgadas/fallidas)
    const failedCalls = calls.filter(call => 
      call.resultado && (call.resultado.toLowerCase() === 'colgada' || call.resultado.toLowerCase() === 'fallida')
    ).length;
    const totalProcessedCalls = resolvedCalls + failedCalls;
    const successRate = totalProcessedCalls > 0 ? (resolvedCalls / totalProcessedCalls) * 100 : 0;
    const successRateFormatted = `${successRate.toFixed(1)}`;

    return {
      totalCalls,
      averageDuration,
      averageDurationFormatted,
      resolutionRate,
      resolutionRateFormatted,
      resolvedCalls,
      successRate,
      successRateFormatted,
    };
  }

  /**
   * Crea una nueva llamada en la API
   */
  async createCall(callData: {
    numero_cliente: string;
    duracion_segundos: number;
    tipo: string;
    resultado: string;
    usuario_id: number;
  }): Promise<{ 
    success: boolean; 
    data?: Call; 
    error?: string 
  }> {
    try {
      const response = await apiClient.post<Call>(
        '/api/llamadas/',
        callData,
        true // Incluir token de autenticación
      );

      if (response.error) {
        console.error('Error creando llamada:', response.error);
        
        // Manejar errores de validación de FastAPI (422)
        let errorMessage: string;
        
        if (Array.isArray(response.error)) {
          // Si es un array de errores de validación (formato FastAPI)
          const errorMessages = response.error.map((err: any) => {
            const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'campo';
            const msg = err.msg || 'Error de validación';
            return `${field}: ${msg}`;
          });
          errorMessage = errorMessages.join('. ');
        } else if (typeof response.error === 'object' && response.error !== null) {
          // Si el error es un objeto, intentar extraer el mensaje
          if ('detail' in response.error) {
            const detail = (response.error as any).detail;
            if (Array.isArray(detail) && detail.length > 0) {
              // Si es un array de errores de validación
              const errorMessages = detail.map((err: any) => {
                const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : 'campo';
                const msg = err.msg || 'Error de validación';
                return `${field}: ${msg}`;
              });
              errorMessage = errorMessages.join('. ');
            } else if (typeof detail === 'string') {
              errorMessage = detail;
            } else {
              errorMessage = JSON.stringify(detail);
            }
          } else if ('message' in response.error) {
            errorMessage = (response.error as any).message;
          } else {
            errorMessage = JSON.stringify(response.error);
          }
        } else if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else {
          errorMessage = 'Error desconocido al crear la llamada';
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }

      if (response.data) {
        console.log('Llamada creada exitosamente:', response.data);
        return { 
          success: true, 
          data: response.data 
        };
      }

      return { 
        success: false, 
        error: 'No se recibieron datos de la API' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Excepción creando llamada:', error);
      return { 
        success: false, 
        error: `Error de conexión: ${errorMessage}` 
      };
    }
  }

  /**
   * Genera insights dinámicos basados en los datos de las llamadas
   */
  generateInsights(calls: Call[], serviceStats: Array<{
    service: string;
    serviceLabel: string;
    rating: number;
    cases: number;
    resolution: string;
    resolutionRate: number;
  }>, stats: {
    totalCalls: number;
    averageDuration: number;
    resolutionRate: number;
    successRate: number;
  }): Array<{
    icon: string;
    title: string;
    desc: string;
    type: 'positive' | 'warning' | 'success' | 'info';
  }> {
    try {
      const insights: Array<{
        icon: string;
        title: string;
        desc: string;
        type: 'positive' | 'warning' | 'success' | 'info';
      }> = [];

      if (!calls || calls.length === 0 || !serviceStats || serviceStats.length === 0) {
        return [
          {
            icon: '📊',
            title: 'Sin Datos',
            desc: 'No hay suficientes datos para generar insights. Registra más llamadas para ver análisis.',
            type: 'info',
          },
        ];
      }

    // 1. Tendencia Positiva: Servicio con mejor tasa de resolución
    const bestService = serviceStats
      .filter(s => s.cases >= 3) // Mínimo 3 casos para ser relevante
      .sort((a, b) => b.resolutionRate - a.resolutionRate)[0];
    
    if (bestService && bestService.resolutionRate >= 80) {
      insights.push({
        icon: '📈',
        title: 'Tendencia Positiva',
        desc: `El servicio "${bestService.serviceLabel}" tiene una excelente tasa de resolución del ${bestService.resolutionRate.toFixed(0)}% con ${bestService.cases} casos.`,
        type: 'positive',
      });
    }

    // 2. Atención Requerida: Servicio con menor tasa de resolución o mayor duración
    const worstService = serviceStats
      .filter(s => s.cases >= 3)
      .sort((a, b) => a.resolutionRate - b.resolutionRate)[0];
    
    if (worstService && worstService.resolutionRate < 70) {
      insights.push({
        icon: '⚠️',
        title: 'Atención Requerida',
        desc: `El servicio "${worstService.serviceLabel}" tiene una tasa de resolución del ${worstService.resolutionRate.toFixed(0)}%, por debajo del objetivo del 70%.`,
        type: 'warning',
      });
    }

    // 3. Meta Alcanzada: Resolución en primer contacto
    if (stats.resolutionRate >= 85) {
      insights.push({
        icon: '🎯',
        title: 'Meta Alcanzada',
        desc: `Resolución en primer contacto: ${stats.resolutionRate.toFixed(0)}%. Has superado el objetivo del 85%.`,
        type: 'success',
      });
    } else if (stats.resolutionRate >= 75) {
      insights.push({
        icon: '📊',
        title: 'Cerca de la Meta',
        desc: `Resolución en primer contacto: ${stats.resolutionRate.toFixed(0)}%. Estás a ${(85 - stats.resolutionRate).toFixed(0)}% del objetivo.`,
        type: 'info',
      });
    }

    // 4. Recomendación IA: Análisis de patrones
    // Analizar distribución por hora del día
    const callsByHour = new Map<number, number>();
    calls.forEach(call => {
      if (call.fecha_hora) {
        try {
          const date = new Date(call.fecha_hora);
          const hour = date.getHours();
          callsByHour.set(hour, (callsByHour.get(hour) || 0) + 1);
        } catch (e) {
          // Ignorar fechas inválidas
        }
      }
    });

    if (callsByHour.size > 0) {
      const peakHour = Array.from(callsByHour.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      if (peakHour && peakHour[1] >= 3) {
        const hourLabel = peakHour[0] < 12 
          ? `${peakHour[0]}:00 AM` 
          : peakHour[0] === 12 
            ? '12:00 PM' 
            : `${peakHour[0] - 12}:00 PM`;
        const nextHour = peakHour[0] + 1;
        const nextHourLabel = nextHour < 12 
          ? `${nextHour}:00 AM` 
          : nextHour === 12 
            ? '12:00 PM' 
            : `${nextHour - 12}:00 PM`;
        
        insights.push({
          icon: '💡',
          title: 'Recomendación IA',
          desc: `Hora pico detectada: ${hourLabel}-${nextHourLabel} con ${peakHour[1]} llamadas. Considera reforzar el equipo en este horario.`,
          type: 'info',
        });
      }
    }

    // Si no hay suficientes insights, agregar uno genérico
    if (insights.length === 0) {
      insights.push({
        icon: '📊',
        title: 'Análisis en Progreso',
        desc: `Se han registrado ${stats.totalCalls} llamadas. Continúa registrando datos para obtener insights más detallados.`,
        type: 'info',
      });
    }

      // Limitar a 4 insights máximo
      return insights.slice(0, 4);
    } catch (error) {
      console.error('Error generando insights:', error);
      // Retornar un insight de error en lugar de fallar completamente
      return [
        {
          icon: '⚠️',
          title: 'Error en Análisis',
          desc: 'Hubo un problema al generar los insights. Los datos se están cargando correctamente.',
          type: 'warning',
        },
      ];
    }
  }

  /**
   * Calcula estadísticas agrupadas por tipo de servicio
   */
  calculateServiceStats(calls: Call[]): Array<{
    service: string;
    serviceLabel: string;
    rating: number;
    cases: number;
    resolution: string;
    resolutionRate: number;
  }> {
    if (!calls || calls.length === 0) {
      return [];
    }

    // Mapeo de tipos de la API a etiquetas en español
    const serviceLabels: Record<string, string> = {
      'reclamo': 'Atención',
      'consulta': 'Atención',
      'soporte': 'Soporte',
      'venta': 'Ventas',
      'tecnico': 'Técnico',
      'logistica': 'Logística',
      'logística': 'Logística',
    };

    // Agrupar llamadas por tipo
    const callsByService = new Map<string, { total: number; resolved: number }>();

    calls.forEach(call => {
      const serviceType = (call.tipo || '').toLowerCase();
      if (!serviceType) return;

      if (!callsByService.has(serviceType)) {
        callsByService.set(serviceType, { total: 0, resolved: 0 });
      }

      const serviceData = callsByService.get(serviceType)!;
      serviceData.total++;

      if (call.resultado && call.resultado.toLowerCase() === 'resuelta') {
        serviceData.resolved++;
      }
    });

    // Convertir a array y calcular métricas
    const serviceStats = Array.from(callsByService.entries()).map(([serviceType, data]) => {
      const resolutionRate = data.total > 0 ? (data.resolved / data.total) * 100 : 0;
      
      // Calcular rating basado en tasa de resolución (escala 1-5)
      // 100% resolución = 5.0, 80% = 4.2, 60% = 3.4, etc.
      const rating = Math.round((1 + (resolutionRate / 100) * 4) * 10) / 10;
      
      // Limitar rating entre 1.0 y 5.0
      const finalRating = Math.max(1.0, Math.min(5.0, rating));

      return {
        service: serviceType,
        serviceLabel: serviceLabels[serviceType] || serviceType.charAt(0).toUpperCase() + serviceType.slice(1),
        rating: finalRating,
        cases: data.total,
        resolution: `${resolutionRate.toFixed(0)}%`,
        resolutionRate,
      };
    });

    // Ordenar por cantidad de casos (mayor a menor)
    return serviceStats.sort((a, b) => b.cases - a.cases);
  }
}
