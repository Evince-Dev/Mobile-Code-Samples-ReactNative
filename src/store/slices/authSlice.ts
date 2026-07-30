import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAuthData } from '../api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: UserAuthData | null;
  isGoogleLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isGoogleLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserAuthData }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    setGoogleLoading: (state, action: PayloadAction<boolean>) => {
      state.isGoogleLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isGoogleLoading = false;
    },
  },
});

export const { setCredentials, setGoogleLoading, logout } = authSlice.actions;
export default authSlice.reducer;
