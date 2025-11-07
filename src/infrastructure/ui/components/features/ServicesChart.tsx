import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Path, Rect } from 'react-native-svg';

interface ChartData {
  labels: string[];
  values: number[];
}

export const ServicesChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Atención', 'Técnico', 'Ventas', 'Soporte', 'Logística'],
    values: [85, 78, 97, 90, 82],
  });

  const colors = [
    { start: '#1E3A8A', end: '#3B82F6' }, // Azul
    { start: '#0E7490', end: '#22D3EE' }, // Cian
    { start: '#A21CAF', end: '#E879F9' }, // Magenta
    { start: '#B45309', end: '#F59E0B' }, // Naranja
    { start: '#065F46', end: '#10B981' }, // Verde
  ];

  const chartWidth = 360;
  const chartHeight = 200;
  const barWidth = 50;
  const spacing = (chartWidth - barWidth * chartData.labels.length) / (chartData.labels.length + 1);

  const createBellCurvePath = (x: number, height: number, width: number) => {
    const baseY = chartHeight - 25;
    const topY = baseY - height;
    const control = width / 2.2;

    return `
      M ${x} ${baseY}
      C ${x + control / 2} ${topY + height * 0.4},
        ${x + width - control / 2} ${topY + height * 0.4},
        ${x + width} ${baseY}
      Z
    `;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calificación por Servicio</Text>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Fondo con gradiente radial */}
          <Defs>
            <RadialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
            </RadialGradient>
            {colors.map((color, i) => (
              <LinearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color.end} />
                <Stop offset="1" stopColor={color.start} />
              </LinearGradient>
            ))}
          </Defs>

          {/* Fondo */}
          <Rect width="100%" height="100%" fill="url(#bgGrad)" rx="16" />

          {/* Curvas de servicios */}
          {chartData.values.map((value, index) => {
            const x = spacing + index * (barWidth + spacing);
            const height = (value / 100) * (chartHeight - 60);
            return (
              <Path
                key={index}
                d={createBellCurvePath(x, height, barWidth)}
                fill={`url(#grad${index})`}
                opacity={0.95}
              />
            );
          })}

          {/* Línea base */}
          <Path
            d={`M ${spacing / 2} ${chartHeight - 25} L ${chartWidth - spacing / 2} ${chartHeight - 25}`}
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
        </Svg>

        {/* Etiquetas y valores */}
        {chartData.values.map((value, index) => {
          const x = spacing + index * (barWidth + spacing);
          const height = (value / 100) * (chartHeight - 60);
          const topY = chartHeight - 25 - height;

          return (
            <View key={index} style={[styles.labelWrapper, { left: x, width: barWidth }]}>
              <Text style={[styles.valueText, { top: topY - 20 }]}>{value}%</Text>
              <Text style={[styles.labelText, { top: chartHeight - 15 }]}>{chartData.labels[index]}</Text>
            </View>
          );
        })}
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
    marginBottom: 25,
    marginLeft: 5,
  },
  chartContainer: {
    position: 'relative',
    width: 360,
    height: 200,
    alignItems: 'center',
  },
  labelWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  labelText: {
    position: 'absolute',
    fontSize: 12,
    color: '#64748b',
  },
});
