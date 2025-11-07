import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CallAI {
  id: string;
  phoneNumber: string;
  type: 'Ventas' | 'Soporte Técnico' | 'Reclamación';
  status: 'active' | 'on-hold' | 'transferring';
  duration: number;
  aiConfidence: number;
}

export const LlamadasIA: React.FC = () => {
  const [calls, setCalls] = useState<CallAI[]>([]);
  const [interventions, setInterventions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mock: Llamadas siendo atendidas por IA
    const mockCalls: CallAI[] = [
      { id: '001', phoneNumber: '+57 300 111 2222', type: 'Ventas', status: 'active', duration: 145, aiConfidence: 95 },
      { id: '002', phoneNumber: '+57 301 222 3333', type: 'Soporte Técnico', status: 'active', duration: 89, aiConfidence: 87 },
      { id: '003', phoneNumber: '+57 302 333 4444', type: 'Reclamación', status: 'on-hold', duration: 234, aiConfidence: 72 },
      { id: '004', phoneNumber: '+57 303 444 5555', type: 'Ventas', status: 'active', duration: 56, aiConfidence: 91 },
    ];
    
    setCalls(mockCalls);
    
    // Actualizar duración cada segundo
    const interval = setInterval(() => {
      setCalls(prev => prev.map(call => ({
        ...call,
        duration: call.duration + 1,
      })));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleIntervene = (callId: string) => {
    setInterventions(prev => new Set(prev).add(callId));
  };

  const handleCallAction = (callId: string, action: string) => {
    console.log(`Acción ${action} en llamada:`, callId);
  };

  const handleReclassify = (callId: string, newType: CallAI['type']) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, type: newType } : call
    ));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'on-hold': return '#F59E0B';
      case 'transferring': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '🤖 IA Activa';
      case 'on-hold': return '⏸️ En Espera';
      case 'transferring': return '🔄 Transfiriendo';
      default: return 'Desconocido';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Llamadas Atendidas por IA</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {calls.map((call) => (
          <View key={call.id} style={styles.ticket}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>Ticket #{call.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(call.status) }]}>
                <Text style={styles.statusText}>{getStatusText(call.status)}</Text>
              </View>
            </View>

            <View style={styles.ticketBody}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>📞 Teléfono</Text>
                <Text style={styles.value}>{call.phoneNumber}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>📋 Tipo</Text>
                <Text style={styles.value}>{call.type}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>⏱️ Duración</Text>
                <Text style={styles.value}>{formatDuration(call.duration)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>🤖 Confianza IA</Text>
                <View style={styles.confidenceContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${call.aiConfidence}%`,
                          backgroundColor: call.aiConfidence > 80 ? '#10B981' : call.aiConfidence > 60 ? '#F59E0B' : '#EF4444'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.confidenceText}>{call.aiConfidence}%</Text>
                </View>
              </View>
            </View>

            {!interventions.has(call.id) ? (
              <TouchableOpacity
                style={styles.interveneButton}
                onPress={() => handleIntervene(call.id)}
              >
                <Text style={styles.interveneButtonText}>Intervenir</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.controlsContainer}>
                <Text style={styles.controlsTitle}>Controles de Llamada</Text>
                <View style={styles.callControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => handleCallAction(call.id, 'mute')}
                  >
                    <Text style={styles.controlBtnText}>🔇</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => handleCallAction(call.id, 'hold')}
                  >
                    <Text style={styles.controlBtnText}>⏸️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlBtn, styles.endCallBtn]}
                    onPress={() => handleCallAction(call.id, 'end')}
                  >
                    <Text style={styles.controlBtnText}>📞</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.controlsTitle}>Reclasificar</Text>
                <View style={styles.classifyButtons}>
                  <TouchableOpacity
                    style={[styles.classifyBtn, call.type === 'Ventas' && styles.classifyBtnActive]}
                    onPress={() => handleReclassify(call.id, 'Ventas')}
                  >
                    <Text style={[styles.classifyBtnText, call.type === 'Ventas' && styles.classifyBtnTextActive]}>💰 Ventas</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.classifyBtn, call.type === 'Soporte Técnico' && styles.classifyBtnActive]}
                    onPress={() => handleReclassify(call.id, 'Soporte Técnico')}
                  >
                    <Text style={[styles.classifyBtnText, call.type === 'Soporte Técnico' && styles.classifyBtnTextActive]}>🔧 Soporte</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.classifyBtn, call.type === 'Reclamación' && styles.classifyBtnActive]}
                    onPress={() => handleReclassify(call.id, 'Reclamación')}
                  >
                    <Text style={[styles.classifyBtnText, call.type === 'Reclamación' && styles.classifyBtnTextActive]}>⚠️ Reclamo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 8,
  },
  ticket: {
    width: 280,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  ticketBody: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    minWidth: 40,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  interveneButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  interveneButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  controlsContainer: {
    gap: 12,
  },
  controlsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  callControls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  endCallBtn: {
    backgroundColor: '#ef4444',
  },
  controlBtnText: {
    fontSize: 18,
  },
  classifyButtons: {
    gap: 6,
  },
  classifyBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  classifyBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  classifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  classifyBtnTextActive: {
    color: '#ffffff',
  },
});
