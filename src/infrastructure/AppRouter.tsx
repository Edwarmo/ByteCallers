import React, { useState } from 'react';
import { User } from '../core/domain/entities/User';
import LandingPage from './ui/pages/public/LandingPage';
import { LoginPage } from './ui/pages/auth/LoginPage';
import { CallCenterPage } from './ui/pages/app/CallCenterPage';

type Route = '/' | '/login' | '/dashboard' | '/tickets' | '/calls';

export const AppRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [user, setUser] = useState<User | null>(null);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  const handleLoginSuccess = (loggedUser: User, token: string) => {
    setUser(loggedUser);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage onNavigate={(view) => navigate(view === 'login' ? '/login' : '/')} />;
      case '/login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case '/dashboard':
      case '/tickets':
      case '/calls':
        return user ? (
          <CallCenterPage user={user} onLogout={handleLogout} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        );
      default:
        return <LandingPage onNavigate={(view) => navigate(view === 'login' ? '/login' : '/')} />;
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname as Route);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return <>{renderRoute()}</>;
};
