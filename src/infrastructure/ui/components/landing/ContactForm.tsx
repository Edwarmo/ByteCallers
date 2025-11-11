﻿import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../shared/Input';
import Button from '../shared/Button';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    country: 'Colombia',
    agents: '',
    marketing: false,
  });

  const handleSubmit = () => {
    if (!formData.email || !formData.agents) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    Alert.alert('Éxito', 'Formulario enviado correctamente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consúltanos y adelántate a tus competidores</Text>
      <Text style={styles.subtitle}>Rellena este formulario para hablar con uno de nuestros estrategas sobre cómo la IA puede transformar tus resultados de negocio.</Text>
      
      <Input
        label="Email"
        value={formData.email}
        onChangeText={(email) => setFormData({ ...formData, email })}
        keyboardType="email-address"
        required
      />
      
      <Input
        label="País"
        value={formData.country}
        onChangeText={(country) => setFormData({ ...formData, country })}
        required
      />
      
      <Input
        label="Nº de agentes"
        value={formData.agents}
        onChangeText={(agents) => setFormData({ ...formData, agents })}
        keyboardType="numeric"
        required
      />
      
      <Text style={styles.disclaimer}>
        * Todos los campos son obligatorios
      </Text>
      
      <Text style={styles.privacy}>
        Al enviar este formulario acepto la Política de Privacidad y los Términos y Condiciones.
      </Text>
      
      <Button
        title="Enviar Solicitud"
        onPress={handleSubmit}
        variant="primary"
        size="large"
      />
      
      <Text style={styles.security}>
        Su información está segura y no será compartida.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: '100vh' as any,
    justifyContent: 'center',
  },
  formWrapper: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 12,
  },
  privacy: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 16,
  },
  security: {
    fontSize: 12,
    color: '#22D3EE',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default React.memo(ContactForm);
