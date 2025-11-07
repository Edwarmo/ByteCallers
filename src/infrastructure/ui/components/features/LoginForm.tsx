import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthController } from '../../../infrastructure/adapters/controllers/AuthController';
import { validatePhoneNumber, validatePassword } from '../../../shared/utils/validation';

interface LoginFormProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    const validation = validatePhoneNumber(text);
    setPhoneError(validation.isValid ? '' : validation.message);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const validation = validatePassword(text);
    setPasswordError(validation.isValid ? '' : validation.message);
  };

  const handleLogin = async () => {
    if (phoneError || passwordError || !phoneNumber || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos correctamente');
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthController.handleLogin({ phoneNumber, password });
      if (result.success && result.user && result.token) {
        onLoginSuccess(result.user, result.token);
      } else {
        Alert.alert('Error de Login', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#312e81']}
      style={styles.container}
    >
      <Text style={styles.title}>🤖 ByteCallers</Text>
      <Text style={styles.subtitle}>AI Login Portal</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Número de Teléfono</Text>
        <TextInput
          style={[styles.input, phoneError ? styles.inputError : null]}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder="+57 300 000 0000"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="********"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginButtonInner}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    color: '#60a5fa',
    textShadowColor: '#3b82f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#c084fc',
    marginBottom: 28,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 12,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#f87171',
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    marginBottom: 12,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  eyeText: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  loginButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonInner: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  forgotButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  forgotText: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
});

export default LoginForm;
