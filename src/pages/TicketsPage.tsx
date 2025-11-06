import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User } from '../business/entities/user/model';
import { AIAssistant } from './call/AI/AIAssistant';
import { APIButtonController } from './call/AI/APIButtonController';
import { SessionWarningModal } from '../shared/ui/SessionWarningModal';

interface TicketsPageProps {
  user: User | null;
  onBack: () => void;
  onLogout: () => void;
}

interface CallAI {
  id: string;
  phoneNumber: string;
  type: 'Ventas' | 'Soporte Técnico' | 'Reclamación';
  status: 'active' | 'on-hold' | 'transferring';
  duration: number;
  aiConfidence: number;
  urgency: 'high' | 'medium' | 'low';
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ user, onBack, onLogout }) => {
  const [calls, setCalls] = useState<CallAI[]>([]);
  const [interventions, setInterventions] = useState<Set<string>>(new Set());
  const [takenCases, setTakenCases] = useState<Set<string>>(new Set());
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [pendingCallId, setPendingCallId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const mockCalls: CallAI[] = [
      { id: '001', phoneNumber: '+57 300 111 2222', type: 'Ventas', status: 'active', duration: 345, aiConfidence: 65, urgency: 'high' },
      { id: '002', phoneNumber: '+57 301 222 3333', type: 'Soporte Técnico', status: 'active', duration: 189, aiConfidence: 72, urgency: 'high' },
      { id: '003', phoneNumber: '+57 302 333 4444', type: 'Reclamación', status: 'on-hold', duration: 534, aiConfidence: 58, urgency: 'high' },
      { id: '004', phoneNumber: '+57 303 444 5555', type: 'Ventas', status: 'active', duration: 56, aiConfidence: 91, urgency: 'low' },
    ].sort((a, b) => {
      if (a.urgency === 'high' && b.urgency !== 'high') return -1;
      if (a.urgency !== 'high' && b.urgency === 'high') return 1;
      return b.duration - a.duration;
    });
    
    setCalls(mockCalls);
    
    const interval = setInterval(() => {
      setCalls(prev => prev.map(call => ({
        ...call,
        duration: call.duration + 1,
        urgency: call.duration > 300 ? 'high' : call.duration > 150 ? 'medium' : 'low'
      })).sort((a, b) => {
        if (a.urgency === 'high' && b.urgency !== 'high') return -1;
        if (a.urgency !== 'high' && b.urgency === 'high') return 1;
        return b.duration - a.duration;
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const sendCallContext = (callId: string) => {
    const call = calls.find(c => c.id === callId);
    if (call) {
      const callProblems: Record<string, { problem: string; progress: string; issue: string; customerData: string }> = {
        '001': {
          problem: 'consulta sobre promociones vigentes y descuentos especiales',
          progress: 'Le he explicado las 3 promociones activas: 20% en productos seleccionados, 2x1 en categoría hogar, y envío gratis por compras mayores a $50.000',
          issue: 'El cliente está indeciso entre dos productos y necesita asesoría personalizada sobre cuál se ajusta mejor a sus necesidades',
          customerData: 'Nombre: Juan Pérez\nTel: +57 300 111 2222\nHistorial: 3 compras previas\nCliente frecuente'
        },
        '002': {
          problem: 'error técnico al iniciar sesión en la plataforma',
          progress: 'He verificado que el correo está registrado y he enviado un enlace de recuperación de contraseña',
          issue: 'El cliente no recibe el correo de recuperación. Posible problema con filtros de spam o correo bloqueado',
          customerData: 'Nombre: María García\nTel: +57 301 222 3333\nEmail: maria.g@email.com\nÚltimo acceso: hace 2 días'
        },
        '003': {
          problem: 'reclamación por cobro duplicado en su tarjeta de crédito',
          progress: 'He verificado el sistema y confirmé que efectivamente hay un cargo duplicado por $125.000 del 15 de enero',
          issue: 'El cliente está muy molesto y exige reembolso inmediato. Requiere autorización de supervisor para procesar devolución',
          customerData: 'Nombre: Carlos López\nTel: +57 302 333 4444\nTarjeta: **** 4567\nMonto duplicado: $125.000'
        },
        '004': {
          problem: 'consulta sobre estado de pedido #ORD-2025-0145',
          progress: 'He confirmado que el pedido fue despachado ayer y está en tránsito. Número de guía: GU123456789',
          issue: 'Cliente solicita cambiar dirección de entrega porque no estará en casa mañana',
          customerData: 'Nombre: Ana Martínez\nTel: +57 303 444 5555\nPedido: #ORD-2025-0145\nValor: $89.900'
        },
      };

      const callData = callProblems[callId] || {
        problem: 'consulta general',
        progress: 'Atendiendo solicitud del cliente',
        issue: 'Requiere asistencia adicional',
        customerData: 'Información no disponible'
      };

      APIButtonController.sendCallInfoToChatbot({
        callId: callId,
        phoneNumber: call.phoneNumber,
        type: call.type,
        duration: call.duration,
        aiConfidence: call.aiConfidence,
        problem: `Hola, buen día. Esta llamada trata sobre ${callData.problem}.\n\nLlevo ayudándolo con: ${callData.progress}\n\nNo he podido resolver porque: ${callData.issue}\n\nEstos son los datos del cliente:\n${callData.customerData}`
      });
    }
  };

  const handleIntervene = (callId: string) => {
    if (activeCallId && activeCallId !== callId) {
      setPendingCallId(callId);
      setShowWarning(true);
      return;
    }

    setActiveCallId(callId);
    setInterventions(prev => new Set(prev).add(callId));
    sendCallContext(callId);
  };

  const handleCallAction = (callId: string, action: string) => {
    console.log(`Acción ${action} en llamada:`, callId);
  };

  const handleReclassify = (callId: string, newType: CallAI['type']) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, type: newType } : call
    ));
  };

  const handleTakeCase = (id: string) => {
    if (activeCallId && activeCallId !== id) {
      setPendingCallId(id);
      setShowWarning(true);
      return;
    }

    setActiveCallId(id);
    setTakenCases(prev => new Set(prev).add(id));
  };

  const handleAbandonCall = () => {
    if (activeCallId) {
      setInterventions(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeCallId);
        return newSet;
      });
    }
    
    setShowWarning(false);
    if (pendingCallId) {
      setActiveCallId(pendingCallId);
      setInterventions(prev => new Set(prev).add(pendingCallId));
      setPendingCallId(null);
    }
  };

  const handleCancelSwitch = () => {
    setShowWarning(false);
    setPendingCallId(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'on-hold': return '#F59E0B';
      case 'transferring': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getCallStatusText = (status: string) => {
    switch (status) {
      case 'active': return '🤖 IA Activa';
      case 'on-hold': return '⏸️ En Espera';
      case 'transferring': return '🔄 Transfiriendo';
      default: return 'Desconocido';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Sistema de Tickets y Llamadas</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>🚨 Llamadas Urgentes (IA)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.callsScroll}>
          {calls.map((call) => (
            <View key={call.id} style={[styles.callCard, takenCases.has(call.id) && styles.callCardTaken]}>
              <View style={styles.callHeader}>
                <Text style={styles.callId}>#{call.id}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(call.urgency) }]}>
                  <Text style={styles.urgencyText}>{call.urgency === 'high' ? '🚨 URGENTE' : call.urgency === 'medium' ? '⚠️ MEDIA' : '✅ BAJA'}</Text>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: getCallStatusColor(call.status) }]}>
                <Text style={styles.statusText}>{getCallStatusText(call.status)}</Text>
              </View>

              <View style={styles.callBody}>
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
                  <Text style={[styles.value, call.duration > 300 && styles.valueUrgent]}>{formatDuration(call.duration)}</Text>
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
                  style={[styles.interveneButton, takenCases.has(call.id) && styles.buttonDisabled]}
                  onPress={() => !takenCases.has(call.id) && handleIntervene(call.id)}
                >
                  <Text style={styles.interveneButtonText}>{takenCases.has(call.id) ? '✓ Tomado' : 'Intervenir'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.controlsContainer}>
                  <TouchableOpacity
                    style={styles.recontextButton}
                    onPress={() => sendCallContext(call.id)}
                  >
                    <Text style={styles.recontextButtonText}>🔄 Actualizar Contexto IA</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.controlsTitle}>Controles</Text>
                  <View style={styles.callControls}>
                    <TouchableOpacity style={styles.controlBtn} onPress={() => handleCallAction(call.id, 'mute')}>
                      <Text style={styles.controlBtnText}>🔇</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlBtn} onPress={() => handleCallAction(call.id, 'hold')}>
                      <Text style={styles.controlBtnText}>⏸️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={() => handleCallAction(call.id, 'end')}>
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

                  <TouchableOpacity
                    style={[styles.takeButton, takenCases.has(call.id) && styles.buttonDisabled]}
                    onPress={() => handleTakeCase(call.id)}
                  >
                    <Text style={styles.takeButtonText}>{takenCases.has(call.id) ? '✓ Caso Tomado' : '✅ Tomar Caso'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <AIAssistant />
      
      <SessionWarningModal
        visible={showWarning}
        currentCallId={activeCallId || ''}
        newCallId={pendingCallId || ''}
        onAbandon={handleAbandonCall}
        onCancel={handleCancelSwitch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  topTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  backBtn: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  callsScroll: {
    gap: 16,
    paddingBottom: 8,
  },
  callCard: {
    width: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  callCardTaken: {
    opacity: 0.6,
    borderColor: '#10b981',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  callId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  callBody: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  valueUrgent: {
    color: '#ef4444',
    fontWeight: '700',
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
    backgroundColor: '#e2e8f0',
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
    color: '#1e293b',
    minWidth: 40,
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
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  controlsContainer: {
    gap: 12,
  },
  controlsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  callControls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: '#e2e8f0',
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
    marginBottom: 12,
  },
  classifyBtn: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  classifyBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  classifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  classifyBtnTextActive: {
    color: '#ffffff',
  },
  takeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  takeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  recontextButton: {
    backgroundColor: '#22d3ee',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  recontextButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});
