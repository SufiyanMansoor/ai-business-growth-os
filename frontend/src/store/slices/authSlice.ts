import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_USER, isDemoModeActive } from '@/lib/demo';

export type UserRole = 'admin' | 'agency' | 'client' | 'influencer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  company?: string;
  industry?: string;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: isDemoModeActive() ? DEMO_USER : null,
  isAuthenticated: isDemoModeActive(),
  isDemoMode: isDemoModeActive(),
  isLoading: !isDemoModeActive(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    enterDemoMode: (state) => {
      state.user = DEMO_USER;
      state.isAuthenticated = true;
      state.isDemoMode = true;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isDemoMode = false;
      state.error = null;
    },
  },
});

export const { setUser, enterDemoMode, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
