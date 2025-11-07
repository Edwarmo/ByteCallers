import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, useWindowDimensions } from 'react-native';
import Card from '../shared/Card';
import { BlurView } from 'expo-blur';

const Home: React.FC = () => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDark = colorScheme === 'dark';
  const isMobile = width < 768;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.hero}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          ✨ Revoluciona tu Atención al Cliente con Inteligencia Artificial
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Optimiza tus costos, acelera tus tiempos de respuesta y crea experiencias que fidelizan a tus clientes.
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Solicitar Demo Gratis 👉</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
        style={styles.statsScroll}
      >
        <Card style={styles.statCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.statNumber}>80%</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Consultas Automatizadas</Text>
          </BlurView>
        </Card>
        <Card style={styles.statCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.statNumber}>40%</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Reducción de Costos</Text>
          </BlurView>
        </Card>
        <Card style={styles.statCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Disponibilidad Total</Text>
          </BlurView>
        </Card>
      </ScrollView>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuresContainer}
        style={styles.featuresScroll}
      >
        <Card style={styles.featureCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Escalabilidad Rentable</Text>
            <Text style={[styles.featureText, isDark && styles.featureTextDark]}>
              Atienda volumen ilimitado sin contratar más personal. Crezca sin saturación.
            </Text>
          </BlurView>
        </Card>
        <Card style={styles.featureCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.featureIcon}>🤝</Text>
            <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Experiencia Superior</Text>
            <Text style={[styles.featureText, isDark && styles.featureTextDark]}>
              Respuestas inmediatas, coherentes y personalizadas que elevan CSAT y NPS.
            </Text>
          </BlurView>
        </Card>
        <Card style={styles.featureCard}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Inteligencia Accionable</Text>
            <Text style={[styles.featureText, isDark && styles.featureTextDark]}>
              Dashboards en tiempo real para decisiones estratégicas basadas en datos.
            </Text>
          </BlurView>
        </Card>
      </ScrollView>
      
      <View style={styles.challenge}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          El Desafío: Los Límites del Enfoque Tradicional
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          El modelo operativo tradicional enfrenta barreras que limitan su capacidad y elevan sus costos:
        </Text>
        <View style={styles.challengeList}>
          <Text style={[styles.challengeItem, isDark && styles.challengeItemDark]}>⚠️ Altos volúmenes saturan canales</Text>
          <Text style={[styles.challengeItem, isDark && styles.challengeItemDark]}>💸 Costos operacionales crecientes</Text>
          <Text style={[styles.challengeItem, isDark && styles.challengeItemDark]}>⏱️ Tiempos de espera inaceptables</Text>
          <Text style={[styles.challengeItem, isDark && styles.challengeItemDark]}>🔄 Inconsistencia entre agentes</Text>
        </View>
      </View>
      
      <View style={styles.testimonial}>
        <Text style={[styles.quote, isDark && styles.quoteDark]}>
          "Logramos una reducción del 65% en nuestro tiempo promedio de respuesta. Nuestros agentes ahora se enfocan en casos de alta complejidad mientras la IA gestiona eficientemente todo el volumen transaccional."
        </Text>
        <Text style={[styles.author, isDark && styles.authorDark]}>
          — Gerente de Operaciones, Empresa Líder en Servicios Financieros
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleDark: {
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 600,
  },
  subtitleDark: {
    color: '#cbd5e1',
  },
  ctaButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsScroll: {
    marginVertical: 40,
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cardBlur: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#22D3EE',
  },
  statLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 8,
  },
  statLabelDark: {
    color: '#cbd5e1',
  },
  featuresScroll: {
    marginTop: 40,
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  featureCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureTitleDark: {
    color: '#e2e8f0',
  },
  featureText: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureTextDark: {
    color: '#cbd5e1',
  },
  challenge: {
    marginTop: 60,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitleDark: {
    color: '#e2e8f0',
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  descriptionDark: {
    color: '#cbd5e1',
  },
  challengeList: {
    marginTop: 12,
  },
  challengeItem: {
    fontSize: 16,
    color: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    marginBottom: 12,
  },
  challengeItemDark: {
    color: '#e2e8f0',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  testimonial: {
    marginTop: 60,
    padding: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#e2e8f0',
    lineHeight: 28,
    marginBottom: 16,
  },
  quoteDark: {
    color: '#e2e8f0',
  },
  author: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  authorDark: {
    color: '#cbd5e1',
  },
});

export default React.memo(Home);
