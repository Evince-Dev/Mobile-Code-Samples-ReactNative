import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface NetworkContextType {
  /** True if internet connection is available, false if offline, null during initial check */
  isConnected: boolean | null;
  /** True if the device was previously offline and just reconnected */
  wasOffline: boolean;
  /** True when network connectivity check is actively running */
  isChecking: boolean;
  /** Manually trigger a network check. Returns true if online, false if offline */
  checkConnection: () => Promise<boolean>;
  /** Manually set connected status */
  setConnectedStatus: (status: boolean) => void;
  /** Reset the wasOffline banner trigger state */
  resetWasOffline: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
  /** Optional custom URL to check connectivity against (defaults to a reliable lightweight endpoint) */
  checkUrl?: string;
  /** Periodic check interval in ms when online (default: 15000ms) */
  onlineCheckInterval?: number;
  /** Auto-check interval in ms when offline (default: 4000ms) */
  offlineCheckInterval?: number;
}

const DEFAULT_CHECK_URL = 'https://clients3.google.com/generate_204';

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
  checkUrl = DEFAULT_CHECK_URL,
  onlineCheckInterval = 15000,
  offlineCheckInterval = 4000,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const prevIsConnected = useRef<boolean | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(checkUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const online = response.ok || response.status === 204 || response.status === 200;

      // Track transition from offline -> online
      if (online && prevIsConnected.current === false) {
        setWasOffline(true);
      } else if (!online) {
        setWasOffline(false);
      }

      prevIsConnected.current = online;
      setIsConnected(online);
      setIsChecking(false);
      return online;
    } catch (_error) {
      // Fetch failed or timed out -> Offline
      if (prevIsConnected.current === true) {
        setWasOffline(false);
      }
      prevIsConnected.current = false;
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

  // Continuous periodic check loop (4s when offline, 15s when online)
  useEffect(() => {
    const intervalTime = isConnected === false ? offlineCheckInterval : onlineCheckInterval;
    const intervalId = setInterval(() => {
      checkConnection();
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [isConnected, offlineCheckInterval, onlineCheckInterval, checkConnection]);

  const setConnectedStatus = useCallback((status: boolean) => {
    if (status && isConnected === false) {
      setWasOffline(true);
    }
    prevIsConnected.current = status;
    setIsConnected(status);
  }, [isConnected]);

  const resetWasOffline = useCallback(() => {
    setWasOffline(false);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        wasOffline,
        isChecking,
        checkConnection,
        setConnectedStatus,
        resetWasOffline,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    return {
      isConnected: true,
      wasOffline: false,
      isChecking: false,
      checkConnection: async () => true,
      setConnectedStatus: () => {},
      resetWasOffline: () => {},
    };
  }
  return context;
};
