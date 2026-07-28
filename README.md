# RNSample - React Native Application

A modern, high-performance React Native application built for iOS and Android, featuring a complete authentication system, dynamic session management, dark/light theme engine, and RTK Query API integration adhering to strict React Native architecture principles.

---

## 🏛️ Project Architecture Overview

```
RNSample/
├── android/                             # Android Native project & Gradle
├── ios/                                 # iOS Native project & CocoaPods
├── server/                              # Local Mock Auth HTTP Server
│   ├── index.js                         # HTTP server endpoints (/auth/login, /auth/logout, delay handling)
│   ├── mockAuthServer.ts                # TypeScript mock server helper
│   └── users.json                       # Static user records & API tokens
├── src/
│   ├── assets/                          # Static images & graphics
│   ├── components/
│   │   ├── base/                        # Core Base Components (BaseContainer, AppView, AppText, AppButton, AppModal, etc.)
│   │   ├── common/                      # Common UI Components (AppHeader, AppLoader, GoogleButton, FormInputField, Selector, etc.)
│   │   └── icons/                       # Reusable SVG Vector Icons (GoogleIcon, CloseIcon, RefreshCwIcon, etc.)
│   ├── config/
│   │   └── env.ts                       # Centralized Environment Variables Loader
│   ├── constants/
│   │   └── apiEndpoints.ts              # Centralized Registry of API Endpoints
│   ├── contexts/
│   │   ├── AlertContext.tsx             # Global Alert Dialog & Snackbar Context System
│   │   └── ThemeContext.tsx             # Dual Theme Manager (Light / Dark Mode via StorageService)
│   ├── dummyData/                       # Mock Data Sources & User Models
│   ├── locales/
│   │   └── en.json                      # i18n English Translation Strings
│   ├── navigation/                      # React Navigation Stack Setup & Custom Interpolators
│   │   ├── RootNavigator.tsx            # Main Stack Navigator with Climb Designer transitions
│   │   └── types.ts                     # Navigation Type Definitions
│   ├── screens/
│   │   ├── Auth/                        # Auth Screens (LoginScreen, LoginWithCodeScreen, ForgotPasswordScreen, LauncherScreen)
│   │   └── Home/                        # Dashboard / Home Screen with 30s session timeout management
│   ├── services/
│   │   ├── storageService.ts            # MMKV Key-Value & Keychain Encrypted Token Service
│   │   └── index.ts                     # Storage Services Barrel Export
│   ├── store/
│   │   ├── api/
│   │   │   ├── baseApi.ts               # RTK Query Base API & Auth Token Interceptor
│   │   │   └── authApi.ts              # RTK Query Auth Slice (/auth/login, /auth/logout & onQueryStarted)
│   │   ├── slices/
│   │   │   └── authSlice.ts             # Client Auth Session State (setCredentials, logout)
│   │   └── index.ts                     # Redux Store Configuration & Typed Hooks
│   ├── theme/
│   │   ├── colors.ts                    # Light & Dark Theme Color Palettes & Highlighted Borders
│   │   ├── fontConstants.ts             # Geist Typography Family & Font Weights
│   │   ├── spacing.ts                   # Layout Spacing Tokens
│   │   └── typography.ts                # Typography Utilities
│   ├── types/                           # TypeScript Declaration Files
│   └── utils/
│       ├── Constants.ts                 # Static App Constants & Config Arrays
│       ├── i18n.ts                      # i18next Framework Configuration
│       └── screenUtils.ts               # Responsive Scaling Utility (Fonts, Width, Height, Size)
├── App.tsx                              # App Root Entry Point & Context Providers
├── .env                                 # Local environment config
├── .env.development                     # Development environment config
├── .env.example                         # Environment variables template
└── .env.production                      # Production environment config
```

---

## 🚀 Key Technologies & Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native 0.86.0** | Core Mobile Framework (New Architecture Enabled) |
| **TypeScript** | Type Safety across components, Redux, and API contracts |
| **Redux Toolkit & RTK Query** | Centralized Global State & API Data Fetching, Caching, and Mutations |
| **react-native-mmkv** | High-performance synchronous key-value storage engine |
| **react-native-keychain** | Hardware-backed encrypted storage for JWT Auth Tokens & Secrets |
| **React Navigation v7** | Stack Navigation system with custom transition interpolators |
| **i18next & react-i18next** | Internationalization & multi-language localization framework |
| **react-hook-form & Zod** | Declarative form management with schema validation |
| **react-native-svg** | Vector SVG Icons & Graphics |
| **screenUtils** | Responsive scaling utility for font, width, height, and paddings |
| **Node.js HTTP Server** | Lightweight mock backend (`server/index.js`) for authenticating against `users.json` |

---

## 🛠️ Architecture & Design Principles

### 1. Base Components Rule
To enforce design consistency and prevent layout bugs, screens **must never import raw React Native elements** (`View`, `Text`, `TouchableOpacity`, etc.) directly. Use Base Components:
- **`BaseContainer`**: Standardized screen wrapper with `SafeAreaView`, `StatusBar`, and optional header/scrollable support.
- **`AppView`**: Standardized view container component.
- **`AppText`**: Standardized text component enforcing Geist font hierarchy and theme colors.
- **`AppButton` & `FormInputField`**: Standardized buttons and form text inputs supporting active focus border highlights (`2px primary`) and custom flex row responsiveness.
- **`AppHeader` & `AppHeadingBlock`**: Standardized screen headers and section greeting blocks.
- **`AppLoader`**: Centralized loading overlay featuring `AppActivityIndicator` and dynamic status text.

### 2. Sizing & Scaling (`screenUtils`)
All layout dimensions, paddings, margins, font sizes, and icon dimensions are scaled dynamically using `screenUtils`:
- `screenUtils.scaleFont(size)`: Font size scaling.
- `screenUtils.scaleWidth(width)`: Horizontal margins and paddings.
- `screenUtils.scaleHeight(height)`: Vertical height and margins.
- `screenUtils.scaleSize(size)`: Icon sizes and border radii.

### 3. State Management & RTK Query
- **RTK Query (`baseApi.ts` & `authApi.ts`)**: Manages network data fetching, HTTP request/response state (`isLoading`, `isError`, `data`), caching, and tag invalidations.
- **Endpoint Lifecycle (`onQueryStarted`)**: Token saving (`StorageService.saveSecureItem('auth_token', token)`) and Redux user updates (`dispatch(setCredentials)`) occur inside `authApi.ts` endpoint definitions.
- **Client Session State (`authSlice.ts`)**: Stores client authentication flags (`isAuthenticated`) and user profile data (`user`).

### 4. Storage Architecture (`StorageService`)
- **Fast Key-Value Persistence (`react-native-mmkv`)**: App theme mode (`@app_theme_mode`), user preferences, and non-sensitive cache.
- **Encrypted Secure Storage (`react-native-keychain`)**: Hardware-secured storage for JWT tokens (`auth_token`), refresh tokens, and credentials.

### 5. Centralized Endpoints & Environment Config
- **API Routes**: Centralized in `src/constants/apiEndpoints.ts` (`API_ENDPOINTS.AUTH.LOGIN`, `API_ENDPOINTS.AUTH.LOGOUT`, etc.).
- **Environment Loader**: Centralized in `src/config/env.ts` (`ENV.API_BASE_URL`, `ENV.IS_DEV`) reading from `.env`, `.env.development`, and `.env.production`.

---

## 🖥️ Local Mock Auth Server

The application includes a local Node.js HTTP server (`server/index.js`) that validates user credentials against `server/users.json`:
- **Strict Validation**: Only accepts registered users (`user@example.com` with password `Password123!`). Unmatched credentials return HTTP `400` with `'Invalid email or password.'`.
- **Response Delays**: Simulates realistic network latency (1.5s delay) for `/auth/login` and `/auth/logout` endpoints.
- **Token Delivery**: Returns the user's API token from `users.json`, which is persisted securely in hardware-backed keychain storage on the client app.

Run the mock auth server:
```bash
npm run server
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js**: `>= 22.11.0` (or compatible LTS)
- **Xcode** (for iOS development): Version 15+
- **Android Studio** (for Android development): SDK 34+
- **CocoaPods**: Installed via Ruby/Homebrew

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Evince-Dev/RNSample.git
cd RNSample
npm install
```

### 2. iOS Native Setup
Install iOS CocoaPods:
```bash
cd ios
pod install
cd ..
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

---

## 📱 Running the Application

### 1. Start Mock Auth Server
```bash
npm run server
```

### 2. Start Metro Bundler
```bash
npm start
```

### 3. Run on iOS Simulator
```bash
npm run ios
```

### 4. Run on Android Emulator
```bash
npm run android
```

---

## 🧪 Code Quality & TypeScript Verification

Run TypeScript compiler check to verify type safety:
```bash
./node_modules/.bin/tsc --noEmit
```

Run ESLint linter:
```bash
npm run lint
```

---

## 🎨 Theme & Styling System
The app features a dual-theme system (Light / Dark mode) with curated HSL color palettes defined in `src/theme/colors.ts`:
- **Light Theme**: Clean, high-contrast white card design.
- **Dark Theme**: Sleek dark mode palette with highlighted stone-600 borders (`#524C46`) for crisp visibility on outline buttons, cards, and modal alert dialogs.
- Access theme colors via `useTheme()` hook:
  ```typescript
  const { colors, isDark, toggleTheme } = useTheme();
  ```

---

## 📄 License
Private & Proprietary. All rights reserved. Evince Development.
