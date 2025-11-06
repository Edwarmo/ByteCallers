import { ValidationResult } from '../types/Auth';

export const validatePhoneNumber = (phone: string): ValidationResult => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  if (!phone.trim()) {
    return { isValid: false, message: 'El número de teléfono es obligatorio' };
  }
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Formato de teléfono inválido' };
  }
  
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Debe incluir al menos una letra mayúscula' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Debe incluir al menos una letra minúscula' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Debe incluir al menos un número' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Debe incluir al menos un símbolo especial' };
  }
  
  return { isValid: true, message: 'Contraseña válida' };
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};
