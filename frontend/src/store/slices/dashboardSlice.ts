import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface DashboardState {
  notifications: Notification[];
  sidebarOpen: boolean;
  activeModule: string;
}

const initialState: DashboardState = {
  notifications: [
    {
      id: '1',
      title: 'Campaign Launched',
      message: 'Your Instagram campaign is now live',
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'New Lead',
      message: '3 new leads added to your pipeline',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  sidebarOpen: true,
  activeModule: 'dashboard',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveModule: (state, action: PayloadAction<string>) => {
      state.activeModule = action.payload;
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
  },
});

export const { toggleSidebar, setActiveModule, markNotificationRead, addNotification } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
