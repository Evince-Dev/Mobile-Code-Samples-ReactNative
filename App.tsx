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

// Import Theme & Alert Context & Root Navigator
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AlertProvider } from './src/contexts/AlertContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
