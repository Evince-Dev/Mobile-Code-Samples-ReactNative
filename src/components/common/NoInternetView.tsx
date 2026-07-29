import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { AppView, AppText, AppButton } from '../base';
import { WifiOffIcon } from '../icons';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

export interface NoInternetViewProps {
  /**
   * When true or omitted (default), controls visibility based on network connection.
   * Pass explicit boolean to override automatic network state detection.
   */
  visible?: boolean;
  /** Optional custom retry callback. Defaults to calling checkConnection() from NetworkContext. */
  onRetry?: () => void | Promise<void>;
  /** Title text override */
  title?: string;
  /** Message text override */
  message?: string;
  /** When true (default), renders as a modal overlay over the screen. */
  fullScreen?: boolean;
  /** Optional extra container style */
  style?: StyleProp<ViewStyle>;
}

export const NoInternetView: React.FC<NoInternetViewProps> = ({
  visible,
  onRetry,
  title,
  message,
  style,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isConnected, isChecking, checkConnection } = useNetwork();
  const [loading, setLoading] = useState(false);

  // If visible prop is explicitly provided, use it. Otherwise, show when isConnected === false.
  const isOffline = visible !== undefined ? visible : isConnected === false;

  if (!isOffline) {
    return null;
  }

  const handleRetry = async () => {
    setLoading(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        await checkConnection();
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonLoading = loading || isChecking;

  const content = (
    <AppView style={[styles.container, { backgroundColor: colors.background }, style]}>
      {/* Icon Badge */}
      <AppView style={[styles.iconContainer, { backgroundColor: colors.destructive + '15' }]}>
        <WifiOffIcon
          width={screenUtils.scaleSize(48)}
          height={screenUtils.scaleSize(48)}
          color={colors.destructive}
        />
      </AppView>

      {/* Heading */}
      <AppText
        style={[
          styles.title,
          {
            color: colors.foreground,
            fontSize: screenUtils.scaleFont(20),
          },
        ]}
      >
        {title || t('common.noInternetTitle')}
      </AppText>

      {/* Message */}
      <AppText
        style={[
          styles.message,
          {
            color: colors.textMuted,
            fontSize: screenUtils.scaleFont(14),
          },
        ]}
      >
        {message || t('common.noInternetMessage')}
      </AppText>

      {/* Retry Action Button */}
      <AppButton
        title={t('common.retry')}
        onPress={handleRetry}
        loading={isButtonLoading}
        style={styles.retryButton}
      />
    </AppView>
  );

  return (
    <Modal transparent visible={isOffline} animationType="fade" statusBarTranslucent>
      <AppView style={styles.modalOverlay}>{content}</AppView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenUtils.scaleWidth(24),
  },
  iconContainer: {
    width: screenUtils.scaleSize(96),
    height: screenUtils.scaleSize(96),
    borderRadius: screenUtils.scaleSize(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenUtils.scaleHeight(24),
  },
  title: {
    fontFamily: FONTS.GEIST_BOLD,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: screenUtils.scaleHeight(12),
  },
  message: {
    fontFamily: FONTS.GEIST_REGULAR,
    textAlign: 'center',
    lineHeight: screenUtils.scaleFont(20),
    marginBottom: screenUtils.scaleHeight(32),
    maxWidth: screenUtils.scaleWidth(300),
  },
  retryButton: {
    width: screenUtils.scaleWidth(220),
    alignSelf: 'center',
  },
});
