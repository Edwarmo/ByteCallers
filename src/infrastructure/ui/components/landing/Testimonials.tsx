import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, Animated, useWindowDimensions, FlatList } from 'react-native';
import Card from '../shared/Card';
import { testimonialsData } from '../../../../core/domain/entities/testimonials.data';

const Testimonials: React.FC = () => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDark = colorScheme === 'dark';
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

  const renderItem = ({ item, index }: { item: typeof testimonialsData[0], index: number }) => (
    <Animated.View
      style={[
        styles.testimonialItem,
        isMobile && styles.testimonialItemMobile,
        {
          opacity: cardAnims[index],
          transform: [
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
      <Card style={[styles.card, isDark && styles.cardDark]}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={[styles.testimonialTitle, isDark && styles.testimonialTitleDark]}>{item.title}</Text>
          <Text style={[styles.testimonialDescription, isDark && styles.testimonialDescriptionDark]}>"{item.description}"</Text>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Más de 3000 clientes de todo el mundo confían en nosotros
      </Text>
      
      <FlatList
        data={testimonialsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={!isMobile}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh' as any,
    paddingVertical: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: 600,
  },
  titleDark: {
    color: '#e2e8f0',
  },
  scrollViewContent: {
    paddingHorizontal: 40,
  },
  testimonialItem: {
    width: 300,
    marginRight: 16,
  },
  testimonialItemMobile: {
    width: '100%',
    marginRight: 0,
    marginBottom: 16,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
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
