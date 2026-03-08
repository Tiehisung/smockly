import type { User as FirebaseUser } from "firebase/auth";

export interface AuthUser {

    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

export interface SignUpData {
    email: string;
    password: string;
    displayName?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signUp: (data: SignUpData) => Promise<void>;
    signIn: (data: SignInData) => Promise<void>;
    logout: () => Promise<void>;
    reload?: () => Promise<void>
}

// Convert Firebase user to our AuthUser type
export const mapFirebaseUser = (user: FirebaseUser | null): AuthUser | null => {
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