import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../../navigation/types';
import {
  BaseContainer,
  AppText,
  AppView,
  AppButton,
  AppHeadingBlock,
} from '../../../components/base';
import { AppHeader } from '../../../components/common/AppHeader';
import { AppLoader } from '../../../components/common/AppLoader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAlert } from '../../../contexts/AlertContext';
import { useAppDispatch, useAppSelector, useLogoutMutation } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import { StorageService } from '../../../services/storageService';
import { screenUtils } from '../../../utils/screenUtils';
import { SESSION_TIMEOUT_MS } from '../../../utils/Constants';
import { styles } from './HomeScreen.styles';

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

  const displayName = user?.name || '';
  const email = user?.email || '';

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
      title: t('common.logout'),
      message: t('common.logoutConfirmation'),
      type: 'warning',
      confirmText: t('common.logout'),
      cancelText: t('common.cancel'),
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
        title: t('common.sessionTimeout'),
        message: t('common.sessionTimeoutMessage'),
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
              {t('common.nameLabel')}
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
      <AppLoader visible={isLogoutLoading} message={t('common.loggingOut')} />
    </BaseContainer>
  );
};
