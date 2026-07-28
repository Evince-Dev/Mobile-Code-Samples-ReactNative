import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

type Props = StackScreenProps<RootStackParamList, 'Launcher'>;

export const LauncherScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const accentWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Accent bar after logo
      Animated.parallel([
        Animated.timing(accentWidth, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Navigate to Login after 2.2s
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const accentInterpolated = accentWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenUtils.scaleWidth(48)],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Center branding block */}
      <View style={styles.centerBlock}>
        {/* Animated accent bar */}
        <Animated.View
          style={[
            styles.accentBar,
            {
              backgroundColor: '#16A34A', // green-600 from design
              width: accentInterpolated,
            },
          ]}
        />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.Text style={[styles.wordmarkText, { color: colors.primary }]}>
            {t('common.appName')}
          </Animated.Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[styles.tagline, { color: colors.textMuted, opacity: taglineOpacity }]}
        >
          AUTH & LOGIN SAMPLE
        </Animated.Text>
      </View>

      {/* Bottom footer */}
      <View style={styles.footer}>
        <View style={[styles.footerDot, { backgroundColor: colors.border }]} />
        <View style={[styles.footerDot, { backgroundColor: '#16A34A' }]} />
        <View style={[styles.footerDot, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: screenUtils.scaleWidth(32),
    width: '100%',
  },
  accentBar: {
    height: screenUtils.scaleSize(4),
    borderRadius: 9999,
    marginBottom: screenUtils.scaleHeight(28),
  },
  logoContainer: {
    marginBottom: screenUtils.scaleHeight(10),
  },
  climbText: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(48),
    fontWeight: '400',
    letterSpacing: -1.5,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkText: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(48),
    fontWeight: '400',
  },
  tagline: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(13),
    fontWeight: '400',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    gap: screenUtils.scaleSize(6),
    paddingBottom: screenUtils.scaleHeight(40),
    alignItems: 'center',
  },
  footerDot: {
    width: screenUtils.scaleSize(6),
    height: screenUtils.scaleSize(6),
    borderRadius: 9999,
  },
});
