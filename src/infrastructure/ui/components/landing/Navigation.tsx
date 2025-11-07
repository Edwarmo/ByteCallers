import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Animated,
  Pressable,
  useColorScheme,
} from 'react-native';
import { BlurView } from 'expo-blur';

type Section = 'home' | 'solutions' | 'enterprise' | 'ai-tech' | 'testimonials' | 'contact';

interface NavigationProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onNavigate?: (view: 'public' | 'login') => void;
}

const sections: { id: Section; label: string; emoji: string }[] = [
  { id: 'home', label: 'Inicio', emoji: '🏠' },
  { id: 'solutions', label: 'Soluciones IA', emoji: '🤖' },
  { id: 'enterprise', label: 'Empresas', emoji: '🏢' },
  { id: 'ai-tech', label: 'Tecnología', emoji: '🚀' },
  { id: 'testimonials', label: 'Testimonios', emoji: '⭐' },
  { id: 'contact', label: 'Contacto', emoji: '📞' },
];

const metrics = [
  { value: '80%', label: 'Consultas Automatizadas' },
  { value: '40%', label: 'Reducción de Costos' },
  { value: '24/7', label: 'Disponibilidad' },
];

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange, onNavigate }) => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  useEffect(() => {
    // Establecer la sección 'home' como la sección inicial
    onSectionChange('home');
  }, []);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const isDark = colorScheme === 'dark';
  const isMobile = width < 768;

  useEffect(() => {
    if (isMobile) {
      Animated.timing(animation, {
        toValue: isMenuOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen, isMobile, animation]);

  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (section: Section) => {
    onSectionChange(section);
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const sidebarTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.65, 0],
  });

  const renderNavItems = (isSidebar: boolean = false) => (
    sections.map((section) => (
      <TouchableOpacity
        key={section.id}
        onPress={() => handleNavigate(section.id)}
        style={[
          styles.navItem,
          isSidebar && styles.sidebarNavItem,
          currentSection === section.id && !isSidebar && styles.activeNavItem,
        ]}
      >
        <Text style={[
          styles.navText,
          isDark && styles.navTextDark,
          currentSection === section.id && styles.activeNavText,
        ]}>
          {section.emoji} {section.label}
        </Text>
        {currentSection === section.id && isSidebar && <View style={styles.activeSidebarIndicator} />}
      </TouchableOpacity>
    ))
  );

  const renderDesktopNav = () => (
    <View style={styles.desktopNav}>
      {renderNavItems()}
      {onNavigate && (
        <TouchableOpacity
          style={styles.loginButton} 
          onPress={() => onNavigate('login')}
        >
          <Text style={styles.loginButtonText}>🔐 Login Agentes</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <Text style={[styles.logo, isDark && styles.logoDark]}>ByteCallers</Text>
          {isMobile ? (
            <View style={styles.mobileActions}>
              {onNavigate && (
                <TouchableOpacity
                  style={styles.loginButtonMobile} 
                  onPress={() => onNavigate('login')}
                >
                  <Text style={styles.loginIconMobile}>🔐</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleToggleMenu} style={styles.hamburger}>
                <Text style={[styles.hamburgerIcon, isDark && styles.hamburgerIconDark]}>
                  {isMenuOpen ? '✕' : '☰'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : renderDesktopNav()}
        </View>
      </View>
      

      {isMobile && isMenuOpen && (
        <>
          <Pressable onPress={handleToggleMenu} style={styles.overlay} />
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarTranslateX }] }]}>
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={styles.sidebarContainer}>
              <View style={styles.sidebarHeader}>
                <Text style={[styles.sidebarTitle, isDark && styles.sidebarTitleDark]}>ByteCallers</Text>
                <TouchableOpacity onPress={handleToggleMenu}>
                  <Text style={[styles.sidebarCloseIcon, isDark && styles.sidebarCloseIconDark]}>✕</Text>
                </TouchableOpacity>
              </View>
              

              <View style={styles.sidebarContent}>
                <TouchableOpacity style={styles.demoButton} onPress={() => handleNavigate('contact')}>
                  <Text style={styles.demoButtonText}>Solicitar Demo Gratis 👍</Text>
                </TouchableOpacity>
                

                <View style={styles.sidebarNavItems}>
                  {renderNavItems(true)}
                  {onNavigate && (
                    <TouchableOpacity 
                      style={styles.loginButtonSidebar} 
                      onPress={() => {
                        onNavigate('login');
                        setMenuOpen(false);
                      }}
                    >
                      <Text style={styles.loginButtonSidebarText}>🔐 Login Agentes</Text>
                    </TouchableOpacity>
                  )}
                  

                  <View style={styles.metricsContainer}>
                    {metrics.map((metric) => (
                      <View key={metric.label} style={styles.metricItem}>
                        <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>{metric.label}</Text>
                        <Text style={[styles.metricValue, isDark && styles.metricValueDark]}>{metric.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 70,
    zIndex: 1000,
    position: 'relative',
    ...Platform.select({
      web: { position: 'sticky' as any, top: 0 },
      default: { position: 'relative' },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoDark: {
    color: '#e2e8f0',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
  },
  navText: {
    fontSize: 16,
    color: '#0f172a',
  },
  navTextDark: {
    color: '#e2e8f0',
  },
  activeNavText: {
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  loginButtonMobile: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginIconMobile: {
    fontSize: 22,
  },
  loginButtonSidebar: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonSidebarText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  hamburger: {
    padding: 10,
  },
  hamburgerIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  hamburgerIconDark: {
    color: '#e2e8f0',
  },
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      default: {
        ...StyleSheet.absoluteFillObject,
      }
    }),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1001,
  } as any,
  sidebar: {
    ...Platform.select({
      web: { position: 'fixed' as any },
      default: { position: 'absolute' },
    }),
    top: '5%',
    left: 0,
    width: '65%',
    height: '90%',
    zIndex: 1002,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  } as any,
  sidebarContainer: {
    flex: 1,
    paddingTop: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sidebarTitleDark: {
    color: '#e2e8f0',
  },
  sidebarCloseIcon: {
    fontSize: 24,
    color: '#0f172a',
  },
  sidebarCloseIconDark: {
    color: '#e2e8f0',
  },
  sidebarNavItems: {
    marginTop: 24,
  },

  demoButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'column',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.2)',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  metricValueDark: {
    color: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 13,
    color: '#0f172a',
    flex: 1,
  },
  metricLabelDark: {
    color: '#94a3b8',
  },
  sidebarNavItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeSidebarIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
});


export default React.memo(Navigation);
