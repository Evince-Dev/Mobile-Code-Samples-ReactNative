import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

// Initialize MMKV instance for high-performance key-value storage
export const mmkvStorage = new MMKV();

/**
 * StorageService
 *
 * Centralized service to manage all local data persistence across the app:
 * - High-speed synchronous key-value & JSON storage via MMKV
 * - Encrypted secure storage via react-native-keychain (tokens, PINs, auth secrets)
 */
export const StorageService = {
  /**
   * Save a string value in MMKV storage
   */
  setItem(key: string, value: string): void {
    try {
      mmkvStorage.set(key, value);
    } catch (error) {
      console.error(`[StorageService] Failed to setItem for key "${key}":`, error);
    }
  },

  /**
   * Retrieve a string value from MMKV storage
   */
  getItem(key: string): string | null {
    try {
      const value = mmkvStorage.getString(key);
      return value ?? null;
    } catch (error) {
      console.error(`[StorageService] Failed to getItem for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Save an object or complex data structure in MMKV storage
   */
  setObject<T>(key: string, value: T): void {
    try {
      const jsonString = JSON.stringify(value);
      mmkvStorage.set(key, jsonString);
    } catch (error) {
      console.error(`[StorageService] Failed to setObject for key "${key}":`, error);
    }
  },

  /**
   * Retrieve an object from MMKV storage
   */
  getObject<T>(key: string): T | null {
    try {
      const jsonString = mmkvStorage.getString(key);
      if (!jsonString) return null;
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`[StorageService] Failed to getObject for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Remove an item from MMKV storage
   */
  removeItem(key: string): void {
    try {
      mmkvStorage.delete(key);
    } catch (error) {
      console.error(`[StorageService] Failed to removeItem for key "${key}":`, error);
    }
  },

  /**
   * Clear all non-secure MMKV storage items
   */
  clearAll(): void {
    try {
      mmkvStorage.clearAll();
    } catch (error) {
      console.error('[StorageService] Failed to clearAll MMKV storage:', error);
    }
  },

  /**
   * Securely save sensitive data (e.g. auth tokens, secrets) in Keychain
   */
  async saveSecureItem(key: string, value: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to saveSecureItem for service "${key}":`, error);
      return false;
    }
  },

  /**
   * Securely retrieve sensitive data from Keychain
   */
  async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials && credentials.password) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error(`[StorageService] Failed to getSecureItem for service "${key}":`, error);
      return null;
    }
  },

  /**
   * Securely remove sensitive data from Keychain
   */
  async removeSecureItem(key: string): Promise<boolean> {
    try {
      return await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.error(`[StorageService] Failed to removeSecureItem for service "${key}":`, error);
      return false;
    }
  },
};
