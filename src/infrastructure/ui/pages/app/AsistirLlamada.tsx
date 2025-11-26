import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CallStatus = 'waiting' | 'active' | 'ended';
type ButtonAction = 'answer' | 'hold' | 'transfer' | 'mute' | 'end';

interface CallData {
  id: string;
  phoneNumber: string;
  type: 'Ventas' | 'Soporte Técnico' | 'Reclamación';
  duration: number;
}

export const AsistirLlamada: React.FC = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>('waiting');
  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  useEffect(() => {
    // Simular llamada entrante desde API
    const mockCall: CallData = {
      id: '12345',
      phoneNumber: '+57 300 123 4567',
      type: 'Ventas',
      duration: 0,
    };
    
    // Descomentar cuando API esté lista
    // fetchIncomingCall().then(setCurrentCall);
    
    // Mock para desarrollo
    setTimeout(() => {
      setCurrentCall(mockCall);
      setCallStatus('waiting');
    }, 2000);
  }, []);

  const handleAction = (action: ButtonAction) => {
    switch (action) {
      case 'answer':
        setCallStatus('active');
        // API: Responder llamada
        console.log('Llamada respondida');
        break;
      case 'hold':
        setIsOnHold(!isOnHold);
        // API: Poner en espera
        console.log('Llamada en espera:', !isOnHold);
        break;
      case 'transfer':
        // API: Transferir llamada
        console.log('Transferir llamada');
        break;
      case 'mute':
        setIsMuted(!isMuted);
        // API: Silenciar micrófono
        console.log('Micrófono silenciado:', !isMuted);
        break;
      case 'end':
        setCallStatus('ended');
        setCurrentCall(null);
        setIsMuted(false);
        setIsOnHold(false);
        // API: Finalizar llamada
        console.log('Llamada finalizada');
        break;
    }
  };

  if (!currentCall) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingCard}>
          <Text style={styles.waitingIcon}>📞</Text>
          <Text style={styles.waitingText}>Esperando llamada...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.callCard}>
        <View style={styles.callHeader}>
          <View style={[styles.statusBadge, callStatus === 'active' && styles.statusActive]}>
            <Text style={styles.statusText}>
              {callStatus === 'waiting' ? '🔔 Entrante' : '📞 En llamada'}
            </Text>
          </View>
          <Text style={styles.callType}>{currentCall.type}</Text>
        </View>

        <View style={styles.callInfo}>
          <Text style={styles.phoneNumber}>{currentCall.phoneNumber}</Text>
          <Text style={styles.callId}>ID: {currentCall.id}</Text>
        </View>

        {callStatus === 'waiting' && (
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => handleAction('answer')}
          >
            <Text style={styles.answerButtonText}>📞 Responder</Text>
          </TouchableOpacity>
        )}

        {callStatus === 'active' && (
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, isOnHold && styles.actionButtonActive]}
              onPress={() => handleAction('hold')}
            >
              <Text style={styles.actionIcon}>⏸️</Text>
              <Text style={styles.actionText}>{isOnHold ? 'Reanudar' : 'Espera'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAction('transfer')}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>Transferir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, isMuted && styles.actionButtonActive]}
              onPress={() => handleAction('mute')}
            >
              <Text style={styles.actionIcon}>{isMuted ? '🔇' : '🎤'}</Text>
              <Text style={styles.actionText}>{isMuted ? 'Activar' : 'Silenciar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.endButton]}
              onPress={() => handleAction('end')}
            >
              <Text style={styles.actionIcon}>📵</Text>
              <Text style={styles.actionText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  waitingCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  waitingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  callCard: {
    gap: 20,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  callType: {
    fontSize: 14,
    color: '#22D3EE',
    fontWeight: '600',
  },
  callInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  callId: {
    fontSize: 12,
    color: '#94A3B8',
  },
  answerButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  actionButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  endButton: {
    backgroundColor: '#7F1D1D',
    borderColor: '#EF4444',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
