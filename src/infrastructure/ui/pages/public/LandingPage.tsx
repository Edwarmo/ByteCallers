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

  const renderSection = () => {
    switch (currentSection) {
      case 'home': return <Home />;
      case 'solutions': return <Solutions />;
      case 'enterprise': return <Enterprise />;
      case 'ai-tech': return <AIShowcase />;
      case 'testimonials': return <Testimonials />;
      case 'contact': return <ContactForm />;
    }
  };

  return (
    <View style={styles.container}>
      <Navigation 
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
        onNavigate={onNavigate}
      />
      <ScrollView style={styles.content}>
        {renderSection()}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});

export default React.memo(LandingPage);
