// App configuration
export const APP_CONFIG = {
  name: 'ByteCallers',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  auth: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    maxFailedAttempts: 3,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  ui: {
    theme: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3498db',
      background: '#f8f9fa',
      text: '#2c3e50',
    },
  },
};
