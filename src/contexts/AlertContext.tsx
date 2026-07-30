/**
 * Alert Context
 * Provides a global Alert system using AppModal and AppSnackbar
 */

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, Animated, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppModal, AppText, AppButton, AppView } from '../components/base';
import { CloseIcon } from '../components/icons';
import { useTheme } from './ThemeContext';
import { screenUtils } from '../utils/screenUtils';
import { FONT_WEIGHTS } from '../utils/fontConstants';
import { AlertService } from '../services/alertService';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

export interface AlertConfig {
  title?: string;
  titleTx?: string;
  message: string;
  messageTx?: string;
  type?: AlertType;
  confirmText?: string;
  confirmTx?: string;
  cancelText?: string;
  cancelTx?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface SnackbarConfig {
  message: string;
  messageTx?: string;
  type?: AlertType;
  duration?: number;
}

interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
  showSnackbar: (config: SnackbarConfig) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// ── Alert Icon Component ──
const AlertBadgeIcon: React.FC<{ type: AlertType; color: string }> = ({ type, color }) => {
  if (type === 'error') {
    return (
      <AppText style={{ fontSize: 24, fontWeight: '700', color }}>
        ✕
      </AppText>
    );
  }
  if (type === 'success') {
    return (
      <AppText style={{ fontSize: 24, fontWeight: '700', color }}>
        ✓
      </AppText>
    );
  }
  if (type === 'warning') {
    return (
      <AppText style={{ fontSize: 24, fontWeight: '700', color }}>
        !
      </AppText>
    );
  }
  return (
    <AppText style={{ fontSize: 24, fontWeight: '700', color }}>
      i
    </AppText>
  );
};

// ── Global Snackbar Component ──
const GlobalSnackbar: React.FC<
  SnackbarConfig & { visible: boolean; onDismiss: () => void }
> = ({ visible, message, messageTx, type = 'info', duration = 3500, onDismiss }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
    }
  }, [visible, duration]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const displayMessage = messageTx ? t(messageTx) : message;

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return colors.destructive;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.snackbarContainer,
        {
          backgroundColor: getBgColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <AppText style={styles.snackbarText} color={colors.card}>
        {displayMessage}
      </AppText>
      <Pressable onPress={dismiss} style={styles.snackbarClose}>
        <CloseIcon width={16} height={16} color={colors.card} />
      </Pressable>
    </Animated.View>
  );
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [snackbarConfig, setSnackbarConfig] = useState<
    SnackbarConfig & { visible: boolean }
  >({
    visible: false,
    message: '',
    type: 'info',
  });

  const showAlert = useCallback((config: AlertConfig) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlertConfig(config);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setAlertConfig(null);
    }, 300);
  }, []);

  const showSnackbar = useCallback((config: SnackbarConfig) => {
    setSnackbarConfig({
      ...config,
      visible: true,
    });
  }, []);

  useEffect(() => {
    AlertService.registerAlertListener(showAlert);
    AlertService.registerSnackbarListener(showSnackbar);
  }, [showAlert, showSnackbar]);

  const handleCancel = useCallback(() => {
    if (alertConfig?.onCancel) {
      alertConfig.onCancel();
    }
    hideAlert();
  }, [alertConfig, hideAlert]);

  const handleConfirm = useCallback(() => {
    if (alertConfig?.onConfirm) {
      alertConfig.onConfirm();
    }
    hideAlert();
  }, [alertConfig, hideAlert]);

  const handleClose = useCallback(() => {
    if (alertConfig?.onClose) {
      alertConfig.onClose();
    }
    hideAlert();
  }, [alertConfig, hideAlert]);

  const alertType: AlertType = alertConfig?.type || 'info';

  const getTypeColors = (type: AlertType) => {
    switch (type) {
      case 'error':
        return {
          badgeBg: (colors.destructive) + '1A',
          badgeColor: colors.destructive,
          btnVariant: 'destructive' as const,
          defaultTitle: 'Error',
        };
      case 'success':
        return {
          badgeBg: (colors.success) + '1A',
          badgeColor: colors.success,
          btnVariant: 'primary' as const,
          defaultTitle: 'Success',
        };
      case 'warning':
        return {
          badgeBg: (colors.warning) + '1A',
          badgeColor: colors.warning,
          btnVariant: 'primary' as const,
          defaultTitle: 'Warning',
        };
      default:
        return {
          badgeBg: (colors.primary) + '1A',
          badgeColor: colors.primary,
          btnVariant: 'primary' as const,
          defaultTitle: 'Notice',
        };
    }
  };

  const currentTypeColors = getTypeColors(alertType);

  const titleText = alertConfig
    ? alertConfig.titleTx
      ? t(alertConfig.titleTx)
      : alertConfig.title || currentTypeColors.defaultTitle
    : '';

  const messageText = alertConfig
    ? alertConfig.messageTx
      ? t(alertConfig.messageTx)
      : alertConfig.message
    : '';

  const confirmBtnText = alertConfig
    ? alertConfig.confirmTx
      ? t(alertConfig.confirmTx)
      : alertConfig.confirmText || 'OK'
    : 'OK';

  const cancelBtnText = alertConfig
    ? alertConfig.cancelTx
      ? t(alertConfig.cancelTx)
      : alertConfig.cancelText || 'Cancel'
    : 'Cancel';

  const hasCancel = Boolean(alertConfig?.cancelText || alertConfig?.cancelTx || alertConfig?.onCancel);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, showSnackbar }}>
      {children}

      {/* Global Alert Modal utilizing AppModal */}
      {alertConfig && (
        <AppModal visible={visible} onClose={handleClose} useSpringScale>
          <AppView style={styles.modalContent}>
            {/* Badge Icon */}
            <AppView
              style={[
                styles.badgeContainer,
                { backgroundColor: currentTypeColors.badgeBg },
              ]}
            >
              <AlertBadgeIcon type={alertType} color={currentTypeColors.badgeColor} />
            </AppView>

            {/* Title */}
            <AppText
              style={styles.modalTitle}
              color={colors.foreground}
              align="center"
            >
              {titleText}
            </AppText>

            {/* Message */}
            <AppText
              style={styles.modalMessage}
              color={colors.textMuted}
              align="center"
            >
              {messageText}
            </AppText>

            {/* Buttons Row */}
            <AppView style={styles.buttonRow}>
              {hasCancel && (
                <AppButton
                  title={cancelBtnText}
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.actionBtn}
                />
              )}
              <AppButton
                title={confirmBtnText}
                variant={currentTypeColors.btnVariant}
                onPress={handleConfirm}
                style={styles.actionBtn}
              />
            </AppView>
          </AppView>
        </AppModal>
      )}

      {/* Global Snackbar */}
      <GlobalSnackbar
        visible={snackbarConfig.visible}
        message={snackbarConfig.message}
        messageTx={snackbarConfig.messageTx}
        type={snackbarConfig.type}
        duration={snackbarConfig.duration}
        onDismiss={() => setSnackbarConfig((prev) => ({ ...prev, visible: false }))}
      />
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    paddingVertical: screenUtils.scaleHeight(8),
  },
  badgeContainer: {
    width: screenUtils.scaleWidth(56),
    height: screenUtils.scaleWidth(56),
    borderRadius: screenUtils.scaleWidth(28),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(16),
  },
  modalTitle: {
    fontSize: screenUtils.scaleFont(18),
    fontWeight: FONT_WEIGHTS.BOLD,
    marginBottom: screenUtils.scaleHeight(8),
  },
  modalMessage: {
    fontSize: screenUtils.scaleFont(14),
    lineHeight: screenUtils.scaleFont(20),
    marginBottom: screenUtils.scaleHeight(24),
    paddingHorizontal: screenUtils.scaleWidth(8),
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(12),
    width: '100%',
  },
  actionBtn: {
    flex: 1,
  },
  snackbarContainer: {
    position: 'absolute',
    top: screenUtils.scaleHeight(50),
    left: screenUtils.scaleWidth(16),
    right: screenUtils.scaleWidth(16),
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(16),
    paddingVertical: screenUtils.scaleHeight(12),
    borderRadius: screenUtils.scaleWidth(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  snackbarText: {
    flex: 1,
    fontSize: screenUtils.scaleFont(14),
    fontWeight: FONT_WEIGHTS.MEDIUM,
    marginRight: screenUtils.scaleWidth(8),
  },
  snackbarClose: {
    padding: screenUtils.scaleWidth(4),
  },
});
