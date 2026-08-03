import { baseApi } from './baseApi';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { StorageService, NavigationService } from '../../services';
import { setCredentials, setGoogleLoading } from '../slices/authSlice';

/**
 * Authentication API Types
 */

export interface LoginRequest {
  email: string;
  password?: string;
  code?: string;
}

export interface UserAuthData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserAuthData;
  message?: string;
}

export interface AuthErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Auth API Endpoints injected into RTK Query baseApi
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login endpoint mutation
     * POST /auth/login
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      extraOptions: {
        displayType: 'snackbar',
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            await StorageService.saveSecureItem('auth_token', data.token);
          }
          if (data?.user) {
            StorageService.setObject('auth_user', data.user);
            dispatch(setCredentials({ user: data.user }));
          }
          // Hide loader modal
          dispatch(setGoogleLoading(false));
          // Replace stack to App screen
          setTimeout(() => {
            NavigationService.replace('App');
          }, 150);
        } catch (error: any) {
          console.log('[authApi] Login query error:', error);
          // Hide loader modal
          dispatch(setGoogleLoading(false));
        }
      },
    }),
    /**
     * Logout endpoint mutation
     * POST /auth/logout
     */
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          await StorageService.removeSecureItem('auth_token');
          StorageService.removeItem('auth_user');
        } catch (error) {
          console.error('[authApi] Logout query error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation } = authApi;
