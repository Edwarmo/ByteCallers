import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useColorScheme, Animated } from 'react-native';
import Card from '../shared/Card';
import { BlurView } from 'expo-blur';

const testimonialsData = [
  { id: "1", title: "Excelente servicio", description: "La plataforma ha transformado nuestra atención al cliente. Reducimos tiempos de espera en un 60%.", imageUrl: "https://via.placeholder.com/300x150/8b5cf6/ffffff?text=Cliente+1" },
  { id: "2", title: "Muy recomendado", description: "La IA nos ayudó a automatizar el 80% de nuestras consultas frecuentes. Increíble ROI.", imageUrl: "https://via.placeholder.com/300x150/22d3ee/ffffff?text=Cliente+2" },
  { id: "3", title: "Resultados impresionantes", description: "Nuestros agentes ahora se enfocan en casos complejos mientras la IA maneja lo rutinario.", imageUrl: "https://via.placeholder.com/300x150/10b981/ffffff?text=Cliente+3" }
];

const Testimonials: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [scrollX] = useState(new Animated.Value(0));
  const [cardAnims] = useState(() =>
    testimonialsData.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 150,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Más de 3000 clientes de todo el mundo confían en nosotros
      </Text>
      
      <Animated.ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {testimonialsData.map((testimonial, index) => {
          const inputRange = [
            (index - 1) * 316,
            index * 316,
            (index + 1) * 316,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={testimonial.id}
              style={[
                styles.testimonialItem,
                {
                  opacity: cardAnims[index],
                  transform: [
                    { scale: Animated.multiply(scale, cardAnims[index]) },
                    {
                      translateY: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View style={{ opacity }}>
                <Card style={styles.card}>
                  <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.blurView}>
                    <Image source={{ uri: testimonial.imageUrl }} style={styles.image} />
                    <View style={styles.textContainer}>
                      <Text style={[styles.testimonialTitle, isDark && styles.testimonialTitleDark]}>{testimonial.title}</Text>
                      <Text style={[styles.testimonialDescription, isDark && styles.testimonialDescriptionDark]}>"{testimonial.description}"</Text>
                    </View>
                  </BlurView>
                </Card>
              </Animated.View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  titleDark: {
    color: '#e2e8f0',
  },
  scrollViewContent: {
    paddingHorizontal: 0,
    gap: 16,
  },
  testimonialItem: {
    width: 300,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 16, // Match the BlurView borderRadius
    backgroundColor: 'transparent', // Important for BlurView to be visible
  },
  blurView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    overflow: 'hidden', // Ensures content respects the border radius
  },
  image: {
    width: '100%',
    height: 150,
  },
  textContainer: {
    padding: 16,
    width: '100%',
  },
  testimonialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  testimonialTitleDark: {
    color: '#e2e8f0',
  },
  testimonialDescription: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  testimonialDescriptionDark: {
    color: '#cbd5e1',
  },
});

export default React.memo(Testimonials);
