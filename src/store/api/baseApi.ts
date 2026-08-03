import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { StorageService, AlertService, NavigationService } from '../../services';
import { AlertType } from '../../contexts/AlertContext';
import { logout } from '../slices/authSlice';
import i18n from '../../utils/i18n';

/**
 * Options to customize automatic error alerts/snackbars on a per-endpoint basis.
 */
export interface ApiExtraOptions {
  showError?: boolean; // Defaults to true
  displayType?: 'alert' | 'snackbar'; // Defaults to 'alert'
  alertType?: AlertType; // Defaults to 'error'
  showTwoButtons?: boolean; // Defaults to false (single button OK)
  title?: string;
  titleTx?: string;
  confirmText?: string;
  confirmTx?: string;
  cancelText?: string;
  cancelTx?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const rawBaseQuery = fetchBaseQuery({
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
});

/**
 * Custom baseQuery wrapper with global, dynamic error handling via AlertService.
 * Automatically clears session & navigates to Login on 401 (Unauthorized) status.
 */
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ApiExtraOptions
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const is401 = result.error.status === 401;

    // Handle 401 Unauthorized: Clear session, storage, and redirect to Login screen
    if (is401) {
      api.dispatch(logout());
      await StorageService.removeSecureItem('auth_token');
      StorageService.removeItem('auth_user');
      NavigationService.replace('Login');
    }

    const showError = extraOptions?.showError ?? true;

    if (showError) {
      const errorData = result.error.data as any;
      const defaultMessage = is401
        ? i18n.t('auth.sessionExpired', { defaultValue: 'Session Expired' })
        : i18n.t('common.unknownError', { defaultValue: 'Something went wrong. Please try again.' });

      const apiErrorMessage =
        errorData?.message ||
        errorData?.error ||
        (typeof result.error.data === 'string' ? result.error.data : null) ||
        defaultMessage;

      const displayType = extraOptions?.displayType ?? 'alert';
      const alertType = extraOptions?.alertType ?? (is401 ? 'warning' : 'error');

      if (displayType === 'snackbar') {
        AlertService.showSnackbar({
          message: extraOptions?.title ? `${extraOptions.title}: ${apiErrorMessage}` : apiErrorMessage,
          type: alertType,
        });
      } else {
        const showTwoButtons =
          extraOptions?.showTwoButtons ??
          Boolean(extraOptions?.cancelText || extraOptions?.cancelTx || extraOptions?.onCancel);
        setTimeout(() => {
          AlertService.showAlert({
            title:
              extraOptions?.title ||
              (is401
                ? i18n.t('auth.sessionExpired', { defaultValue: 'Session Expired' })
                : i18n.t('common.error', { defaultValue: 'Error' })),
            titleTx: extraOptions?.titleTx,
            message: apiErrorMessage,
            type: alertType,
            showTwoButtons,
            confirmText: extraOptions?.confirmText,
            confirmTx: extraOptions?.confirmTx,
            cancelText: extraOptions?.cancelText,
            cancelTx: extraOptions?.cancelTx,
            onConfirm: extraOptions?.onConfirm,
            onCancel: extraOptions?.onCancel,
          });
        }, 1000)

      }
    }
  }

  return result;
};

/**
 * Centralized Base API for RTK Query
 *
 * Handles base URL configuration, header injection (secure auth token from Keychain),
 * tag invalidation, endpoint injection support, and centralized dynamic error handling.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Auth', 'User'],
  endpoints: () => ({}),
});

