import React, { useState, useCallback } from 'react';
import './App.css';
import './src/styles/scrollbar.css';
import './src/styles/nightsky.css';
import { StatusBar } from 'expo-status-bar';
import LandingPage from './src/clientPortal/views/LandingPage';
import { LoginPage } from './src/pages/LoginPage';
import { CallCenterPage } from './src/pages/call/CallCenterPage';
import { User } from './src/business/entities/user/model';

export default function App() {
  // Mock user para desarrollo del dashboard
  const mockUser: User = {
    id: '1',
    phoneNumber: '+57 300 123 4567',
    role: 'agent',
    isBlocked: false,
    failedAttempts: 0,
  };

  const [currentView, setCurrentView] = useState<'public' | 'login' | 'app'>('public'); // Mostrar landing page
  const [auth, setAuth] = useState<{ user: User | null; token: string | null; isAuthenticated: boolean }>({
    user: mockUser, // Usuario mock
    token: 'mock-token',
    isAuthenticated: true,
  });

  const handleLoginSuccess = useCallback((user: User, token: string) => {
    setAuth({ user, token, isAuthenticated: true });
    setCurrentView('app');
  }, []);

  const handleLogout = useCallback(() => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    setCurrentView('public');
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'public':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'app':
        return <CallCenterPage user={auth.user} onLogout={handleLogout} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      {renderView()}
      <StatusBar style="auto" />
    </>
  );
}
