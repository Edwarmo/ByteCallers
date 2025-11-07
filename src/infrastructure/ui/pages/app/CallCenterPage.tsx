import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { User } from '../../../../core/domain/entities/User';
import { TicketsPage } from './TicketsPage';
import { SatisfactionChart } from '../../components/features/SatisfactionChart';
import { ServicesChart } from '../../components/features/ServicesChart';
import { PerformanceChart } from '../../components/features/PerformanceChart';

interface CallCenterPageProps {
  user: User | null;
  onLogout: () => void;
}

export const CallCenterPage: React.FC<CallCenterPageProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tickets'>('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('30');
  const [selectedService, setSelectedService] = useState('Todos');
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const kpis = [
    { icon: '📞', title: 'Llamadas Totales', value: '1,247', trend: '+5.2%', trendUp: true },
    { icon: '⏱️', title: 'Tiempo Promedio', value: '3:42', trend: '-8.1%', trendUp: true },
    { icon: '✅', title: 'Resolución 1er Contacto', value: '87%', trend: '+3.4%', trendUp: true },
    { icon: '⭐', title: 'Satisfacción Media', value: '4.6', trend: '+2.1%', trendUp: true },
  ];

  const insights = [
    { icon: '📈', title: 'Tendencia Positiva', desc: 'La satisfacción en "Ventas" ha aumentado un 12% esta semana.' },
    { icon: '⚠️', title: 'Atención Requerida', desc: 'El tiempo de espera en "Técnico" supera el objetivo en 15%.' },
    { icon: '🎯', title: 'Meta Alcanzada', desc: 'Resolución en primer contacto superó el 85% objetivo.' },
    { icon: '💡', title: 'Recomendación IA', desc: 'Considera reforzar el equipo de soporte entre 14-16h.' },
  ];

  const tableData = [
    { service: 'Atención', rating: 4.5, cases: 342, resolution: '89%' },
    { service: 'Técnico', rating: 4.2, cases: 287, resolution: '78%' },
    { service: 'Ventas', rating: 4.8, cases: 198, resolution: '97%' },
    { service: 'Soporte', rating: 4.6, cases: 256, resolution: '90%' },
    { service: 'Logística', rating: 4.4, cases: 164, resolution: '82%' },
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
              <Text style={[styles.kpiValue, isMobile && styles.kpiValueMobile]}>{kpi.value}</Text>
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
            <SatisfactionChart />
            
            <View style={[styles.chartsRow, isMobile && styles.chartsRowMobile]}>
              <ServicesChart />
              <PerformanceChart />
            </View>

            {/* Summary Table */}
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>Resumen por Servicio</Text>
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
                    <Text style={styles.tableCell}>⭐ {row.rating}</Text>
                    <Text style={styles.tableCell}>{row.cases}</Text>
                    <Text style={[styles.tableCell, styles.tableCellHighlight]}>{row.resolution}</Text>
                  </View>
                ))}
              </View>
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
});