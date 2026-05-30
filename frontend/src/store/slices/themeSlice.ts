import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeId, getStoredTheme } from '@/theme/themes';

interface ThemeState {
  current: ThemeId;
  isTransitioning: boolean;
}

const initialState: ThemeState = {
  current: getStoredTheme(),
  isTransitioning: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeId>) => {
      state.current = action.payload;
    },
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
  },
});

export const { setTheme, setTransitioning } = themeSlice.actions;
export default themeSlice.reducer;
