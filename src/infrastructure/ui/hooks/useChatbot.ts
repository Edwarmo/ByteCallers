import { useState, useCallback } from 'react';

export type CallType = 'Ventas' | 'Soporte Técnico' | 'Reclamación';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<CallType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const selectCallType = useCallback((type: CallType) => {
    setSelectedCallType(type);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hola, soy tu asistente de ${type}. ¿En qué puedo ayudarte?`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const addBotMessage = useCallback((text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Entiendo tu consulta sobre "${text}". Estoy procesando tu solicitud...`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  }, []);

  const resetChat = useCallback(() => {
    setSelectedCallType(null);
    setMessages([]);
    setInputText('');
  }, []);

  return {
    isOpen,
    selectedCallType,
    messages,
    inputText,
    toggleChat,
    selectCallType,
    sendMessage,
    setInputText,
    resetChat,
    addBotMessage,
  };
};
