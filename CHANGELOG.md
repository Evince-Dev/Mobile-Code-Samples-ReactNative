# Changelog

All notable changes to this project are documented in this file.

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
