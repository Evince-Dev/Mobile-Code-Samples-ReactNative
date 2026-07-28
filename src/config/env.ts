import { Platform } from 'react-native';

const getDefaultApiBaseUrl = (): string => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Android emulator maps 10.0.2.2 to host machine localhost. iOS simulator uses localhost.
  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
};

/**
 * Environment Configuration
 *
 * Centralized environment variable loader for the application.
 * Reads variables configured in .env files with reliable fallbacks.
 */
export const ENV = {
  /**
   * Base URL for backend REST API services
   */
  API_BASE_URL: getDefaultApiBaseUrl(),

  /**
   * Current app environment mode
   */
  IS_DEV: __DEV__,
};
