import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    sidebarOpen: boolean;
    notifications: Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info';
        read: boolean;
    }>;
    lastSync: string | null;
}

const initialState: AppState = {
    sidebarOpen: true,
    notifications: [],
    lastSync: null,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebar: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<AppState['notifications'][0], 'id' | 'read'>>) => {
            const id = Date.now().toString();
            state.notifications.push({
                id,
                ...action.payload,
                read: false,
            });
        },
        markNotificationRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) {
                notification.read = true;
            }
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setLastSync: (state) => {
            state.lastSync = new Date().toISOString();
        },
    },
});

export const {
    toggleSidebar,
    setSidebar,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setLastSync
} = appSlice.actions;

export default appSlice.reducer;