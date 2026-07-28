import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText, AppView } from '../base';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

interface AuthTopBarProps {
  style?: ViewStyle;
  containerWrapperStyle?: ViewStyle;
}

export const AuthTopBar: React.FC<AuthTopBarProps> = ({ style, containerWrapperStyle }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <AppView style={[styles.containerWrapperStyle, containerWrapperStyle]}>
      <AppView style={[styles.topBar, style]}>
        <AppText weight="bold" style={styles.appName} color={colors.primary}>
          {t('common.appName')}
        </AppText>
        <AppText style={styles.byTag} color={colors.textMuted}>
          {t('auth.byEvince')}
        </AppText>
      </AppView>
      {/* ── Decorative Green Accent Bar ── */}
      <AppView style={[styles.accentBar, { backgroundColor: colors.rnSampleAccentBar }]} />
    </AppView>
  );
};

const styles = StyleSheet.create({
  containerWrapperStyle: {
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(44),
  },
  appName: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(22),
  },
  byTag: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(11),
    textTransform: 'uppercase',
  },
  accentBar: {
    height: screenUtils.scaleSize(4),
    width: screenUtils.scaleWidth(48),
    borderRadius: 9999,
    marginBottom: screenUtils.scaleHeight(24),
  },
});
