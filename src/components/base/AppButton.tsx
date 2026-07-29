import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from './AppText';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  tx?: string;
  txOptions?: Record<string, any>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  tx,
  txOptions,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  children,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loopAnimation: Animated.CompositeAnimation | null = null;
    if (loading) {
      spinAnim.setValue(0);
      loopAnimation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loopAnimation.start();
    } else {
      spinAnim.setValue(0);
    }
    return () => {
      if (loopAnimation) {
        loopAnimation.stop();
      }
    };
  }, [loading]);

  const handlePressIn = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
    onPressOut?.(e);
  };

  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary, borderWidth: 0 };
      case 'outline':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'destructive':
        return { backgroundColor: colors.destructive, borderWidth: 0 };
      case 'ghost':
        return { backgroundColor: 'transparent', borderWidth: 0 };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.secondaryForeground;
      case 'outline':
      case 'ghost':
        return colors.foreground;
      case 'destructive':
        return '#FFFFFF';
      case 'primary':
      default:
        return colors.primaryForeground;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          height: screenUtils.scaleHeight(32),
          paddingHorizontal: screenUtils.scaleWidth(12),
          borderRadius: screenUtils.scaleSize(8),
        };
      case 'lg':
        return {
          height: screenUtils.scaleHeight(48),
          paddingHorizontal: screenUtils.scaleWidth(20),
          borderRadius: screenUtils.scaleSize(12),
        };
      case 'md':
      default:
        return {
          height: screenUtils.scaleHeight(44),
          paddingHorizontal: screenUtils.scaleWidth(16),
          borderRadius: screenUtils.scaleSize(10),
        };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: screenUtils.scaleFont(13) };
      case 'lg':
        return { fontSize: screenUtils.scaleFont(15) };
      case 'md':
      default:
        return { fontSize: screenUtils.scaleFont(14) };
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const content = tx ? t(tx, txOptions) : title;
  const textColor = getTextColor();

  return (
    <Pressable
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
      {...props}
    >
      <Animated.View
        style={[
          styles.button,
          getSizeStyle(),
          getButtonStyle(),
          isDisabled && { opacity: 0.5 },
          { transform: [{ scale: scaleAnim }] },
          { width: '100%' },
        ]}
      >
        {loading && (
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <RefreshCwIcon width={screenUtils.scaleSize(18)} height={screenUtils.scaleSize(18)} color={textColor} />
          </Animated.View>
        )}
        {children ? (
          children
        ) : (
          <AppText
            align="center"
            style={[styles.text, getTextSizeStyle(), { color: textColor }, textStyle]}
          >
            {content}
          </AppText>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: screenUtils.scaleHeight(36),
    borderRadius: screenUtils.scaleSize(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenUtils.scaleWidth(16),
  },
  spinner: {
    marginRight: screenUtils.scaleWidth(8),
  },
  text: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
    textAlign: 'center',
  },
});
