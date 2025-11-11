﻿import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';

const demos = [
  { id: "voicebot", icon: "🎙️", title: "Voicebot", description: "Asistente de voz inteligente", features: ["Reconocimiento de voz", "Respuestas naturales", "Integración con CRM", "Análisis de sentimiento", "Disponibilidad 24/7"] },
  { id: "chatbot", icon: "💬", title: "Chatbot", description: "Chat automatizado multicanal", features: ["WhatsApp, Web, Redes", "Respuestas instantáneas", "Aprendizaje continuo", "Transferencia a agente", "Historial completo"] },
  { id: "analytics", icon: "📊", title: "Analytics", description: "Análisis predictivo avanzado", features: ["Dashboards en tiempo real", "Predicción de demanda", "KPIs automáticos", "Reportes personalizados", "Alertas inteligentes"] }
];



const AIShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('voicebot');
  const [slideAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [featureAnims] = useState(() => 
    Array.from({ length: 5 }, () => new Animated.Value(0))
  );

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    featureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [activeDemo]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleDemoChange = (id: string) => {
    slideAnim.setValue(0);
    featureAnims.forEach(anim => anim.setValue(0));
    setActiveDemo(id);
  };


  const activeDemo_ = demos.find(d => d.id === activeDemo);

  return (  //usa las cards creada como componente, si necesita alguna mejora hazla 
    <View style={styles.container}>
      <Text style={styles.title}>Tecnología IA en Acción</Text>
      <Text style={styles.subtitle}>Descubre cómo nuestra IA revoluciona la atención al cliente</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabsContainer}>
          {demos.map((demo) => (
            <Animated.View
              key={demo.id}
              style={{
                transform: [{ scale: activeDemo === demo.id ? pulseAnim : 1 }],
              }}
            >
              <TouchableOpacity
                style={[styles.tab, activeDemo === demo.id && styles.activeTab]}
                onPress={() => handleDemoChange(demo.id)}
              >
                <Text style={styles.tabIcon}>{demo.icon}</Text>
                <Text style={[styles.tabText, activeDemo === demo.id && styles.activeTabText]}>
                  {demo.title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      
      <Animated.View style={[styles.demoContent, {
        opacity: slideAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        }],
      }]}>
        <Text style={styles.demoTitle}>{activeDemo_?.title}</Text>
        <Text style={styles.demoDescription}>{activeDemo_?.description}</Text>
        
        <View style={styles.featuresContainer}>
          {activeDemo_?.features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.feature,
                {
                  opacity: featureAnims[index],
                  transform: [
                    {
                      translateX: featureAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </Animated.View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Ver Demo en Vivo</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    minHeight: '100vh' as any,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  tab: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
  },
  demoContent: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 24,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  demoDescription: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    color: '#22D3EE',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  demoButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(AIShowcase);