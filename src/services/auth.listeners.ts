// src/services/auth.listener.ts
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";
import { store } from "../store/store";
import { mapFirebaseUser } from "../types/auth.types";
import { setUser, clearUser } from "../store/slices/auth.slice";

export const initAuthListener = () => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            store.dispatch(setUser(mapFirebaseUser(user)));
        } else {
            store.dispatch(clearUser());
        }
    });
};