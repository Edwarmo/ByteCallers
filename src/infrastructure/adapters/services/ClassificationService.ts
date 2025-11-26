// Adapter - Classification Service using FastAPI
import { apiClient } from '../api/ApiClient';

// Tipos para la respuesta de la API de clasificación
export interface ClassificationResponse {
  categoria: string;
  confianza: number;
  recomendacion_agente: string;
}

export interface ClassificationRequest {
  descripcion: string;
}

export class ClassificationService {
  /**
   * Clasifica una llamada por descripción textual usando IA
   */
  async classifyCall(descripcion: string): Promise<{ 
    success: boolean; 
    data?: ClassificationResponse; 
    error?: string 
  }> {
    try {
      if (!descripcion || descripcion.trim() === '') {
        return { 
          success: false, 
          error: 'Por favor, proporciona una descripción de la llamada' 
        };
      }

      const requestData: ClassificationRequest = {
        descripcion: descripcion.trim(),
      };

      console.log('Clasificando llamada:', { descripcion: requestData.descripcion });

      const response = await apiClient.post<ClassificationResponse>(
        '/api/clasificaciones-ia/clasificar-texto',
        requestData,
        true // Incluir token de autenticación
      );

      if (response.error) {
        console.error('Error en clasificación:', response.error);
        return { 
          success: false, 
          error: response.error 
        };
      }

      if (response.data) {
        console.log('Clasificación exitosa:', response.data);
        return { 
          success: true, 
          data: response.data 
        };
      }

      return { 
        success: false, 
        error: 'No se recibió respuesta de la API' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Excepción en clasificación:', error);
      return { 
        success: false, 
        error: `Error de conexión: ${errorMessage}` 
      };
    }
  }
}

