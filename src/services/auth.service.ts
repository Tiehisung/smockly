import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type UserCredential
} from "firebase/auth";
 
import { type SignUpData, type SignInData, type AuthUser, mapFirebaseUser } from "../types/auth.types";
import { auth } from "../configs/firebase";

class AuthService {
    async signUp({ email, password, displayName }: SignUpData): Promise<AuthUser> {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Update profile with display name
            if (displayName && userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
            }

            const mappedUser = mapFirebaseUser(userCredential.user);
            if (!mappedUser) throw new Error('Failed to create user');

            return mappedUser;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async signIn({ email, password }: SignInData): Promise<AuthUser> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const mappedUser = mapFirebaseUser(userCredential.user);
            if (!mappedUser) throw new Error('Failed to sign in');

            return mappedUser;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async logout(): Promise<void> {
        await signOut(auth);
    }

    getCurrentUser(): AuthUser | null {
        return mapFirebaseUser(auth.currentUser);
    }
}

export const authService = new AuthService();