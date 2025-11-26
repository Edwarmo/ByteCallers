import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ClassificationService, ClassificationResponse } from '../../../adapters/services/ClassificationService';

interface CallClassificationModalProps {
  visible: boolean;
  onClose: () => void;
  onClassificationComplete?: (result: ClassificationResponse) => void;
}

export const CallClassificationModal: React.FC<CallClassificationModalProps> = ({
  visible,
  onClose,
  onClassificationComplete,
}) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const classificationService = new ClassificationService();

  const handleClassify = async () => {
    if (!description.trim()) {
      setError('Por favor, describe lo sucedido en la llamada');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await classificationService.classifyCall(description);

      if (response.success && response.data) {
        setResult(response.data);
        if (onClassificationComplete) {
          onClassificationComplete(response.data);
        }
      } else {
        setError(response.error || 'Error al clasificar la llamada');
      }
    } catch (err) {
      setError('Error inesperado. Por favor, intenta nuevamente.');
      console.error('Error en handleClassify:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setResult(null);
    setError(null);
    onClose();
  };

  const handleNewClassification = () => {
    setDescription('');
    setResult(null);
    setError(null);
  };

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'reclamo': '#f43f5e',
      'consulta': '#3b82f6',
      'soporte': '#8b5cf6',
      'venta': '#10b981',
      'tecnico': '#f59e0b',
    };
    return colors[categoria.toLowerCase()] || '#64748b';
  };

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'reclamo': 'Reclamo',
      'consulta': 'Consulta',
      'soporte': 'Soporte',
      'venta': 'Venta',
      'tecnico': 'Técnico',
    };
    return labels[categoria.toLowerCase()] || categoria;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🤖 Clasificar Llamada con IA</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!result ? (
              <>
                <Text style={styles.label}>
                  Describe lo sucedido en la llamada:
                </Text>
                <TextInput
                  style={[styles.textArea, error && styles.textAreaError]}
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    setError(null);
                  }}
                  placeholder="Ej: Cliente reportó problema con su pedido, está molesto y solicita reembolso inmediato..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  editable={!loading}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.classifyButton, loading && styles.buttonDisabled]}
                  onPress={handleClassify}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.classifyButtonText}>
                      🎯 Clasificar Llamada
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>✅ Clasificación Completada</Text>

                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Categoría:</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(result.categoria) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: getCategoryColor(result.categoria) },
                        ]}
                      >
                        {getCategoryLabel(result.categoria)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Nivel de Confianza:</Text>
                    <View style={styles.confidenceContainer}>
                      <View style={styles.confidenceBar}>
                        <View
                          style={[
                            styles.confidenceFill,
                            {
                              width: `${result.confianza * 100}%`,
                              backgroundColor: result.confianza >= 0.8 ? '#10b981' : result.confianza >= 0.6 ? '#f59e0b' : '#f43f5e',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.confidenceText}>
                        {(result.confianza * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>💡 Recomendación para el Agente:</Text>
                    <Text style={styles.recommendationText}>
                      {result.recomendacion_agente}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.newButton}
                    onPress={handleNewClassification}
                  >
                    <Text style={styles.newButtonText}>🔄 Nueva Clasificación</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.closeButtonText}>✓ Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    minHeight: 120,
    marginBottom: 16,
  },
  textAreaError: {
    borderColor: '#f43f5e',
  },
  errorText: {
    color: '#f43f5e',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  classifyButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  classifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    minWidth: 50,
  },
  recommendationText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  newButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  newButtonText: {
    color: '#8b5cf6',
    fontSize: 15,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

