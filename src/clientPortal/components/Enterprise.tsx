import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useColorScheme, Animated } from 'react-native';
import { Card } from '../../shared/ui';
import enterpriseData from '../data/infoPageJson/enterprise.json';

const Enterprise: React.FC = () => {
  const [activeCase, setActiveCase] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cases = enterpriseData;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Casos de Éxito Empresariales</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Empresas que transformaron su operación con ByteCallers</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {cases.map((case_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveCase(index)}
          >
            <Card style={styles.caseCard}>
              <View style={styles.cardHeader}>
                <Text style={[styles.company, isDark && styles.companyDark]}>{case_.company}</Text>
                <Text style={styles.industry}>{case_.industry}</Text>
              </View>
              <Text style={[styles.challenge, isDark && styles.challengeDark]}>Desafío: {case_.challenge}</Text>
              <Text style={styles.result}>{case_.result}</Text>
              <Text style={[styles.description, isDark && styles.descriptionDark]}>{case_.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Card style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricNumber}>85%</Text>
          <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Llamadas Automatizadas</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricNumber}>60%</Text>
          <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Reducción de Costos</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricNumber}>24/7</Text>
          <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>Atención Continua</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 70,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleDark: {
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 32,
  },
  subtitleDark: {
    color: '#cbd5e1',
  },
  carousel: {
    marginBottom: 40,
  },
  caseCard: {
    marginRight: 16,
    width: 300,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  activeCard: {
    borderColor: '#3498db',
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 16,
  },
  company: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  companyDark: {
    color: '#e2e8f0',
  },
  industry: {
    fontSize: 14,
    color: '#8b5cf6',
    marginTop: 4,
  },
  challenge: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  challengeDark: {
    color: '#cbd5e1',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22D3EE',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#cbd5e1',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metric: {
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22D3EE',
  },
  metricLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 4,
  },
  metricLabelDark: {
    color: '#cbd5e1',
  },
});

export default React.memo(Enterprise);