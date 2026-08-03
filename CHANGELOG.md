# Changelog

All notable changes to this project are documented in this file.

## [Unreleased] - 2026-08-03

### 🌐 Network Status Banner & Offline Monitoring
- **Real-Time Network Status Banner (`NetworkStatusBanner.tsx`)**:
  - Built an animated `NetworkStatusBanner` component that slides down from top (or bottom) to notify users during offline and connection restored events.
  - Automatically auto-hides the "Connection restored" notification banner after 3.5 seconds.
  - Resolved `NodeJS.Timeout` TypeScript namespace error using `ReturnType<typeof setTimeout>`.
- **Network Connectivity Context (`NetworkContext.tsx`)**:
  - Implemented `NetworkProvider` context tracking active `isConnected`, `wasOffline`, and `isChecking` states.
  - Added lightweight HEAD network ping verification (`clients3.google.com/generate_204`) with configurable periodic polling (15s online / 4s offline).
- **SVG Icon Exports (`WifiIcon.tsx` & `index.ts`)**:
  - Added `WifiIcon.tsx` SVG component for connection restored indicator and exported it cleanly from `components/icons`.
- **Global BaseContainer Integration (`BaseContainer.tsx`)**:
  - Mounted `NetworkStatusBanner` inside `BaseContainer` with optional `showNetworkBanner?: boolean` prop for automatic screen-wide offline banner alerts.

### ⚡ Dashboard Skeleton Shimmer View
- **Animated Shimmer Skeleton Loader (`HomeScreenShimmer.tsx` & `HomeScreen.tsx`)**:
  - Created `HomeScreenShimmer.tsx` skeleton view component using looping spring-opacity animations (`0.35` ↔ `0.85`) matching the `HomeScreen` UI layout.
  - Integrated 1-second initial shimmer loading state in `HomeScreen.tsx` before rendering active dashboard card elements.
  - Re-exported `HomeScreenShimmer` cleanly from `screens/Home/HomeScreen/index.ts`.

### 🎨 Theme & App Header Animations
- **Extended Theme Palette (`colors.ts` & `ThemeContext.tsx`)**:
  - Added `shimmerBackground` and `shimmerHighlight` color properties to `ColorPalette`, `lightColors`, and `darkColors`.
- **Animated Sun/Moon Theme Toggle (`AppHeader.tsx`)**:
  - Added spring scaling and 180° rotation animations on sun/moon icon toggle in `AppHeader.tsx` when switching light/dark theme modes.

### 🔑 Auth & OTP Timer Bug Fixes
- **OTP Countdown Timer Restart Fix (`LoginWithCodeScreen.tsx`)**:
  - Resolved `Cannot find namespace 'NodeJS'` TypeScript error by replacing `NodeJS.Timeout` type annotation with `ReturnType<typeof setInterval>`.
  - Fixed countdown timer restart failure after resending code by adding `canResend` to `useEffect` dependencies (`[isCodeSent, canResend]`), allowing "Resend Code" to re-initialize a fresh 60-second interval.

### 🌐 Localization & i18n (`en.json`)
- Added translation keys for `noInternetTitle`, `noInternetMessage`, `retry`, and `connectionRestored`.

## [Unreleased] - 2026-07-30

### 📱 Screen Modularization & Directory Architecture
- **Isolated Screen Directories & Styles**:
  - Re-architected all Auth and Home screens into isolated directories with co-located `.styles.ts` files and module `index.ts` files:
    - `src/screens/Auth/Login/` (`LoginScreen.tsx`, `LoginScreen.styles.ts`, `index.ts`)
    - `src/screens/Auth/Launcher/` (`LauncherScreen.tsx`, `LauncherScreen.styles.ts`, `index.ts`)
    - `src/screens/Auth/ForgotPassword/` (`ForgotPasswordScreen.tsx`, `ForgotPasswordScreen.styles.ts`, `index.ts`)
    - `src/screens/Auth/LoginWithCode/` (`LoginWithCodeScreen.tsx`, `LoginWithCodeScreen.styles.ts`, `index.ts`)
    - `src/screens/Home/HomeScreen/` (`HomeScreen.tsx`, `HomeScreen.styles.ts`, `index.ts`)
- **Metro Resolution Fix**:
  - Updated index re-exports in `src/screens/Auth/index.ts` and `src/screens/Home/index.ts` to use explicit sub-file paths (`export * from './HomeScreen/HomeScreen'`) to eliminate circular module resolution errors in Metro bundler.
- **Legacy File Cleanup**:
  - Safely migrated and updated screen references across `RootNavigator.tsx`.

### 🛡 Validation & Form Management
- **Centralized Validation Service (`validationService.ts`)**:
  - Created `AuthValidationService` class to centralize all Zod schemas (`loginSchema`, `codeFormSchema`, `forgotPasswordSchema`).
  - Exported strongly typed form value definitions (`LoginFormValues`, `CodeFormValues`, `ForgotPasswordFormValues`).
  - Connected `AuthValidationService` schemas across `LoginScreen.tsx`, `LoginWithCodeScreen.tsx`, and `ForgotPasswordScreen.tsx`.

### 🖱 Input Clickability & Focus Improvements
- **Full Input Area Clickability (`AppTextInput.tsx`)**:
  - Wrapped `inputWrapper` container in a `Pressable` that triggers `localRef.current?.focus()`.
  - Added `height: '100%'` to `styles.input` so tapping anywhere inside padding, margins, or icons immediately focuses the input and opens the keyboard.

### 🔒 Dynamic Loading & Touch-Prevention
- **Dynamic BaseContainer Loader (`BaseContainer.tsx` & `AppLoader.tsx`)**:
  - Added `loading?: boolean` prop to `BaseContainer.tsx`.
  - Connected `BaseContainer` to Redux `isGoogleLoading` to dynamically render `<AppLoader visible={shouldShowModal} message={activeMessage} />`.
  - Automatically sets `pointerEvents="none"` on screen content during active loading, completely disabling screen touches while loading.
- **BackButton Prop Extension (`BackButton.tsx`)**:
  - Added `disabled?: boolean` prop support to `BackButton.tsx` for disabling back navigation during global loading states.

### 🎭 Modal & Center Spring Animations
- **Center Spring-Scale Animations (`AppModal.tsx` & `AlertContext.tsx`)**:
  - Extended `AppModal.tsx` with `useSpringScale` and `noContainerStyle` props.
  - Implemented center spring-scale zoom-in (`scale 0 → 1` with `Animated.spring`) and fade-in/fade-out transitions for Alert Popups (`AlertContext.tsx`), matching `/Users/Evince/Mobile-WurkNow-ReactNative/src/components/CommonModal.tsx`.
  - Fixed prop order in `AppModal.tsx` to enforce `animationType="none"`, preventing native bottom-slide animations from conflicting with center zoom transitions.

### 🚀 Navigation & API Flow Fixes
- **Navigation Ref Attachment (`App.tsx`)**:
  - Re-connected `ref={navigationRef}` to `<NavigationContainer ref={navigationRef}>` in `App.tsx`, resolving `navigationRef.isReady() = false` issues during programmatic navigation.
- **Navigation Service Fallbacks (`navigationService.ts`)**:
  - Added robust `replace` and `reset` fallback mechanisms in `NavigationService.ts`.
- **Sequential Modal & Navigation Teardown (`authApi.ts`)**:
  - Coordinated `dispatch(setGoogleLoading(false))` with delayed `NavigationService.replace('App')` (150ms) on login success and `AlertService.showAlert` (350ms) on API failure, eliminating UIViewController thread locks on iOS/Android.

---

## [Unreleased] - 2026-07-29

### 🔐 Authentication & Session Persistence
- **Persistent Auth Session (`LauncherScreen.tsx`)**:
  - Implemented automatic auth session restoration on app boot after splash animation.
  - Checks for persisted `auth_token` (Keychain) and `auth_user` (MMKV) on launch and auto-navigates directly to the Home screen (`App`) when logged in.
- **Local Storage Management (`authApi.ts`)**:
  - Updated RTK Query `login` mutation lifecycle to store `auth_user` details in MMKV alongside secure Keychain token storage.
  - Updated `logout` mutation to clear `auth_user` and `auth_token` from local storage.
- **OTP Code Sign-In Persistence (`LoginWithCodeScreen.tsx`)**:
  - Added secure token and user data persistence upon OTP code verification.
- **Google Sign-In & Error Handling (`LoginScreen.tsx`)**:
  - Refactored `GoogleButton` onPress and `onValidSubmit` handlers to handle `isGoogleLoading` state properly.
  - Ensures full-screen `<AppLoader>` unmounts before presenting error alert dialogs, preventing overlay screen freezes on failed login attempts.
- **Watchman Directory Ignores (`.watchmanconfig`)**:
  - Configured directory ignore patterns (`android/build`, `ios/Pods`, `.git`, `.idea`) for Watchman file watching optimization.

### 🚀 Added
- **Keyboard Navigation Accessory (`KeyboardAccessoryToolbar.tsx`)**:
  - Implemented WurkNow-style self-contained `InputAccessoryView` and automatic route input registry (`registerInput`, `getFocusableInputs`).
  - Added directional controls (`ChevronUpIcon` / `ChevronDownIcon`) for Previous (`^`) and Next (`v`) input field stepping, as well as a **Done** button.
  - Automatically handles focus navigation and input enablement on iOS while keeping screen components clean.
- **Dynamic Android Status Bar (`AppStatusBar.tsx`)**:
  - Built theme-aware `AppStatusBar` component integrated directly inside `ThemeProvider`.
  - Automatically updates Android status bar `barStyle` and `backgroundColor` based on light/dark theme selection.
- **Global Network Connectivity & Retry View (`NetworkContext.tsx` & `NoInternetView.tsx`)**:
  - Added global `NetworkProvider` context powered by `@react-native-community/netinfo`.
  - Created `WifiOffIcon.tsx` SVG icon and responsive `NoInternetView` component with a centered "Try Again" retry action button.
  - Mounted globally in `App.tsx` for real-time offline detection and manual retry capability.

### 🛠 Refactored & Improved
- **Base Component Compliance (`FormInputField.tsx` & `AppTextInput.tsx`)**:
  - Refactored `FormInputField.tsx` to compose `AppTextInput.tsx` base component instead of directly using raw `<TextInput>`, adhering strictly to project architecture standards.
  - Extended `AppTextInput.tsx` to support `rightIcon` props (e.g., password visibility toggle button) and automatic keyboard accessory registration.
- **Static Fallback Text Cleanup**:
  - Removed hardcoded fallback strings (`|| 'Sample User'`, `|| 'user@example.com'`, `t(...) || '...'`) across `LoginScreen.tsx` and `HomeScreen.tsx` to enforce translation and API data contracts.
- **Documentation & Mock Server References**:
  - Cleaned up `README.md` to remove all references to mock server scripts (`npm run server`) as server files are ignored.
  - Removed obsolete dummy data files (`mockUser.ts`, `dummyData/index.ts`).

### 🔧 Fixed & Build Configuration
- **Android SDK 36 Build Resolution**:
  - Maintained Android SDK 36 (`compileSdkVersion = 36`, `targetSdkVersion = 36`).
  - Upgraded `react-native-reanimated` to `^4.0.0` (4.5.3) and installed `react-native-worklets ^0.11.0` to resolve CMake C++ build errors on SDK 36.
  - Updated patch files (`patches/react-native-reanimated+3.19.5.patch`) and cleared build caches to ensure a clean compilation.
