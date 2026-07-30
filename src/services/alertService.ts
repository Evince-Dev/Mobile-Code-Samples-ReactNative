import { AlertConfig, SnackbarConfig } from '../contexts/AlertContext';

type AlertListener = (config: AlertConfig) => void;
type SnackbarListener = (config: SnackbarConfig) => void;

/**
 * Global Alert Service
 * Bridges non-React code (API endpoints, RTK Query middleware, services)
 * with the React AlertContext system to trigger global Alert Modals and Snackbars.
 */
export class AlertService {
  private static alertListener: AlertListener | null = null;
  private static snackbarListener: SnackbarListener | null = null;

  static registerAlertListener(listener: AlertListener) {
    this.alertListener = listener;
  }

  static registerSnackbarListener(listener: SnackbarListener) {
    this.snackbarListener = listener;
  }

  static showAlert(config: AlertConfig) {
    if (this.alertListener) {
      this.alertListener(config);
    } else {
      console.warn('[AlertService] showAlert called before AlertProvider was initialized');
    }
  }

  static showSnackbar(config: SnackbarConfig) {
    if (this.snackbarListener) {
      this.snackbarListener(config);
    }
  }
}
