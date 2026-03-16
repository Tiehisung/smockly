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

import { mapFirebaseUser, type IAuthUser, type ISignInData, type ISignUpData } from "../types/auth.types";
import { auth } from "../configs/firebase";
import { apiService } from "./api.service";

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
    async signUp({ email, password, displayName }: ISignUpData): Promise<IAuthUser> {
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

            // Call backend to save user to MongoDB
            await this.saveUserToDatabase(mappedUser);
            return mappedUser;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async signIn({ email, password }: ISignInData): Promise<IAuthUser> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const mappedUser = mapFirebaseUser(userCredential.user);
            if (!mappedUser) throw new Error('Failed to sign in');

            // Update last login in database
            await this.updateUserLastLogin(mappedUser.uid);

            return mappedUser;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async logout(): Promise<void> {
        await signOut(auth);
    }

    getCurrentUser(): IAuthUser | null {
        return mapFirebaseUser(auth.currentUser);
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
}

export const authService = new AuthService();