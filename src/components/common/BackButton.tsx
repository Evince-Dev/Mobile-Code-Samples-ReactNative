import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from '../base/AppText';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

export interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  tx?: string;
  showText?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  title,
  tx = 'common.back',
  showText = true,
  color,
  style,
}) => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const resolvedColor = color || colors.textMuted;
  const resolvedText = title || (tx ? t(tx) : '');

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <AppTouchableOpacity
      activeOpacity={0.7}
      style={[styles.backButton, style]}
      onPress={handlePress}
    >
      <ArrowLeftIcon
        width={screenUtils.scaleSize(18)}
        height={screenUtils.scaleSize(18)}
        color={resolvedColor}
      />
      {showText && resolvedText ? (
        <AppText style={[styles.backText, { color: resolvedColor }]}>
          {resolvedText}
        </AppText>
      ) : null}
    </AppTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: screenUtils.scaleHeight(20),
    paddingVertical: screenUtils.scaleHeight(4),
    paddingRight: screenUtils.scaleWidth(8),
  },
  backText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
    marginLeft: screenUtils.scaleWidth(6),
  },
});
