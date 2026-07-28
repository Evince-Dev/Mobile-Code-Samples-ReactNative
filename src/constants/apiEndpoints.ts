/**
 * API Endpoints Constants
 *
 * Centralized registry of all application REST API endpoint routes.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    CHANGE_PASSWORD: '/user/change-password',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAILS: (id: string) => `/transactions/${id}`,
    ADD_NOTE: (id: string) => `/transactions/${id}/note`,
    CATEGORIES: '/transactions/categories',
  },
  ACCOUNTS: {
    LIST: '/accounts',
    LINKED: '/accounts/linked',
  },
} as const;
