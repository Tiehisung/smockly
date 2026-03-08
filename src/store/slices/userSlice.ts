import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the shape of user data in our store
interface UserState {
    profile: {
        uid: string;
        email: string;
        displayName?: string;
        photoURL?: string;
    } | null;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
        language: string;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
    },
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set user profile (when they login)
        setUserProfile: (state, action: PayloadAction<UserState['profile']>) => {
            state.profile = action.payload;
            state.error = null;
        },

        // Update user preferences
        setUserPreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },

        // Clear user data (when they logout)
        clearUserData: (state) => {
            state.profile = null;
            state.preferences = initialState.preferences; // Reset to defaults
            state.error = null;
        },

        // Loading states
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Error states
        setUserError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setUserProfile,
    setUserPreferences,
    clearUserData,
    setUserLoading,
    setUserError
} = userSlice.actions;

export default userSlice.reducer;