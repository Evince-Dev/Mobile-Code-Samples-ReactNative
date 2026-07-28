import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from '../base/AppText';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { GoogleIcon } from '../icons/GoogleIcon';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

export interface GoogleButtonProps {
  onPress?: () => void;
  title?: string;
  tx?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  title,
  tx = 'auth.continueWithGoogle',
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const resolvedText = title || (tx ? t(tx) : '');

  return (
    <AppTouchableOpacity
      style={[
        styles.googleBtn,
        { backgroundColor: colors.card, borderColor: colors.border },
        disabled && { opacity: 0.6 },
        style,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
    >
      <GoogleIcon
        width={screenUtils.scaleSize(20)}
        height={screenUtils.scaleSize(20)}
      />
      <AppText
        weight="medium"
        style={[styles.googleBtnText, { color: colors.foreground }, textStyle]}
      >
        {resolvedText}
      </AppText>
    </AppTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenUtils.scaleHeight(48),
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    paddingHorizontal: screenUtils.scaleWidth(16),
    marginBottom: screenUtils.scaleHeight(24),
  },
  googleBtnText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
    marginLeft: screenUtils.scaleWidth(12),
  },
});
