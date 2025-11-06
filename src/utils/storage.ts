import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Wrapper para manejar diferencias entre plataformas
export class StorageUtils {
  static async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // En web, usar localStorage como fallback
      localStorage.setItem(`secure_${key}`, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(`secure_${key}`);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  static async deleteSecureItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(`secure_${key}`);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  static async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
