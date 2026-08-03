import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '../base/AppText';
import { AppView } from '../base/AppView';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';
import { SunIcon, MoonIcon } from '../icons';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const displayTitle = title ?? t('common.appName');
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleToggleTheme = () => {
    Animated.spring(rotateAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
    toggleTheme();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const scale = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.25, 1],
  });

  return (
    <AppView
      style={[
        styles.headerContainer,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      {/* Left: App Title */}
      <AppText weight="bold" style={styles.headerTitle} color={colors.primary}>
        {displayTitle}
      </AppText>

      {/* Right: Animated Theme Toggle Button */}
      <TouchableOpacity
        onPress={handleToggleTheme}
        style={[styles.themeButton, { backgroundColor: colors.secondary }]}
        activeOpacity={0.7}
        accessibilityLabel="Toggle Theme"
      >
        <Animated.View style={{ transform: [{ rotate: spin }, { scale }] }}>
          {isDark ? (
            <SunIcon width={18} height={18} color={colors.primary} />
          ) : (
            <MoonIcon width={18} height={18} color={colors.primary} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </AppView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: screenUtils.scaleHeight(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(16),
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: screenUtils.scaleFont(18),
    fontFamily: FONTS.GEIST_BOLD,
  },
  themeButton: {
    width: screenUtils.scaleSize(36),
    height: screenUtils.scaleSize(36),
    borderRadius: screenUtils.scaleSize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
