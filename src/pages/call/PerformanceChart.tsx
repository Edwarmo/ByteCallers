import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Circle, Rect } from 'react-native-svg';

interface ChartData {
  x: string[];
  y: number[];
}

export const PerformanceChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    x: ['Atención', 'Técnico', 'Ventas'],
    y: [0.85, 0.78, 0.92],
  });

  const colors = [
    { start: '#A21CAF', end: '#E879F9' },
    { start: '#065F46', end: '#10B981' },
    { start: '#0E7490', end: '#22D3EE' },
  ];

  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 80;
  const spacing = 15;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rendimiento</Text>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
            </RadialGradient>
            {colors.map((color, i) => (
              <LinearGradient key={i} id={`perfGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={color.end} />
                <Stop offset="1" stopColor={color.start} />
              </LinearGradient>
            ))}
          </Defs>

          <Rect width="100%" height="100%" fill="url(#bgGrad)" rx="16" />

          {chartData.y.map((value, index) => {
            const currentRadius = radius + index * spacing;
            const circumference = 2 * Math.PI * currentRadius;
            const strokeDashoffset = circumference * (1 - value);

            return (
              <Circle
                key={index}
                cx={centerX}
                cy={centerY}
                r={currentRadius}
                stroke={`url(#perfGrad${index})`}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                opacity="0.95"
                rotation="-90"
                origin={`${centerX}, ${centerY}`}
              />
            );
          })}
        </Svg>

        <View style={styles.legendContainer}>
          {chartData.x.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors[index].end }]} />
              <Text style={styles.legendText}>{label}</Text>
              <Text style={styles.legendValue}>{Math.round(chartData.y[index] * 100)}%</Text>
            </View>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
    marginLeft: 5,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
});
