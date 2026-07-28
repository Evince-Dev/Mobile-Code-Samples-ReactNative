import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { AppView, AppText, AppActivityIndicator } from '../base';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

/**
 * AppLoader Component Props
 */
export interface AppLoaderProps {
  /** Controls modal overlay visibility */
  visible: boolean;
  /** Optional status message displayed below spinner */
  message?: string;
}

/**
 * AppLoader Component
 *
 * Reusable full-screen overlay component featuring an ActivityIndicator
 * spinner and custom status message for global asynchronous operations.
 */
export const AppLoader: React.FC<AppLoaderProps> = ({ visible, message }) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <AppView style={styles.overlay}>
        <AppView
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <AppActivityIndicator size="large" color={colors.primary} />
          {Boolean(message) && (
            <AppText
              style={styles.messageText}
              color={colors.foreground}
              align="center"
            >
              {message}
            </AppText>
          )}
        </AppView>
      </AppView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenUtils.scaleWidth(24),
  },
  container: {
    borderRadius: screenUtils.scaleSize(16),
    borderWidth: 1,
    padding: screenUtils.scaleSize(24),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: screenUtils.scaleWidth(160),
    maxWidth: '80%',
    gap: screenUtils.scaleHeight(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  messageText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
  },
});
