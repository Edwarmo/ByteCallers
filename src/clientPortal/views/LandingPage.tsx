import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navigation from '../components/Navigation';
import Home from '../components/Home';
import Solutions from '../components/Solutions';
import Enterprise from '../components/Enterprise';
import AIShowcase from '../components/AIShowcase';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

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
  },
  content: {
    flex: 1,
  },
});

export default React.memo(LandingPage);
