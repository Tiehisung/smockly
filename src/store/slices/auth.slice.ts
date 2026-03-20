// src/store/slices/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthUser } from "../../types/auth.types";
 

interface AuthState {
    user: IAuthUser | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IAuthUser | null>) {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser(state) {
            state.user = null;
            state.loading = false;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;