import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useColorScheme, Animated } from 'react-native';
import Card from '../shared/Card';
import { BlurView } from 'expo-blur';

const Solutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-agents');
  const [fadeAnim] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const handleTabChange = (id: string) => {
    fadeAnim.setValue(0);
    setActiveTab(id);
  };

  const solutions = [  /// quiero que pongas estas info en un json aparte dode ira su contenido 
    { 
      id: 'ai-agents', 
      label: 'Atención Automática', 
      icon: '🤖',
      title: 'Chatbots y Voicebots Inteligentes',
      description: 'Chatbots en web, WhatsApp y redes sociales que atienden consultas frecuentes. Voicebots para llamadas de bajo nivel como consultas de saldo, horarios y seguimiento de pedidos. Disponibilidad 24/7 con reducción del tiempo de espera.'
    },
    { 
      id: 'assistants', 
      label: 'Asistentes de Agente', 
      icon: '🎙️',
      title: 'IA que Potencia a tus Operadores',
      description: 'IA que escucha llamadas en tiempo real y sugiere respuestas rápidas. Transcripción automática para evitar tomar notas. Sugerencias de productos basadas en el historial del cliente.'
    },
    { 
      id: 'analytics', 
      label: 'Análisis de Sentimiento', 
      icon: '📊',
      title: 'Detección de Emociones y Calidad',
      description: 'Detección en tiempo real de emociones (enojo, frustración, satisfacción) para alertar supervisores. Evaluación automática de calidad y métricas de satisfacción sin depender de encuestas.'
    },
    { 
      id: 'integration', 
      label: 'Integración Total', 
      icon: '🔗',
      title: 'Plataforma Omnicanal Unificada',
      description: 'Conecta todos tus canales de comunicación en una sola plataforma inteligente que centraliza la información del cliente.'
    }
  ];

  const activeSolution = solutions.find(s => s.id === activeTab);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Soluciones para Call Centers</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Transforma tu operación con IA conversacional</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
        <View style={styles.tabsContainer}>
          {solutions.map((solution) => (
            <TouchableOpacity
              key={solution.id}
              style={[
                styles.tab,
                isDark && styles.tabDark,
                activeTab === solution.id && (isDark ? styles.activeTabDark : styles.activeTabLight)
              ]}
              onPress={() => handleTabChange(solution.id)}
            >
              <Text style={styles.tabIcon}>{solution.icon}</Text>
              <Text style={[
                styles.tabText,
                isDark && styles.tabTextDark,
                activeTab === solution.id && styles.activeTabText
              ]}>
                {solution.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <Card style={styles.contentCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.blurView}>
            <Text style={[styles.contentTitle, isDark && styles.contentTitleDark]}>{activeSolution?.title}</Text>
            <Text style={[styles.contentText, isDark && styles.contentTextDark]}>{activeSolution?.description}</Text>
          </BlurView>
        </Card>
      </Animated.View>
    </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 70,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  titleDark: {
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  subtitleDark: {
    color: '#cbd5e1',
  },
  tabsScrollView: {
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  tab: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 12,
  },
  tabDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderColor: '#334155',
  },
  activeTabLight: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  activeTabDark: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tabText: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextDark: {
    color: '#cbd5e1',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  contentCard: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  contentCardDark: {
    // No specific style needed, handled by Card/BlurView
  },
  blurView: {
    padding: 24,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  contentTitleDark: {
    color: '#e2e8f0',
  },
  contentText: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  contentTextDark: {
    color: '#cbd5e1',
  },
});

export default React.memo(Solutions);