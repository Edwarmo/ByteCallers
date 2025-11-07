import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Path, Circle, Rect } from 'react-native-svg';

interface ChartData {
  x: string[];
  y: number[];
}

export const SatisfactionChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    y: [4.2, 4.5, 4.3, 4.7, 4.6, 4.8],
  });

  const avgSatisfaction = (chartData.y.reduce((a, b) => a + b, 0) / chartData.y.length).toFixed(1);

  const chartWidth = 360;
  const chartHeight = 200;
  const padding = 40;
  const maxValue = 5;
  const stepX = (chartWidth - padding * 2) / (chartData.x.length - 1);
  const stepY = (chartHeight - padding * 2) / maxValue;

  const points = chartData.y.map((value, index) => ({
    x: padding + index * stepX,
    y: chartHeight - padding - value * stepY,
  }));

  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[index - 1];
    const cpX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
    const cpX2 = prevPoint.x + 2 * (point.x - prevPoint.x) / 3;
    return `${path} C ${cpX1} ${prevPoint.y}, ${cpX2} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Satisfacción del Cliente</Text>
          <Text style={styles.subtitle}>Promedio mensual</Text>
        </View>
        <View style={styles.metricContainer}>
          <Text style={styles.metricValue}>{avgSatisfaction}</Text>
          <Text style={styles.metricLabel}>/5.0</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <RadialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
            </RadialGradient>
            <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#8b5cf6" />
              <Stop offset="1" stopColor="#06b6d4" />
            </LinearGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#bgGrad)" rx="16" />

          <Path
            d={linePath}
            stroke="url(#lineGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#8b5cf6"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
        </Svg>

        <View style={styles.labelsContainer}>
          {chartData.x.map((label, index) => (
            <Text key={index} style={[styles.labelText, { left: padding + index * stepX - 15 }]}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  metricLabel: {
    fontSize: 18,
    color: '#64748b',
    marginLeft: 4,
  },
  chartContainer: {
    position: 'relative',
  },
  labelsContainer: {
    position: 'relative',
    height: 20,
    marginTop: 10,
  },
  labelText: {
    position: 'absolute',
    fontSize: 11,
    color: '#64748b',
  },
});
