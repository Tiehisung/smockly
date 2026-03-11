import type { User as FirebaseUser } from "firebase/auth";
import type { EUserRole, IUser, IUserPreferences, IUserProfile } from "./user.types";

export interface IAuthUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    role?: EUserRole;
    isActive?: boolean;
}

export interface ISignUpData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    phone?: string;
    acceptTerms: boolean;
    subscribeNewsletter?: boolean;
}

export interface ISignInData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface IPasswordResetData {
    email: string;
}

export interface IUpdatePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IAuthContext {
    user: IAuthUser | null;
    dbUser: IUser | null;
    isLoading: boolean;
    error: string | null;
    signUp: (data: ISignUpData) => Promise<IAuthUser>;
    signIn: (data: ISignInData) => Promise<IAuthUser>;
    logout: () => Promise<void>;
    refreshUser?: () => Promise<void>;
    updateProfile?: (data: Partial<IUserProfile>) => Promise<void>;
    updatePreferences?: (data: Partial<IUserPreferences>) => Promise<void>;
    clearError?: () => void;
}

// Convert Firebase user to our AuthUser type
export const mapFirebaseUser = (user: FirebaseUser | null): IAuthUser | null => {
    if (!user) return null;

    return {
        ...user,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
    };
};