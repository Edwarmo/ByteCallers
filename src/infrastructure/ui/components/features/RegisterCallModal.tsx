import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface RegisterCallModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    numero_cliente: string;
    duracion_segundos: number;
    tipo: string;
    resultado: string;
  }) => Promise<boolean>;
}

const CALL_TYPES = [
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'soporte', label: 'Soporte' },
  { value: 'venta', label: 'Venta' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'logistica', label: 'Logística' },
];

const CALL_RESULTS = [
  { value: 'resuelta', label: 'Resuelta', color: '#10b981' },
  { value: 'pendiente', label: 'Pendiente', color: '#f59e0b' },
  { value: 'colgada', label: 'Colgada', color: '#ef4444' },
  { value: 'fallida', label: 'Fallida', color: '#64748b' },
];

export const RegisterCallModal: React.FC<RegisterCallModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [numeroCliente, setNumeroCliente] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState('');
  const [duracionSegundos, setDuracionSegundos] = useState('');
  const [tipo, setTipo] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!numeroCliente.trim()) {
      newErrors.numeroCliente = 'El número de cliente es requerido';
    } else if (!/^\+?[\d\s-()]+$/.test(numeroCliente.trim())) {
      newErrors.numeroCliente = 'Formato de teléfono inválido';
    }

    if (!duracionMinutos.trim() && !duracionSegundos.trim()) {
      newErrors.duracion = 'La duración es requerida';
    } else {
      const minutos = parseInt(duracionMinutos) || 0;
      const segundos = parseInt(duracionSegundos) || 0;
      if (minutos < 0 || segundos < 0 || segundos >= 60) {
        newErrors.duracion = 'Duración inválida';
      }
      if (minutos === 0 && segundos === 0) {
        newErrors.duracion = 'La duración debe ser mayor a 0';
      }
    }

    if (!tipo) {
      newErrors.tipo = 'El tipo de llamada es requerido';
    }

    if (!resultado) {
      newErrors.resultado = 'El resultado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const minutos = parseInt(duracionMinutos) || 0;
      const segundos = parseInt(duracionSegundos) || 0;
      const duracionTotalSegundos = minutos * 60 + segundos;

      const success = await onSubmit({
        numero_cliente: numeroCliente.trim(),
        duracion_segundos: duracionTotalSegundos,
        tipo,
        resultado,
      });

      if (success) {
        // Limpiar formulario
        setNumeroCliente('');
        setDuracionMinutos('');
        setDuracionSegundos('');
        setTipo('');
        setResultado('');
        setErrors({});
        onClose();
      }
    } catch (error) {
      console.error('Error al registrar llamada:', error);
      Alert.alert('Error', 'No se pudo registrar la llamada. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNumeroCliente('');
      setDuracionMinutos('');
      setDuracionSegundos('');
      setTipo('');
      setResultado('');
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>📞 Registrar Nueva Llamada</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                disabled={loading}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Número de Cliente */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Número de Cliente <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.numeroCliente && styles.inputError]}
                  placeholder="Ej: +57 300 123 4567"
                  placeholderTextColor="#94a3b8"
                  value={numeroCliente}
                  onChangeText={(text) => {
                    setNumeroCliente(text);
                    if (errors.numeroCliente) {
                      setErrors({ ...errors, numeroCliente: '' });
                    }
                  }}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
                {errors.numeroCliente && (
                  <Text style={styles.errorText}>{errors.numeroCliente}</Text>
                )}
              </View>

              {/* Duración */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Duración <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.durationContainer}>
                  <View style={styles.durationInputWrapper}>
                    <TextInput
                      style={[styles.durationInput, errors.duracion && styles.inputError]}
                      placeholder="Min"
                      placeholderTextColor="#94a3b8"
                      value={duracionMinutos}
                      onChangeText={(text) => {
                        setDuracionMinutos(text.replace(/[^0-9]/g, ''));
                        if (errors.duracion) {
                          setErrors({ ...errors, duracion: '' });
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={3}
                      editable={!loading}
                    />
                    <Text style={styles.durationLabel}>min</Text>
                  </View>
                  <View style={styles.durationSeparator} />
                  <View style={styles.durationInputWrapper}>
                    <TextInput
                      style={[styles.durationInput, errors.duracion && styles.inputError]}
                      placeholder="Seg"
                      placeholderTextColor="#94a3b8"
                      value={duracionSegundos}
                      onChangeText={(text) => {
                        const val = text.replace(/[^0-9]/g, '');
                        if (parseInt(val) < 60) {
                          setDuracionSegundos(val);
                        }
                        if (errors.duracion) {
                          setErrors({ ...errors, duracion: '' });
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                      editable={!loading}
                    />
                    <Text style={styles.durationLabel}>seg</Text>
                  </View>
                </View>
                {errors.duracion && (
                  <Text style={styles.errorText}>{errors.duracion}</Text>
                )}
              </View>

              {/* Tipo de Llamada */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Tipo de Llamada <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.optionsContainer}>
                  {CALL_TYPES.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        tipo === option.value && styles.optionButtonSelected,
                        loading && styles.optionButtonDisabled,
                      ]}
                      onPress={() => {
                        setTipo(option.value);
                        if (errors.tipo) {
                          setErrors({ ...errors, tipo: '' });
                        }
                      }}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          tipo === option.value && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.tipo && (
                  <Text style={styles.errorText}>{errors.tipo}</Text>
                )}
              </View>

              {/* Resultado */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Resultado <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.resultsContainer}>
                  {CALL_RESULTS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.resultButton,
                        resultado === option.value && [
                          styles.resultButtonSelected,
                          { borderColor: option.color, backgroundColor: `${option.color}15` },
                        ],
                        loading && styles.resultButtonDisabled,
                      ]}
                      onPress={() => {
                        setResultado(option.value);
                        if (errors.resultado) {
                          setErrors({ ...errors, resultado: '' });
                        }
                      }}
                      disabled={loading}
                    >
                      <View
                        style={[
                          styles.resultDot,
                          { backgroundColor: option.color },
                          resultado === option.value && styles.resultDotSelected,
                        ]}
                      />
                      <Text
                        style={[
                          styles.resultText,
                          resultado === option.value && styles.resultTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.resultado && (
                  <Text style={styles.errorText}>{errors.resultado}</Text>
                )}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Registrar Llamada</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  durationInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    padding: 0,
  },
  durationLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  durationSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  optionButtonSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f3f4f6',
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  resultButtonSelected: {
    borderWidth: 2,
  },
  resultButtonDisabled: {
    opacity: 0.5,
  },
  resultDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultDotSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  resultText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  resultTextSelected: {
    color: '#1e293b',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

