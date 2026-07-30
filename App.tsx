import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';

// Ignore React Native LogBox error / warning banners
LogBox.ignoreAllLogs();

// Import i18n initialization
import './src/utils/i18n';

// Import Theme, Alert & Network Context & Root Navigator
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AlertProvider } from './src/contexts/AlertContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import { NoInternetView } from './src/components/common/NoInternetView';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef } from './src/services/navigationService';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NetworkProvider>
            <AlertProvider>
              <NavigationContainer ref={navigationRef}>
                <RootNavigator />
                <NoInternetView />
              </NavigationContainer>
            </AlertProvider>
          </NetworkProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
