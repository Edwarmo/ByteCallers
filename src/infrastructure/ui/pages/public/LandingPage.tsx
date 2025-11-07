import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navigation from '../../components/landing/Navigation';
import Home from '../../components/landing/Home';
import Solutions from '../../components/landing/Solutions';
import Enterprise from '../../components/landing/Enterprise';
import AIShowcase from '../../components/landing/AIShowcase';
import Testimonials from '../../components/landing/Testimonials';
import ContactForm from '../../components/landing/ContactForm';
import Footer from '../../components/landing/Footer';

interface LandingPageProps {
  onNavigate?: (view: 'public' | 'login') => void;
}

type Section = 'home' | 'solutions' | 'enterprise' | 'ai-tech' | 'testimonials' | 'contact';

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  return (
    <View style={styles.container}>
      <Navigation 
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
        onNavigate={onNavigate}
      />
      <ScrollView style={styles.content}>
        <Home />
        <Solutions />
        <Enterprise />
        <AIShowcase />
        <Testimonials />
        <ContactForm />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
});

export default React.memo(LandingPage);
