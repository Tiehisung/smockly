// src/services/auth.service.ts
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithRedirect,
    type UserCredential,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { auth } from "../configs/firebase";
import { mapFirebaseUser, type IAuthUser } from "../types/auth.types";
import { apiService } from "./api.service";
import type { EUserRole } from "../types/user.types";


class AuthService {
    async signIn(email: string, password: string) {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);

        const mappedUser = mapFirebaseUser(userCredential.user);
        if (!mappedUser) throw new Error('Failed to sign in');

        // Update last login in database
        await this.updateUserLastLogin(mappedUser.uid);

        return mappedUser;
    }

    async signUp(email: string, password: string, displayName?: string) {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }

        // Send verification email
        await sendEmailVerification(userCredential.user);

        const mappedUser = mapFirebaseUser(userCredential.user);
        if (!mappedUser) throw new Error('Failed to create user');

        // Call backend to save user to MongoDB
        await this.saveUserToDatabase(mappedUser);
        return mappedUser;
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential: UserCredential = await signInWithRedirect(auth, provider);

        const mappedUser = mapFirebaseUser(userCredential.user);
        // Update last login in database
        await this.updateUserLastLogin(mappedUser?.uid as string);
        return mappedUser
    }

    async logout() {
        await signOut(auth);
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

        const mappedUser = mapFirebaseUser(user);
        if (!mappedUser) return null;

        // Get custom claims
        try {
            const idTokenResult = await user.getIdTokenResult(true);
            return {
                ...mappedUser,
                role: idTokenResult.claims.role as EUserRole,
                dbId: idTokenResult.claims.dbId as string,
            };
        } catch (error) {
            return mappedUser;
        }
    }


    /** Resend verification email */
    async resendVerificationEmail(): Promise<void> {
        return this.sendVerificationEmail();
    }

    /** Check verification status and redirect if verified */
    async checkVerificationAndRedirect(returnUrl: string = '/dashboard'): Promise<boolean> {
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