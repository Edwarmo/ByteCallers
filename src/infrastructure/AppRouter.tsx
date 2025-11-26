import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './ui/pages/auth/LoginPage';
import LandingPage from './ui/pages/public/LandingPage';
import { CallCenterPage } from './ui/pages/app/CallCenterPage';
import { User } from '../core/domain/entities/User';
import { AuthService } from './adapters/services/AuthService';
import { StorageUtils } from '../shared/utils/storage';
import { authEventManager } from '../shared/utils/authEvents';

/**
 * AppRouter es el componente principal de enrutamiento.
 * Gestiona qué vista principal se muestra: la página pública (Landing), login o dashboard.
 * Protege las rutas del dashboard verificando el token de autenticación.
 */
export const AppRouter = () => {
  const [view, setView] = useState<'public' | 'login' | 'dashboard' | 'loading'>('loading');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authService = new AuthService();

  // Función para manejar logout requerido (cuando el token expira)
  const handleLogoutRequired = useCallback(async () => {
    console.log('Logout requerido: Token expirado o inválido');
    try {
      await authService.logout();
      setCurrentUser(null);
      setView('login'); // Redirigir directamente al login
    } catch (error) {
      console.error('Error en logout requerido:', error);
      setCurrentUser(null);
      setView('login');
    }
  }, [authService]);

  // Verificar si hay un token válido al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await StorageUtils.getSecureItem('access_token');
        
        if (token) {
          // Verificar que el token sea válido y obtener el usuario
          const user = await authService.validateToken(token);
          
          if (user) {
            setCurrentUser(user);
            setView('dashboard');
          } else {
            // Token inválido, limpiar y mostrar login
            await authService.logout();
            setView('public');
          }
        } else {
          // No hay token, mostrar página pública
          setView('public');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setView('public');
      }
    };

    checkAuth();
  }, []);

  // Escuchar eventos de logout requerido (cuando el token expira en una petición)
  useEffect(() => {
    const unsubscribe = authEventManager.onLogoutRequired(handleLogoutRequired);
    
    // Limpiar el listener al desmontar
    return () => {
      unsubscribe();
    };
  }, [handleLogoutRequired]);

  const handleNavigate = (targetView: 'public' | 'login') => {
    setView(targetView);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setView('public');
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así, limpiar el estado local
      setCurrentUser(null);
      setView('public');
    }
  };

  // Proteger la ruta del dashboard
  const handleDashboardAccess = () => {
    // Si intentan acceder al dashboard sin autenticación, redirigir al login
    if (!currentUser) {
      setView('login');
      return null;
    }
    return <CallCenterPage user={currentUser} onLogout={handleLogout} />;
  };

  // Mostrar loading mientras se verifica la autenticación
  if (view === 'loading') {
    return null; // O puedes mostrar un componente de loading
  }

  // Renderiza la página correspondiente según el estado de 'view'.
  if (view === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === 'dashboard') {
    // Verificar nuevamente antes de renderizar
    if (!currentUser) {
      setView('login');
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    return <CallCenterPage user={currentUser} onLogout={handleLogout} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
};