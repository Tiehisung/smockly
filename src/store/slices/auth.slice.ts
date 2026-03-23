// store/slices/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthUser } from "../../types/auth.types";

interface AuthState {
    user: IAuthUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IAuthUser | null>) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        clearUser(state) {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { setUser, setLoading, setError, clearUser, clearError } = authSlice.actions;
export default authSlice.reducer;