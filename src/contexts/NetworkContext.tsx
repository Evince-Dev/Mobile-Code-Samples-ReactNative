import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface NetworkContextType {
  /** True if internet connection is available, false if offline, null during initial check */
  isConnected: boolean | null;
  /** True when network connectivity check is actively running */
  isChecking: boolean;
  /** Manually trigger a network check. Returns true if online, false if offline */
  checkConnection: () => Promise<boolean>;
  /** Manually set connected status */
  setConnectedStatus: (status: boolean) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
  /** Optional custom URL to check connectivity against (defaults to a reliable lightweight endpoint) */
  checkUrl?: string;
  /** Auto-check interval in ms when offline (default: 8000ms) */
  offlineCheckInterval?: number;
}

const DEFAULT_CHECK_URL = 'https://clients3.google.com/generate_204';

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
  checkUrl = DEFAULT_CHECK_URL,
  offlineCheckInterval = 8000,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(checkUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const online = response.ok || response.status === 204 || response.status === 200;
      setIsConnected(online);
      setIsChecking(false);
      return online;
    } catch (_error) {
      // Fetch failed or timed out -> Offline
      setIsConnected(false);
      setIsChecking(false);
      return false;
    }
  }, [checkUrl]);

  // Initial check on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Re-check when app returns from background to active state
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkConnection();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [checkConnection]);

  // Periodic check when offline
  useEffect(() => {
    if (isConnected === false) {
      const intervalId = setInterval(() => {
        checkConnection();
      }, offlineCheckInterval);

      return () => clearInterval(intervalId);
    }
  }, [isConnected, offlineCheckInterval, checkConnection]);

  const setConnectedStatus = useCallback((status: boolean) => {
    setIsConnected(status);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isChecking,
        checkConnection,
        setConnectedStatus,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    // Fallback if rendered outside NetworkProvider
    return {
      isConnected: true,
      isChecking: false,
      checkConnection: async () => true,
      setConnectedStatus: () => {},
    };
  }
  return context;
};
