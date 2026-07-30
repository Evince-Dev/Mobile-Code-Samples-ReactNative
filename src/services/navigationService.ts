import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Global Navigation Service
 * Allows triggering navigation actions outside of React components (e.g. from RTK Query, services, etc.)
 */
export class NavigationService {
  /**
   * Navigate to a screen in the root stack
   */
  static navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ) {
    const doNavigate = () => {
      try {
        navigationRef.navigate(name as any, params as any);
      } catch (e) {
        console.error('[NavigationService] navigate error:', e);
      }
    };

    if (navigationRef.isReady()) {
      doNavigate();
    } else {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          doNavigate();
        }
      }, 100);
    }
  }

  /**
   * Replace current screen with target screen in root stack
   */
  static replace<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ) {
    const doReplace = () => {
      try {
        navigationRef.dispatch(StackActions.replace(name as any, params as any));
      } catch (e) {
        console.warn('[NavigationService] replace fallback to navigate:', e);
        navigationRef.navigate(name as any, params as any);
      }
    };

    if (navigationRef.isReady()) {
      doReplace();
    } else {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          doReplace();
        }
      }, 100);
    }
  }

  /**
   * Reset navigation stack to target screen (e.g. after login/logout)
   */
  static reset<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ) {
    const doReset = () => {
      try {
        navigationRef.reset({
          index: 0,
          routes: [{ name: name as any, params: params as any }],
        });
      } catch (e) {
        console.warn('[NavigationService] reset fallback to replace:', e);
        NavigationService.replace(name, params);
      }
    };

    if (navigationRef.isReady()) {
      doReset();
    } else {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          doReset();
        }
      }, 100);
    }
  }

  /**
   * Go back to previous screen in stack
   */
  static goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }
}
