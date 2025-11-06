import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ButtonType, useButtonsForVSR } from './useButtonsForVSR';

interface ButtonsVSRProps {
  onButtonSelect?: (type: ButtonType) => void;
}

export const ButtonsVSR: React.FC<ButtonsVSRProps> = ({ onButtonSelect }) => {
  const {
    buttons,
    selectedButtonType,
    selectButtonType,
  } = useButtonsForVSR();

  const handleButtonPress = (type: ButtonType) => {
    selectButtonType(type);
    onButtonSelect?.(type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de Llamada</Text>
      <View style={styles.buttonsGrid}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.button,
              button.isActive && styles.buttonActive,
              button.isDisabled && styles.buttonDisabled,
            ]}
            onPress={() => handleButtonPress(button.type)}
            disabled={button.isDisabled}
          >
            <Text style={[
              styles.buttonText,
              button.isActive && styles.buttonTextActive,
              button.isDisabled && styles.buttonTextDisabled,
            ]}>
              {button.text}
            </Text>
            {button.isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      {selectedButtonType && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            Atendiendo: {selectedButtonType}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 16,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  buttonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#1E293B',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#E2E8F0',
  },
  buttonTextDisabled: {
    color: '#64748B',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22D3EE',
  },
  selectedInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#22D3EE',
  },
  selectedText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '600',
  },
});
