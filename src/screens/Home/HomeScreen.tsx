import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../navigation/types';
import {
  BaseContainer,
  AppText,
  AppView,
  AppButton,
  AppHeadingBlock,
} from '../../components/base';
import { AppHeader } from '../../components/common/AppHeader';
import { AppLoader } from '../../components/common/AppLoader';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { useAppDispatch, useAppSelector, useLogoutMutation } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { StorageService } from '../../services/storageService';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';
import { SESSION_TIMEOUT_MS } from '../../utils/Constants';

type NavigationProp = StackNavigationProp<RootStackParamList, 'App'>;

/**
 * HomeScreen Component
 *
 * Represents the authenticated dashboard landing screen.
 * Handles active user session details, 5-minute session timeout management,
 * and secure logout execution with loading indicators and alert dialogs.
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();

  const displayName = user?.name || 'Sample User';
  const email = user?.email || 'user@example.com';

  /**
   * Executes the API logout request, clears secure storage tokens,
   * resets client authentication Redux state, and navigates back to the Login screen.
   */
  const performLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await logoutMutation().unwrap();
    } catch (e) {
      console.log('Error logging out via API', e);
      await StorageService.removeSecureItem('auth_token');
    } finally {
      setIsLogoutLoading(false);
      dispatch(logout());
      navigation.replace('Login');
    }
  };

  /**
   * Triggers the user-initiated logout confirmation dialog using AlertContext.
   */
  const handleLogoutClick = () => {
    showAlert({
      title: t('common.logout') || 'Log Out',
      message: t('common.logoutConfirmation') || 'Are you sure you want to log out?',
      type: 'warning',
      confirmText: t('common.logout') || 'Log Out',
      cancelText: t('common.cancel') || 'Cancel',
      onConfirm: performLogout,
    });
  };

  /**
   * Session Timeout Effect
   *
   * Automatically monitors user session duration against SESSION_TIMEOUT_MS (5 minutes).
   * Displays the Session Timeout alert dialog upon expiration and triggers performLogout.
   */
  React.useEffect(() => {
    const sessionTimer = setTimeout(() => {
      showAlert({
        title: t('common.sessionTimeout') || 'Session Timeout',
        message: t('common.sessionTimeoutMessage') || 'Your session has timed out after 5 minutes. Please sign in again.',
        type: 'warning',
        onConfirm: performLogout,
        onClose: performLogout,
      });
    }, SESSION_TIMEOUT_MS);

    return () => clearTimeout(sessionTimer);
  }, []);

  return (
    <BaseContainer
      header={<AppHeader />}
      scrollable
      horizontalPadding={screenUtils.scaleWidth(20)}
      verticalPadding={screenUtils.scaleHeight(24)}
    >
      <AppView style={styles.container}>
        {/* ── Greeting Block ── */}
        <AppHeadingBlock
          title={`${t('dashboard.greeting', { name: displayName })}`}
          subtitle={t('dashboard.authSuccessMessage')}
          containerStyle={styles.headingBlock}
        />

        {/* ── User Session Card ── */}
        <AppView
          style={[
            styles.userCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <AppView style={styles.cardHeaderRow}>
            <AppView style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <AppText weight="bold" style={styles.statusText} color={colors.foreground}>
              {t('dashboard.sessionActive')}
            </AppText>
          </AppView>

          <AppView style={styles.infoRow}>
            <AppText variant="muted" style={styles.label}>
              {t('common.nameLabel') || 'Name'}
            </AppText>
            <AppText weight="semibold" style={styles.value}>
              {displayName}
            </AppText>
          </AppView>

          <AppView style={styles.infoRow}>
            <AppText variant="muted" style={styles.label}>
              {t('dashboard.loggedInAs')}
            </AppText>
            <AppText weight="semibold" style={styles.value}>
              {email}
            </AppText>
          </AppView>
        </AppView>

        {/* ── Sample App Info Card ── */}
        <AppView
          style={[
            styles.infoCard,
            {
              backgroundColor: `${colors.primary}0D`,
              borderColor: `${colors.primary}33`,
            },
          ]}
        >
          <AppText weight="bold" style={styles.infoTitle} color={colors.primary}>
            {t('dashboard.welcomeTitle')}
          </AppText>
          <AppText variant="muted" style={styles.infoBody}>
            {t('dashboard.welcomeBody')}
          </AppText>
        </AppView>

        {/* ── Log Out Button ── */}
        <AppButton
          title={t('dashboard.logoutButton')}
          onPress={handleLogoutClick}
          variant="destructive"
          size="lg"
          style={styles.logoutBtn}
        />
      </AppView>

      {/* ── Common Loader ── */}
      <AppLoader visible={isLogoutLoading} message={t('common.loggingOut') || 'Logging out...'} />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: screenUtils.scaleHeight(20),
  },
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(4),
  },
  userCard: {
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    padding: screenUtils.scaleSize(16),
    gap: screenUtils.scaleHeight(12),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(8),
    marginBottom: screenUtils.scaleHeight(4),
  },
  statusDot: {
    width: screenUtils.scaleSize(10),
    height: screenUtils.scaleSize(10),
    borderRadius: screenUtils.scaleSize(5),
  },
  statusText: {
    fontSize: screenUtils.scaleFont(15),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: screenUtils.scaleHeight(4),
  },
  label: {
    fontSize: screenUtils.scaleFont(13),
  },
  value: {
    fontSize: screenUtils.scaleFont(14),
    fontFamily: FONTS.GEIST_MEDIUM,
  },
  infoCard: {
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    padding: screenUtils.scaleSize(16),
    gap: screenUtils.scaleHeight(8),
  },
  infoTitle: {
    fontSize: screenUtils.scaleFont(15),
  },
  infoBody: {
    fontSize: screenUtils.scaleFont(13),
    lineHeight: screenUtils.scaleFont(13) * 1.45,
  },
  logoutBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },
});
