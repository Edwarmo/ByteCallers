import { useState, useCallback, useEffect } from 'react';
import { services } from '../../ServiceContainer';

export type ButtonType = 'Ventas' | 'Soporte Técnico' | 'Reclamación';

interface ButtonState {
  id: string;
  type: ButtonType;
  text: string;
  isActive: boolean;
  isDisabled: boolean;
}

interface APIButtonUpdate {
  type: ButtonType;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const useButtonsForVSR = () => {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [selectedButtonType, setSelectedButtonType] = useState<ButtonType | null>(null);
  const [buttons, setButtons] = useState<ButtonState[]>([
    { id: 'ventas', type: 'Ventas', text: 'Llamada de Ventas', isActive: false, isDisabled: false },
    { id: 'soporte', type: 'Soporte Técnico', text: 'Llamada de Soporte Técnico', isActive: false, isDisabled: false },
    { id: 'reclamacion', type: 'Reclamación', text: 'Llamada de Reclamación', isActive: false, isDisabled: false },
  ]);

  const toggleButton = useCallback(() => {
    setButtonPressed(prev => !prev);
  }, []);

  const selectButtonType = useCallback(async (type: ButtonType) => {
    setSelectedButtonType(type);
    setButtons(prev => prev.map(btn => ({
      ...btn,
      isActive: btn.type === type,
    })));
    
    // Notificar al servicio de botones
    services.buttons.activate(type);
  }, []);

  // API: Actualizar estado de botón desde servidor/IA
  const updateButtonFromAPI = useCallback((update: APIButtonUpdate) => {
    setButtons(prev => prev.map(btn => 
      btn.type === update.type
        ? {
            ...btn,
            isActive: update.isActive ?? btn.isActive,
            isDisabled: update.isDisabled ?? btn.isDisabled,
          }
        : btn
    ));
    
    if (update.isActive) {
      setSelectedButtonType(update.type);
    }
  }, []);

  // API: Simular click desde servidor/IA
  const triggerButtonFromAPI = useCallback((type: ButtonType) => {
    selectButtonType(type);
    setButtonPressed(true);
  }, [selectButtonType]);

  // API: Deshabilitar/habilitar botón
  const setButtonDisabled = useCallback((type: ButtonType, disabled: boolean) => {
    setButtons(prev => prev.map(btn =>
      btn.type === type ? { ...btn, isDisabled: disabled } : btn
    ));
  }, []);

  // API: Reset todos los botones
  const resetButtons = useCallback(() => {
    setButtons(prev => prev.map(btn => ({
      ...btn,
      isActive: false,
      isDisabled: false,
    })));
    setSelectedButtonType(null);
    setButtonPressed(false);
  }, []);

  return {
    buttonPressed,
    selectedButtonType,
    buttons,
    toggleButton,
    selectButtonType,
    updateButtonFromAPI,
    triggerButtonFromAPI,
    setButtonDisabled,
    resetButtons,
  };
};
