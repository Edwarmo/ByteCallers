import * as Crypto from 'expo-crypto';

export class SecurityUtils {
  // Generar hash seguro para contraseñas
  static async hashPassword(password: string): Promise<string> {
    const salt = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${password}_${Date.now()}_salt`
    );
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${password}_${salt}`
    );
  }

  // Generar token JWT simulado
  static generateJWT(userId: string, role: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    }));
    const signature = btoa(`signature_${userId}_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  // Validar token JWT
  static validateJWT(token: string): { valid: boolean; payload?: any } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false };
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp < now) return { valid: false };
      
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }

  // Sanitizar entrada para prevenir XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '')
      .trim()
      .substring(0, 255);
  }

  // Rate limiting simple
  private static attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    if (now - record.lastAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    record.lastAttempt = now;
    return true;
  }
}
