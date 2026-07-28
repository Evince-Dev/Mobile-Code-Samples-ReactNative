/**
 * Application Global Constants
 *
 * Centralized registry of static configuration constants, app branding,
 * and session timing parameters.
 */
export const CONSTANTS = {
  /** Global Application Branding Name */
  APP_NAME: 'RN Sample',

  /**
   * Session duration timeout in milliseconds.
   * 300000 ms = 5 minutes session timeout before automatic logout notification.
   */
  SESSION_TIMEOUT_MS: 300000,
} as const;

export const APP_NAME = CONSTANTS.APP_NAME;
export const SESSION_TIMEOUT_MS = CONSTANTS.SESSION_TIMEOUT_MS;

export * from '../constants/apiEndpoints';
