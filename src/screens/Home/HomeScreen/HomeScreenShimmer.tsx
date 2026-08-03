import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppView, BaseContainer } from '../../../components/base';
import { AppHeader } from '../../../components/common/AppHeader';
import { useTheme } from '../../../contexts/ThemeContext';
import { screenUtils } from '../../../utils/screenUtils';

interface ShimmerItemProps {
  style?: StyleProp<ViewStyle>;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
}

/**
 * Reusable animated shimmer block item.
 */
const ShimmerItem: React.FC<ShimmerItemProps> = ({
  style,
  width = '100%',
  height = 16,
  borderRadius = 6,
}) => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? screenUtils.scaleWidth(width) : width,
          height: screenUtils.scaleHeight(height),
          borderRadius: screenUtils.scaleSize(borderRadius),
          backgroundColor: colors.shimmerBackground,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

/**
 * HomeScreenShimmer Component
 *
 * Renders skeleton shimmer placeholders matching the layout structure of HomeScreen.
 */
export const HomeScreenShimmer: React.FC = () => {
  const { colors } = useTheme();

  return (
    <BaseContainer
      header={<AppHeader />}
      scrollable
      horizontalPadding={screenUtils.scaleWidth(20)}
      verticalPadding={screenUtils.scaleHeight(24)}
    >
      <AppView style={styles.container}>
        {/* ── Greeting Block Skeleton ── */}
        <AppView style={styles.headingBlock}>
          <ShimmerItem
            width="65%"
            height={screenUtils.scaleHeight(28)}
            borderRadius={screenUtils.scaleSize(6)}
          />
          <ShimmerItem
            width="85%"
            height={screenUtils.scaleHeight(16)}
            borderRadius={screenUtils.scaleSize(4)}
          />
        </AppView>

        {/* ── User Session Card Skeleton ── */}
        <AppView
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <AppView style={styles.cardHeaderRow}>
            <ShimmerItem
              width={screenUtils.scaleSize(10)}
              height={screenUtils.scaleSize(10)}
              borderRadius={screenUtils.scaleSize(5)}
            />
            <ShimmerItem
              width="40%"
              height={screenUtils.scaleHeight(16)}
              borderRadius={screenUtils.scaleSize(4)}
            />
          </AppView>

          <AppView style={styles.infoRow}>
            <ShimmerItem
              width="25%"
              height={screenUtils.scaleHeight(14)}
              borderRadius={screenUtils.scaleSize(4)}
            />
            <ShimmerItem
              width="35%"
              height={screenUtils.scaleHeight(14)}
              borderRadius={screenUtils.scaleSize(4)}
            />
          </AppView>

          <AppView style={styles.infoRow}>
            <ShimmerItem
              width="30%"
              height={screenUtils.scaleHeight(14)}
              borderRadius={screenUtils.scaleSize(4)}
            />
            <ShimmerItem
              width="45%"
              height={screenUtils.scaleHeight(14)}
              borderRadius={screenUtils.scaleSize(4)}
            />
          </AppView>
        </AppView>

        {/* ── Sample App Info Card Skeleton ── */}
        <AppView
          style={[
            styles.card,
            {
              backgroundColor: `${colors.primary}0D`,
              borderColor: `${colors.primary}33`,
            },
          ]}
        >
          <ShimmerItem
            width="50%"
            height={screenUtils.scaleHeight(18)}
            borderRadius={screenUtils.scaleSize(4)}
          />
          <ShimmerItem
            width="95%"
            height={screenUtils.scaleHeight(14)}
            borderRadius={screenUtils.scaleSize(4)}
          />
          <ShimmerItem
            width="80%"
            height={screenUtils.scaleHeight(14)}
            borderRadius={screenUtils.scaleSize(4)}
          />
        </AppView>

        {/* ── Button Skeleton ── */}
        <ShimmerItem
          width="100%"
          height={screenUtils.scaleHeight(48)}
          borderRadius={screenUtils.scaleSize(8)}
          style={styles.buttonSkeleton}
        />
      </AppView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: screenUtils.scaleHeight(20),
  },
  headingBlock: {
    gap: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(4),
  },
  card: {
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    padding: screenUtils.scaleSize(16),
    gap: screenUtils.scaleHeight(12),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(8),
    marginBottom: screenUtils.scaleHeight(4),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: screenUtils.scaleHeight(4),
  },
  buttonSkeleton: {
    marginTop: screenUtils.scaleHeight(8),
  },
});
