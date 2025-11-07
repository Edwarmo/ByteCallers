import React, { useState, useCallback } from 'react';
import './App.css';
import './src/infrastructure/ui/styles/scrollbar.css';
import './src/infrastructure/ui/styles/nightsky.css';
import { StatusBar } from 'expo-status-bar';
import LandingPage from './src/infrastructure/ui/pages/public/LandingPage';
import { LoginPage } from './src/infrastructure/ui/pages/auth/LoginPage';
import { CallCenterPage } from './src/infrastructure/ui/pages/app/CallCenterPage';
import { User } from './src/core/domain/entities/User';

export default function App() {
  // Mock user para desarrollo del dashboard
  const mockUser: User = {
    id: '1',
    phoneNumber: '+57 300 123 4567',
    role: 'agent',
    isBlocked: false,
    failedAttempts: 0,
  };

  const [currentView, setCurrentView] = useState<'public' | 'login' | 'app'>('public');
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
