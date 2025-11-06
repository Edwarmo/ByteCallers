import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useChatbot, CallType } from './Utils/useChatbot';
import { registerChatbotCallback, CallInfo } from './APIButtonController';

export const AIAssistant: React.FC = () => {
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const {
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
  } = useChatbot();

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };



  useEffect(() => {
    registerChatbotCallback((info: CallInfo) => {
      setCallInfo(info);
      if (!selectedCallType) {
        selectCallType('Consulta');
      }
      addBotMessage(`📢 Contexto actualizado:\n\n📞 Llamada #${info.callId}\n📱 ${info.phoneNumber}\n🎯 ${info.type}\n⏱️ ${Math.floor(info.duration / 60)}:${(info.duration % 60).toString().padStart(2, '0')}\n🤖 Confianza: ${info.aiConfidence}%\n\n📝 ${info.problem}`);
      if (!isOpen) {
        toggleChat();
      }
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
    });
  }, [isOpen, selectedCallType, selectCallType, addBotMessage, toggleChat]);

  return (
    <View style={styles.container}>
      {/* Botón flotante */}
      <TouchableOpacity style={styles.floatingBtn} onPress={toggleChat}>
        <Text style={styles.floatingBtnText}>🤖</Text>
      </TouchableOpacity>

      {/* Panel desplegable */}
      {isOpen && (
        <View style={styles.chatPanel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Asistente IA</Text>
            <TouchableOpacity onPress={toggleChat}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Chat directo */}
          <>

            {/* Mensajes */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={true}
            >
                {messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe tu mensaje..."
                  placeholderTextColor="#64748B"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => handleSendMessage(inputText)}
                />
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={() => handleSendMessage(inputText)}
                >
                  <Text style={styles.sendBtnText}>➤</Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22D3EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingBtnText: {
    fontSize: 28,
  },

  chatPanel: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    width: 400,
    height: 575,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  closeBtn: {
    fontSize: 24,
    color: '#94A3B8',
    fontWeight: '600',
  },

  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#22D3EE',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
  },
  messageText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#E2E8F0',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#22D3EE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '700',
  },
});
