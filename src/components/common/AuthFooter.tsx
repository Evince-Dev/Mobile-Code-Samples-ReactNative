import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText, AppView } from '../base';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

interface AuthFooterProps {
  style?: ViewStyle;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  style,
  onTermsPress,
  onPrivacyPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <AppView style={[styles.container, style]}>
      <AppText style={styles.footerText} color={colors.textMuted}>
        {t('auth.byContinuing')}{' '}
        <AppText
          style={styles.footerLink}
          color={colors.foreground}
          onPress={onTermsPress}
        >
          {t('auth.terms')}
        </AppText>
        {' '}{t('auth.and')}{' '}
        <AppText
          style={styles.footerLink}
          color={colors.foreground}
          onPress={onPrivacyPress}
        >
          {t('auth.privacyPolicy')}
        </AppText>
      </AppText>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: screenUtils.scaleHeight(16),
    paddingBottom: screenUtils.scaleHeight(8),
    width: '100%',
  },
  footerText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(11),
    textAlign: 'center',
  },
  footerLink: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(11),
    textDecorationLine: 'underline',
  },
});
