import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { User } from '../../../../core/domain/entities/User';
import { TicketsPage } from './TicketsPage';
import { SatisfactionChart } from '../../components/features/SatisfactionChart';
import { ServicesChart } from '../../components/features/ServicesChart';
import { PerformanceChart } from '../../components/features/PerformanceChart';
import { CallClassificationModal } from '../../components/features/CallClassificationModal';
import { RegisterCallModal } from '../../components/features/RegisterCallModal';
import { ClassificationResponse } from '../../../adapters/services/ClassificationService';
import { CallService } from '../../../adapters/services/CallService';
import { StorageUtils } from '../../../../shared/utils/storage';

interface CallCenterPageProps {
  user: User | null;
  onLogout: () => void;
}

export const CallCenterPage: React.FC<CallCenterPageProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tickets'>('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('30');
  const [selectedService, setSelectedService] = useState('Todos');
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [showRegisterCallModal, setShowRegisterCallModal] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [averageDuration, setAverageDuration] = useState('0:00');
  const [resolutionRate, setResolutionRate] = useState('0%');
  const [successRate, setSuccessRate] = useState('0.0');
  const [serviceStats, setServiceStats] = useState<Array<{
    service: string;
    serviceLabel: string;
    rating: number;
    cases: number;
    resolution: string;
    resolutionRate: number;
  }>>([]);
  const [insights, setInsights] = useState<Array<{
    icon: string;
    title: string;
    desc: string;
    type: 'positive' | 'warning' | 'success' | 'info';
  }>>([
    {
      icon: '📊',
      title: 'Cargando Datos',
      desc: 'Analizando información para generar insights...',
      type: 'info',
    },
  ]);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const callService = new CallService();

  // Cargar datos de llamadas al montar el componente
  useEffect(() => {
    loadCallsData();
  }, [selectedFilter]);

  const loadCallsData = async () => {
    setLoadingCalls(true);
    try {
      const response = await callService.getCalls(0, 100);
      
      if (response.success && response.data) {
        setCalls(response.data);
        const stats = callService.calculateStats(response.data);
        const serviceStatsData = callService.calculateServiceStats(response.data);
        
        // Generar insights de forma segura
        let generatedInsights;
        try {
          generatedInsights = callService.generateInsights(response.data, serviceStatsData, stats);
        } catch (error) {
          console.error('Error generando insights:', error);
          generatedInsights = [{
            icon: '📊',
            title: 'Datos Cargados',
            desc: `Se han cargado ${response.data.length} llamadas correctamente.`,
            type: 'info',
          }];
        }
        
        setTotalCalls(stats.totalCalls);
        setAverageDuration(stats.averageDurationFormatted);
        setResolutionRate(stats.resolutionRateFormatted);
        setSuccessRate(stats.successRateFormatted);
        setServiceStats(serviceStatsData);
        setInsights(generatedInsights);
      } else {
        console.error('Error cargando llamadas:', response.error);
        // Mantener valores por defecto en caso de error
        setCalls([]);
        setTotalCalls(0);
        setAverageDuration('0:00');
        setResolutionRate('0%');
        setSuccessRate('0.0');
        setServiceStats([]);
        setInsights([{
          icon: '📊',
          title: 'Sin Datos',
          desc: 'No se pudieron cargar los datos. Verifica tu conexión.',
          type: 'info',
        }]);
      }
    } catch (error) {
      console.error('Excepción cargando llamadas:', error);
      setCalls([]);
      setTotalCalls(0);
      setAverageDuration('0:00');
      setResolutionRate('0%');
      setSuccessRate('0.0');
      setServiceStats([]);
      setInsights([{
        icon: '⚠️',
        title: 'Error de Conexión',
        desc: 'No se pudieron cargar los datos. Verifica tu conexión a internet.',
        type: 'warning',
      }]);
    } finally {
      setLoadingCalls(false);
    }
  };

  // Formatear número con comas para miles
  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES');
  };

  // Manejar registro de nueva llamada
  const handleRegisterCall = async (callData: {
    numero_cliente: string;
    duracion_segundos: number;
    tipo: string;
    resultado: string;
  }): Promise<boolean> => {
    try {
      // Obtener el ID del usuario desde el storage si no está en el prop
      let usuarioId: number | null = null;
      
      if (user && user.id) {
        usuarioId = parseInt(user.id, 10);
      }
      
      // Si no se pudo obtener del prop, intentar obtenerlo del storage
      if (!usuarioId || isNaN(usuarioId)) {
        try {
          const userData = await StorageUtils.getItem('current_user');
          if (userData) {
            const parsed = JSON.parse(userData);
            if (parsed.id) {
              usuarioId = parseInt(parsed.id, 10);
            }
          }
        } catch (error) {
          console.error('Error obteniendo usuario del storage:', error);
        }
      }

      // Validar que tengamos un ID válido
      if (!usuarioId || isNaN(usuarioId)) {
        Alert.alert(
          '❌ Error',
          'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.',
          [{ text: 'OK', style: 'default' }]
        );
        return false;
      }

      // Incluir el usuario_id en los datos de la llamada
      // Asegurarse de que todos los campos estén en el formato correcto
      const callDataWithUserId = {
        numero_cliente: callData.numero_cliente.trim(),
        duracion_segundos: Number(callData.duracion_segundos),
        tipo: callData.tipo.trim().toLowerCase(),
        resultado: callData.resultado.trim().toLowerCase(),
        usuario_id: Number(usuarioId),
      };

      // Validar que todos los campos requeridos estén presentes y sean válidos
      if (!callDataWithUserId.numero_cliente) {
        Alert.alert('❌ Error', 'El número de cliente es requerido.', [{ text: 'OK' }]);
        return false;
      }
      if (!callDataWithUserId.duracion_segundos || callDataWithUserId.duracion_segundos <= 0) {
        Alert.alert('❌ Error', 'La duración debe ser mayor a 0.', [{ text: 'OK' }]);
        return false;
      }
      if (!callDataWithUserId.tipo) {
        Alert.alert('❌ Error', 'El tipo de llamada es requerido.', [{ text: 'OK' }]);
        return false;
      }
      if (!callDataWithUserId.resultado) {
        Alert.alert('❌ Error', 'El resultado es requerido.', [{ text: 'OK' }]);
        return false;
      }
      if (!callDataWithUserId.usuario_id || isNaN(callDataWithUserId.usuario_id)) {
        Alert.alert('❌ Error', 'El ID de usuario es inválido.', [{ text: 'OK' }]);
        return false;
      }

      console.log('Creando llamada con datos:', {
        numero_cliente: callDataWithUserId.numero_cliente.substring(0, 4) + '****',
        duracion_segundos: callDataWithUserId.duracion_segundos,
        tipo: callDataWithUserId.tipo,
        resultado: callDataWithUserId.resultado,
        usuario_id: callDataWithUserId.usuario_id,
      });

      const response = await callService.createCall(callDataWithUserId);
      
      if (response.success) {
        // Recargar datos para actualizar gráficas
        await loadCallsData();
        
        // Mostrar notificación de éxito
        Alert.alert(
          '✅ Llamada Registrada',
          'La llamada se ha registrado exitosamente. Los datos del dashboard se han actualizado.',
          [{ text: 'OK', style: 'default' }]
        );
        
        return true;
      } else {
        console.error('Error registrando llamada:', response.error);
        Alert.alert(
          '❌ Error',
          response.error || 'No se pudo registrar la llamada. Por favor intenta nuevamente.',
          [{ text: 'OK', style: 'default' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Excepción registrando llamada:', error);
      Alert.alert(
        '❌ Error',
        'Ocurrió un error al registrar la llamada. Por favor intenta nuevamente.',
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    }
  };

  const kpis = [
    { 
      icon: '📞', 
      title: 'Llamadas Totales', 
      value: loadingCalls ? '...' : formatNumber(totalCalls), 
      trend: '+5.2%', 
      trendUp: true 
    },
    { 
      icon: '⏱️', 
      title: 'Tiempo Promedio', 
      value: loadingCalls ? '...' : averageDuration, 
      trend: '-8.1%', 
      trendUp: true 
    },
    { 
      icon: '✅', 
      title: 'Resolución 1er Contacto', 
      value: loadingCalls ? '...' : resolutionRate, 
      trend: '+3.4%', 
      trendUp: true 
    },
    { 
      icon: '⭐', 
      title: 'Tasa de Éxito', 
      value: loadingCalls ? '...' : `${successRate}%`, 
      trend: '+2.1%', 
      trendUp: true 
    },
  ];

  // Los insights ahora se generan dinámicamente desde los datos de la API
  // Se actualizan automáticamente cuando cambian los datos de las llamadas

  // Usar datos reales de la API o datos por defecto si no hay datos
  const tableData = serviceStats.length > 0 
    ? serviceStats.map(stat => ({
        service: stat.serviceLabel,
        rating: stat.rating,
        cases: stat.cases,
        resolution: stat.resolution,
      }))
    : [
        { service: 'Atención', rating: 0, cases: 0, resolution: '0%' },
        { service: 'Técnico', rating: 0, cases: 0, resolution: '0%' },
        { service: 'Ventas', rating: 0, cases: 0, resolution: '0%' },
        { service: 'Soporte', rating: 0, cases: 0, resolution: '0%' },
        { service: 'Logística', rating: 0, cases: 0, resolution: '0%' },
      ];

  if (currentView === 'tickets') {
    return <TicketsPage user={user} onBack={() => setCurrentView('dashboard')} onLogout={onLogout} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={isMobile && styles.headerTitleMobile}>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>Panel de Agente</Text>
          <Text style={styles.subtitle}>{user?.phoneNumber} • {user?.role}</Text>
        </View>
        <View style={[styles.headerActions, isMobile && styles.headerActionsMobile]}>
          <TouchableOpacity 
            style={styles.registerCallBtn} 
            onPress={() => setShowRegisterCallModal(true)}
          >
            <Text style={styles.registerCallBtnText}>
              {isMobile ? '📞' : '📞 Registrar Llamada'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.classifyBtn} 
            onPress={() => setShowClassificationModal(true)}
          >
            <Text style={styles.classifyBtnText}>
              {isMobile ? '🤖' : '🤖 Clasificar Llamada'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ticketsBtn} onPress={() => setCurrentView('tickets')}>
            <Text style={styles.ticketsBtnText}>{isMobile ? '🎫' : '🎫 Tickets y Control de llamadas'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>{isMobile ? 'Salir' : 'Cerrar Sesión'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Filters Bar */}
        <View style={[styles.filtersBar, isMobile && styles.filtersBarMobile]}>
          <View style={styles.filterGroup}>
            {['Hoy', '7', '30'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterBtn, selectedFilter === filter && styles.filterBtnActive]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                  {filter === 'Hoy' ? 'Hoy' : `${filter}d`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!isMobile && (
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Tipo: {selectedService}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {kpis.map((kpi, index) => (
            <View key={index} style={[styles.kpiCard, isMobile && styles.kpiCardMobile]}>
              <Text style={styles.kpiIcon}>{kpi.icon}</Text>
              <Text style={[styles.kpiTitle, isMobile && styles.kpiTitleMobile]}>{kpi.title}</Text>
              {loadingCalls && (index === 0 || index === 1) ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#8b5cf6" />
                </View>
              ) : (
                <Text style={[styles.kpiValue, isMobile && styles.kpiValueMobile]}>{kpi.value}</Text>
              )}
              <View style={styles.trendContainer}>
                <Text style={[styles.trendText, kpi.trendUp && styles.trendUp]}>
                  {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Main Grid Layout */}
        <View style={[styles.mainGrid, (isMobile || isTablet) && styles.mainGridMobile]}>
          {/* Left/Center Area - Charts */}
          <View style={styles.chartsArea}>
            <SatisfactionChart calls={calls} loading={loadingCalls} />
            
            <View style={[styles.chartsRow, isMobile && styles.chartsRowMobile]}>
              <ServicesChart serviceStats={serviceStats} loading={loadingCalls} />
              <PerformanceChart serviceStats={serviceStats} loading={loadingCalls} />
            </View>

            {/* Summary Table */}
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>Resumen por Servicio</Text>
              {loadingCalls ? (
                <View style={styles.tableLoadingContainer}>
                  <ActivityIndicator size="small" color="#8b5cf6" />
                  <Text style={styles.tableLoadingText}>Cargando datos...</Text>
                </View>
              ) : tableData.length > 0 ? (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Servicio</Text>
                    <Text style={styles.tableHeaderText}>Calificación</Text>
                    <Text style={styles.tableHeaderText}>Casos</Text>
                    <Text style={styles.tableHeaderText}>Resolución</Text>
                  </View>
                  {tableData.map((row, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>{row.service}</Text>
                      <Text style={styles.tableCell}>⭐ {row.rating.toFixed(1)}</Text>
                      <Text style={styles.tableCell}>{formatNumber(row.cases)}</Text>
                      <Text style={[styles.tableCell, styles.tableCellHighlight]}>{row.resolution}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.tableEmptyContainer}>
                  <Text style={styles.tableEmptyText}>No hay datos disponibles</Text>
                </View>
              )}
            </View>
          </View>

          {/* Right Sidebar - Insights Panel */}
          {!isMobile && (
            <View style={styles.insightsPanel}>
              <Text style={styles.insightsTitle}>Insights Clave</Text>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightCard}>
                  <Text style={styles.insightIcon}>{insight.icon}</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightDesc}>{insight.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Clasificación de Llamadas */}
      <CallClassificationModal
        visible={showClassificationModal}
        onClose={() => setShowClassificationModal(false)}
        onClassificationComplete={(result: ClassificationResponse) => {
          console.log('Clasificación completada:', result);
          // Aquí puedes agregar lógica adicional, como guardar la clasificación
        }}
      />

      {/* Modal de Registro de Llamadas */}
      <RegisterCallModal
        visible={showRegisterCallModal}
        onClose={() => setShowRegisterCallModal(false)}
        onSubmit={handleRegisterCall}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  registerCallBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerCallBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  classifyBtn: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  classifyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ticketsBtn: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ticketsBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  backBtn: {
    fontSize: 14,
    color: '#22D3EE',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filtersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  filterBtnActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  filterText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  dropdown: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  dropdownText: {
    color: '#1e293b',
    fontSize: 13,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
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
  kpiIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f43f5e',
  },
  trendUp: {
    color: '#10b981',
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  chartsArea: {
    flex: 3,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
  },
  tableCellHighlight: {
    color: '#06b6d4',
    fontWeight: '600',
  },
  insightsPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignSelf: 'flex-start',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
  headerMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  headerTitleMobile: {
    width: '100%',
  },
  titleMobile: {
    fontSize: 18,
  },
  headerActionsMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  filtersBarMobile: {
    flexDirection: 'column',
    gap: 10,
  },
  kpiCardMobile: {
    minWidth: '45%',
  },
  kpiTitleMobile: {
    fontSize: 11,
  },
  kpiValueMobile: {
    fontSize: 24,
  },
  mainGridMobile: {
    flexDirection: 'column',
  },
  chartsRowMobile: {
    flexDirection: 'column',
  },
  loadingContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableLoadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
  tableEmptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableEmptyText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});