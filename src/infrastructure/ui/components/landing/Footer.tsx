import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Footer: React.FC = () => (
  <View style={styles.footer}>
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soluciones Integrales</Text>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Customer Experience IA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Ventas E2E con IA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Recobro & Recuperación IA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Automatización del Customer Journey</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Business Intelligence Conversacional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Back Office Inteligente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empresa</Text>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>¿Por qué nosotros?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Insights & Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Únete a nuestro equipo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Canal ético</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Text style={styles.contactInfo}>info@bytecallers.com</Text>
        <Text style={styles.contactInfo}>LinkedIn | Twitter/X</Text>
        <Text style={styles.description}>
          Suscríbete a nuestra Newsletter para insights sobre IA conversacional
        </Text>
      </View>
    </View>

    <View style={styles.bottom}>
      <Text style={styles.copyright}>
        © 2025 ByteCallers, S.L. | Aviso legal | Política de privacidad | Política de cookies | Quejas y reclamaciones
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingTop: 40,
    paddingBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  section: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  contactInfo: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 41, 59, 0.5)',
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default React.memo(Footer);
