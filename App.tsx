import React from 'react';
import './App.css';
import { AppRouter } from './src/infrastructure/AppRouter';
import { View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, overflow: 'auto', height: '100%' }}>
      <AppRouter />
    </View>
  );
}
