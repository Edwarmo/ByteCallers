import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface SessionWarningModalProps {
  visible: boolean;
  currentCallId: string;
  newCallId: string;
  onAbandon: () => void;
  onCancel: () => void;
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  visible,
  currentCallId,
  newCallId,
  onAbandon,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Llamada en Curso</Text>
          <Text style={styles.message}>
            Ya tienes una llamada activa (#{currentCallId}).{'\n\n'}
            ¿Deseas abandonarla y que la IA continúe?
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.abandonBtn} onPress={onAbandon}>
              <Text style={styles.abandonText}>🤖 Abandonar y que IA continúe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>❌ Cancelar y seguir en llamada</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
  abandonBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  abandonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelBtn: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
});
