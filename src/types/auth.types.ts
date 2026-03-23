import type { EUserRole, EUserStatus, IUser, IUserProfile } from "./user.types";

export interface IAuthUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    role?: EUserRole;
    status?: EUserStatus;
    dbId?: string
    provider?: 'google' | 'facebook' | 'email';
}

export interface ISignUpData {
    email: string;
    password: string;
    displayName?: string;
    phone?: string;
    acceptTerms?: boolean;
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
export interface IRedirectResult {
    user: IAuthUser | null;
    returnUrl: string;
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
    updatePreferences?: (data: Partial<IUser['preferences']>) => Promise<void>;
    clearError?: () => void;
}

// Convert Firebase user to our AuthUser type
export const mapFirebaseUser = (firebaseUser: any): IAuthUser | null => {
    if (!firebaseUser) return null;

    // Try to get custom claims from different possible locations
    let role = null;
    let dbId = null;
    let status

    // Location 1: From customAttributes in reloadUserInfo
    if (firebaseUser.reloadUserInfo?.customAttributes) {
        try {
            const customAttributes = JSON.parse(firebaseUser.reloadUserInfo.customAttributes);
            role = customAttributes.role || null;
            dbId = customAttributes.dbId || null;
            status = customAttributes.status || null;
        } catch (e) {
            console.error('Failed to parse customAttributes', e);
        }
    }

    // Location 2: From the access token claims
    else if (firebaseUser.stsTokenManager?.accessToken) {
        try {
            // Decode the JWT to get claims
            const token = firebaseUser.stsTokenManager.accessToken;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            if (payload.role) role = payload.role;
            if (payload.dbId) dbId = payload.dbId;
        } catch (e) {
            console.error('Failed to decode token', e);
        }
    }
    let provider: 'google' | 'facebook' | 'email' = 'email';
    if (firebaseUser.providerData?.length > 0) {
        const providerId = firebaseUser.providerData[0]?.providerId;
        if (providerId === 'google.com') provider = 'google';
        else if (providerId === 'facebook.com') provider = 'facebook';
    }
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || null,
        displayName: firebaseUser.displayName || null,
        photoURL: firebaseUser.photoURL || null,
        emailVerified: firebaseUser.emailVerified || false,
        role,
        dbId,
        status,
        provider
    };
};