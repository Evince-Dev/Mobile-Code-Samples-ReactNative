import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, StackCardInterpolationProps } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { LauncherScreen } from '../screens/Auth/LauncherScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { LoginWithCodeScreen } from '../screens/Auth/LoginWithCodeScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Card Style Interpolator matching Climb Designer login‑flow transition with separate timings.
 * • Fade (opacity) animates over the full duration (slow).
 * • Slide (x) finishes quickly in the first 30% of the total duration (fast).
 */
const forSlideAndFadeClimb = ({ current, next }: StackCardInterpolationProps) => {
  // Slow fade over full transition duration
  const opacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Fast slide: moves from 24 → 0 within the first 30% of progress
  const translateX = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [44, 0, 0],
    extrapolate: 'clamp',
  });

  // Slow fade out for previous screen
  const nextOpacity = next
    ? next.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
    : 1;

  // Fast slide out for previous screen (first 30% of progress)
  const nextTranslateX = next
    ? next.progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -44, -44],
      extrapolate: 'clamp',
    })
    : 0;

  return {
    cardStyle: {
      opacity: next ? nextOpacity : opacity,
      transform: [{ translateX: next ? nextTranslateX : translateX }],
    },
  };
};

const transitionSpec = {
  open: {
    animation: 'timing' as const,
    config: {
      duration: 600, // total fade duration (slow)
      easing: Easing.out(Easing.quad),
    },
  },
  close: {
    animation: 'timing' as const,
    config: {
      duration: 600,
      easing: Easing.out(Easing.quad),
    },
  },
};

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forSlideAndFadeClimb,
        transitionSpec,
      }}
    >
      <Stack.Screen name="Launcher" component={LauncherScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="LoginWithCode" component={LoginWithCodeScreen} />
      <Stack.Screen name="App" component={HomeScreen} />
    </Stack.Navigator>
  );
};


