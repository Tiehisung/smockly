import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type UserCredential,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";

import { type SignUpData, type SignInData, type AuthUser, mapFirebaseUser } from "../types/auth.types";
import { auth } from "../configs/firebase";

class AuthService {
    /** Google Sign In */
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            const result = await signInWithPopup(auth, provider);
            return mapFirebaseUser(result.user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    
    // GitHub Sign In
    async signInWithGithub() {
        try {
            const provider = new GithubAuthProvider();
            provider.addScope('repo');

            const result = await signInWithPopup(auth, provider);
            return mapFirebaseUser(result.user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    // For mobile or when popup is blocked
    async signInWithRedirect(provider: 'google' | 'github') {
        const selectedProvider = provider === 'google'
            ? new GoogleAuthProvider()
            : new GithubAuthProvider();

        await signInWithRedirect(auth, selectedProvider);
    }

    async getRedirectResult() {
        try {
            const result = await getRedirectResult(auth);
            return result ? mapFirebaseUser(result.user) : null;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**Credentials Signup*/
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
            // Send verification email
            await sendEmailVerification(userCredential.user);
            console.log('Verification email sent!');

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