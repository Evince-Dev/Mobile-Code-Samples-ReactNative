import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { StorageService } from '../../services/storageService';

/**
 * Centralized Base API for RTK Query
 *
 * Handles base URL configuration, header injection (secure auth token from Keychain),
 * tag invalidation, and endpoint injection support.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const token = await StorageService.getSecureItem('auth_token');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('[RTK Query] Error preparing auth headers:', error);
      }
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth', 'User'],
  endpoints: () => ({}),
});
