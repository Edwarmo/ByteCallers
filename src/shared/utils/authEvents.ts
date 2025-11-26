// Utilidad para manejar eventos de autenticación globalmente

type AuthEventCallback = () => void;

class AuthEventManager {
  private logoutCallbacks: AuthEventCallback[] = [];

  /**
   * Registra un callback que se ejecutará cuando se detecte un logout necesario
   */
  onLogoutRequired(callback: AuthEventCallback): () => void {
    this.logoutCallbacks.push(callback);
    
    // Retorna una función para desregistrar el callback
    return () => {
      const index = this.logoutCallbacks.indexOf(callback);
      if (index > -1) {
        this.logoutCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notifica a todos los listeners que se requiere logout
   */
  notifyLogoutRequired(): void {
    console.log('Notificando logout requerido a', this.logoutCallbacks.length, 'listeners');
    this.logoutCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error ejecutando callback de logout:', error);
      }
    });
  }
}

// Instancia singleton
export const authEventManager = new AuthEventManager();

