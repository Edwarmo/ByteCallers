import { ButtonType } from '../../ui/hooks/useButtonsForVSR';

/**
 * Controlador API para gestionar botones desde el servidor o IA
 * Permite a sistemas externos (IA, Selenium, APIs) controlar el estado de los botones
 */

interface ButtonController {
  updateButtonFromAPI: (update: { type: ButtonType; isActive?: boolean; isDisabled?: boolean }) => void;
  triggerButtonFromAPI: (type: ButtonType) => void;
  setButtonDisabled: (type: ButtonType, disabled: boolean) => void;
  resetButtons: () => void;
}

interface CallInfo {
  callId: string;
  phoneNumber: string;
  type: string;
  duration: number;
  aiConfidence: number;
  problem: string;
}

let controllerInstance: ButtonController | null = null;
let currentCallInfo: CallInfo | null = null;
let chatbotCallback: ((callInfo: CallInfo) => void) | null = null;

export const registerButtonController = (controller: ButtonController) => {
  controllerInstance = controller;
};

export const registerChatbotCallback = (callback: (callInfo: CallInfo) => void) => {
  chatbotCallback = callback;
};

export const APIButtonController = {
  /**
   * Activar un botón desde la API/IA
   * @example APIButtonController.activateButton('Ventas')
   */
  activateButton: (type: ButtonType) => {
    if (!controllerInstance) {
      console.warn('ButtonController no registrado');
      return;
    }
    controllerInstance.triggerButtonFromAPI(type);
  },

  /**
   * Deshabilitar un botón desde la API/IA
   * @example APIButtonController.disableButton('Soporte Técnico', true)
   */
  disableButton: (type: ButtonType, disabled: boolean = true) => {
    if (!controllerInstance) {
      console.warn('ButtonController no registrado');
      return;
    }
    controllerInstance.setButtonDisabled(type, disabled);
  },

  /**
   * Actualizar estado completo de un botón
   * @example APIButtonController.updateButton({ type: 'Ventas', isActive: true, isDisabled: false })
   */
  updateButton: (update: { type: ButtonType; isActive?: boolean; isDisabled?: boolean }) => {
    if (!controllerInstance) {
      console.warn('ButtonController no registrado');
      return;
    }
    controllerInstance.updateButtonFromAPI(update);
  },

  /**
   * Resetear todos los botones
   * @example APIButtonController.resetAll()
   */
  resetAll: () => {
    if (!controllerInstance) {
      console.warn('ButtonController no registrado');
      return;
    }
    controllerInstance.resetButtons();
  },

  /**
   * Simular click de asesor humano desde IA
   * @example APIButtonController.simulateHumanClick('Reclamación')
   */
  simulateHumanClick: (type: ButtonType) => {
    if (!controllerInstance) {
      console.warn('ButtonController no registrado');
      return;
    }
    console.log(`[IA] Simulando click en botón: ${type}`);
    controllerInstance.triggerButtonFromAPI(type);
  },

  /**
   * Enviar información de llamada al chatbot
   * @example APIButtonController.sendCallInfoToChatbot({ callId: '001', phoneNumber: '+57 300...', ... })
   */
  sendCallInfoToChatbot: (callInfo: CallInfo) => {
    currentCallInfo = callInfo;
    if (chatbotCallback) {
      chatbotCallback(callInfo);
    }
    console.log('[API] Información de llamada enviada al chatbot:', callInfo);
  },

  /**
   * Obtener información de llamada actual
   */
  getCurrentCallInfo: () => currentCallInfo,
};

// Exponer globalmente para acceso desde consola/Selenium/IA
if (typeof window !== 'undefined') {
  (window as any).APIButtonController = APIButtonController;
}

export type { CallInfo };
