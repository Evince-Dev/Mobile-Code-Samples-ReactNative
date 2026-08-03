import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { AppView, AppText } from '../base';
import { WifiOffIcon, WifiIcon } from '../icons';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

export interface NetworkStatusBannerProps {
  /** Optional custom position style */
  position?: 'top' | 'bottom';
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  position = 'top',
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isConnected, wasOffline, isChecking, checkConnection, resetWasOffline } = useNetwork();

  const slideAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOffline = isConnected === false;
  const showBanner = isOffline || wasOffline;

  useEffect(() => {
    if (showBanner) {
      // Slide IN
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide restored banner after 3.5 seconds
      if (!isOffline && wasOffline) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          hideBanner();
        }, 3500);
      }
    } else {
      hideBanner();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showBanner, isOffline, wasOffline]);

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetWasOffline();
    });
  };

  if (!showBanner) {
    return null;
  }

  const isRestored = !isOffline && wasOffline;
  const bannerBgColor = isRestored ? colors.success : colors.destructive;
  const textColor = '#FFFFFF';

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <AppView style={[styles.contentRow, { backgroundColor: bannerBgColor }]}>
        <AppView style={styles.iconWrapper}>
          {isRestored ? (
            <WifiIcon
              width={screenUtils.scaleSize(20)}
              height={screenUtils.scaleSize(20)}
              color={textColor}
            />
          ) : (
            <WifiOffIcon
              width={screenUtils.scaleSize(20)}
              height={screenUtils.scaleSize(20)}
              color={textColor}
            />
          )}
        </AppView>

        <AppText style={[styles.bannerText, { color: textColor }]}>
          {isRestored ? t('common.connectionRestored') : t('common.noInternetTitle')}
        </AppText>

        {!isRestored && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={checkConnection}
            disabled={isChecking}
            style={styles.retryButton}
          >
            {isChecking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText style={[styles.retryText, { color: textColor }]}>
                {t('common.retry')}
              </AppText>
            )}
          </TouchableOpacity>
        )}
      </AppView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: screenUtils.scaleWidth(12),
    right: screenUtils.scaleWidth(12),
    zIndex: 99999,
    elevation: 99999,
  },
  topPosition: {
    top: screenUtils.scaleHeight(50),
  },
  bottomPosition: {
    bottom: screenUtils.scaleHeight(24),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenUtils.scaleWidth(14),
    paddingVertical: screenUtils.scaleHeight(10),
    borderRadius: screenUtils.scaleSize(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  iconWrapper: {
    marginRight: screenUtils.scaleWidth(10),
  },
  bannerText: {
    flex: 1,
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(13),
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: screenUtils.scaleWidth(12),
    paddingVertical: screenUtils.scaleHeight(5),
    borderRadius: screenUtils.scaleSize(6),
    marginLeft: screenUtils.scaleWidth(8),
  },
  retryText: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(12),
    fontWeight: '700',
  },
});
