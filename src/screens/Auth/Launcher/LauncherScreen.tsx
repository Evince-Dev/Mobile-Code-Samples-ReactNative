import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../contexts/ThemeContext';
import { screenUtils } from '../../../utils/screenUtils';
import { useAppDispatch } from '../../../store';
import { setCredentials } from '../../../store/slices/authSlice';
import { StorageService } from '../../../services/storageService';
import { UserAuthData } from '../../../store/api/authApi';
import { styles } from './LauncherScreen.styles';

type Props = StackScreenProps<RootStackParamList, 'Launcher'>;

export const LauncherScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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

    const checkAuthAndNavigate = async () => {
      try {
        const token = await StorageService.getSecureItem('auth_token');
        const user = StorageService.getObject<UserAuthData>('auth_user');
        console.log('token:', token);
        console.log('user:', user);

        if (token) {
          dispatch(
            setCredentials({
              user: user || { id: 'usr_101', name: 'User', email: 'user@example.com' },
            })
          );
          navigation.replace('App');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('[LauncherScreen] Error checking auth status:', error);
        navigation.replace('Login');
      }
    };

    // Check auth and navigate after splash animation (2.2s)
    const timer = setTimeout(() => {
      checkAuthAndNavigate();
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
          {t('auth.tagline')}
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
