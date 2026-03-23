// src/services/auth.service.ts
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithRedirect,
    type UserCredential,
    sendEmailVerification,
    updateProfile,
    getRedirectResult,
    onAuthStateChanged,
} from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../configs/firebase";
import { mapFirebaseUser, type IAuthUser, type IRedirectResult } from "../types/auth.types";
import { apiService } from "./api.service";
import type { EUserRole, EUserStatus } from "../types/user.types";
import { store } from "../store/store";
import { clearUser, } from "../store/slices/auth.slice";

class AuthService {
    // Helper: Get user with custom claims
    private async enrichUser(firebaseUser: any): Promise<IAuthUser | null> {
        if (!firebaseUser) return null;

        // First map to serializable user object
        const mappedUser = mapFirebaseUser(firebaseUser);
        if (!mappedUser) return null;

        try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            return {
                ...mappedUser,  // Only spread the mapped user (serializable)
                role: tokenResult.claims.role as EUserRole,
                status: tokenResult.claims.status as EUserStatus,
                dbId: tokenResult.claims.dbId as string,
            };
        } catch {
            return mappedUser;
        }
    }

    // Google Sign In
    async signInWithGoogle(returnUrl: string = '/shop'): Promise<void> {
        // Store return URL for after redirect
        sessionStorage.setItem('auth_return_url', returnUrl);
        sessionStorage.setItem('auth_provider', 'google');

        await signInWithRedirect(auth, googleProvider);
    }

    // Facebook Sign In
    async signInWithFacebook(returnUrl: string = '/shop'): Promise<void> {
        // Store return URL for after redirect
        sessionStorage.setItem('auth_return_url', returnUrl);
        sessionStorage.setItem('auth_provider', 'facebook');

        await signInWithRedirect(auth, facebookProvider);
    }

    // Listen to auth state changes
    onAuthStateChanged(callback: (user: IAuthUser | null) => void): () => void {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const enrichedUser = await this.enrichUser(firebaseUser);
                callback(enrichedUser);
            } else {
                callback(null);
            }
        });
    }


    // Handle Redirect Result
    async handleRedirectResult(): Promise<IRedirectResult> {
        console.log('🔍 handleRedirectResult called');
        try {
            const result = await getRedirectResult(auth);

            const returnUrl = sessionStorage.getItem('auth_return_url') || '/shop';

            if (result?.user) {
                const provider = sessionStorage.getItem('auth_provider');
                console.log(`${provider} sign-in successful:`, result.user.email);

                // Clear stored data
                sessionStorage.removeItem('auth_return_url');
                sessionStorage.removeItem('auth_provider');

                const enrichedUser = await this.enrichUser(result.user);

                if (enrichedUser) {
                    // Check if new user
                    const isNewUser = result.operationType === 'signIn';

                    if (isNewUser) {
                        await this.saveUserToDatabase(enrichedUser);
                    }

                    await this.updateUserLastLogin(result.user.uid);
                }

                return { user: enrichedUser, returnUrl };
            }

            return { user: null, returnUrl };
        } catch (error) {
            console.error('Redirect error:', error);
            sessionStorage.removeItem('auth_return_url');
            sessionStorage.removeItem('auth_provider');
            throw error;
        }
    }

    async getCurrentUser(): Promise<IAuthUser | null> {
        const user = auth.currentUser;
        if (!user) return null;
        return this.enrichUser(user);
    }
    // Email/Password Sign In

    async signIn(email: string, password: string) {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);

        const enrichedUser = await this.enrichUser(userCredential.user);
        if (enrichedUser) {
            await this.saveUserToDatabase(enrichedUser);
            await this.updateUserLastLogin(enrichedUser?.uid);
        }

        return enrichedUser!;
    }

    // Email/Password Sign Up

    async signUp(email: string, password: string, displayName?: string) {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }

        // Send verification email
        await sendEmailVerification(userCredential.user);

        const enrichedUser = await this.enrichUser(userCredential.user);
        if (enrichedUser) {
            await this.saveUserToDatabase(enrichedUser);
        }

        return enrichedUser!;
    }

    // Logout

    async logout() {
        await signOut(auth);
        store.dispatch(clearUser())
    }

    // Save user to MongoDB
    async saveUserToDatabase(user: IAuthUser): Promise<void> {
        try {
            console.log('saving')
            const response = await apiService.post('/users/create', {
                firebaseUid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

            if (!response.success) {
                console.error('Failed to save user to database:', response.error);
            } else {
                console.log('✅ User saved to MongoDB');
            }
        } catch (error) {
            console.error('Error saving user to database:', error);
            // Don't throw - we don't want to block the user if DB save fails
            // They'll be created when they first access their profile
        }
    }

    // Update last login
    async updateUserLastLogin(uid: string): Promise<void> {
        try {
            await apiService.post('/users/last-login', { uid });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    /** Send verification email */
    async sendVerificationEmail(): Promise<void> {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user logged in');
            }

            await sendEmailVerification(user, {
                url: `${window.location.origin}/verify-email-success`,
                handleCodeInApp: true,
            });

        } catch (error: any) {
            console.error('❌ Error sending verification email:', error);
            throw new Error(error.message);
        }
    }

    /** Check if email is verified */
    async isEmailVerified(): Promise<boolean> {
        const user = auth.currentUser;
        if (!user) return false;

        // Force refresh to get latest email verification status
        await user.reload();
        return user.emailVerified;
    }

    /** Reload user to get latest email verification status */
    async reloadUser(): Promise<IAuthUser | null> {
        const user = auth.currentUser;
        if (!user) return null;

        await user.reload();

        const enrichedUser = await this.enrichUser(user);
        if (!enrichedUser) return null;

        return enrichedUser;
    }


    /** Resend verification email */
    async resendVerificationEmail(): Promise<void> {
        return this.sendVerificationEmail();
    }

    /** Check verification status and redirect if verified */
    async checkVerificationAndRedirect(returnUrl: string = '/'): Promise<boolean> {
        const isVerified = await this.isEmailVerified();

        if (isVerified) {
            sessionStorage.removeItem('needs_verification');
            window.location.href = returnUrl;
            return true;
        }

        return false;
    }


}

export const authService = new AuthService();

