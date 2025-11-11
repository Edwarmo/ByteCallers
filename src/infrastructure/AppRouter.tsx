import React, { useState } from 'react';
import LoginPage from './ui/pages/auth/LoginPage';
import LandingPage from './ui/pages/public/LandingPage';

/**
 * AppRouter es el componente principal de enrutamiento.
 * Gestiona qué vista principal se muestra: la página pública (Landing) o la de login.
 */
export const AppRouter = () => {
  const [view, setView] = useState<'public' | 'login'>('public');

  const handleNavigate = (targetView: 'public' | 'login') => {
    setView(targetView);
  };

  // Renderiza la página correspondiente según el estado de 'view'.
  // Pasamos la función `handleNavigate` a LandingPage para que pueda cambiar la vista.
  if (view === 'login') {
    return <LoginPage />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
};