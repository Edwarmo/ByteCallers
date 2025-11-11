import React from 'react';
import './App.css';
import './src/infrastructure/ui/styles/scrollbar.css';
import './src/infrastructure/ui/styles/nightsky.css';
import './src/infrastructure/ui/styles/client.css';
import './src/infrastructure/ui/styles/system.css';
import { AppRouter } from './src/infrastructure/AppRouter';

export default function App() {
  return <AppRouter />;
}
