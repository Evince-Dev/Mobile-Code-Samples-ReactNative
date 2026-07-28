import React, { ReactNode } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { AppSafeAreaView } from './AppSafeAreaView';
import { AppScrollView } from './AppScrollView';
import { AppView } from './AppView';

export interface BaseContainerProps {
  /** Optional header element rendered fixed at top outside scroll area */
  header?: ReactNode;
  /** Child content of the screen */
  children: ReactNode;
  /** Extra style applied to the root SafeAreaView */
  safeAreaViewStyle?: StyleProp<ViewStyle>;
  /** Extra style applied to the inner content container */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * When true, wraps content in a ScrollView so the screen is scrollable.
   * Defaults to false (fixed layout).
   */
  scrollable?: boolean;
  /** Props forwarded to the inner ScrollView (only used when scrollable=true) */
  scrollViewProps?: ScrollViewProps;
  /**
   * When true, wraps content in KeyboardAvoidingView.
   * Useful for screens with text inputs.
   * Defaults to false.
   */
  avoidKeyboard?: boolean;
  /** Horizontal padding applied to the content container. Defaults to 0. */
  horizontalPadding?: number;
  /** Vertical padding applied to the content container. Defaults to 0. */
  verticalPadding?: number;
  /** Override which safe area edges to respect. Defaults to all edges. */
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  /** When false, the background color of the screen is transparent. Defaults to true. */
  useThemeBackground?: boolean;
}

/**
 * BaseContainer
 *
 * A composable screen wrapper used in every screen.
 * Provides:
 * - SafeArea insets handling (via AppSafeAreaView)
 * - Optional header rendering at top
 * - Optional scroll behaviour
 * - Optional KeyboardAvoidingView
 * - Consistent background theming
 * - Responsive horizontal/vertical padding
 */
export const BaseContainer: React.FC<BaseContainerProps> = ({
  header,
  children,
  safeAreaViewStyle,
  contentStyle,
  scrollable = false,
  scrollViewProps,
  avoidKeyboard = false,
  horizontalPadding = 0,
  verticalPadding = 0,
  edges = ['top'],
  useThemeBackground = true,
}) => {
  const { colors } = useTheme();

  const paddingStyle: ViewStyle = {
    paddingHorizontal: horizontalPadding,
    paddingVertical: verticalPadding,
  };

  const content = scrollable ? (
    <AppScrollView
      style={[styles.fill, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.scrollContent, paddingStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </AppScrollView>
  ) : (
    <AppView style={[styles.fill, { backgroundColor: colors.background }, paddingStyle, contentStyle]}>
      {children}
    </AppView>
  );

  const wrappedContent = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <AppSafeAreaView
      style={[styles.container, { backgroundColor: colors.safAreaViewBackground }, safeAreaViewStyle]}
      useThemeBackground={useThemeBackground}
      edges={edges}
    >
      {header}
      {wrappedContent}
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
