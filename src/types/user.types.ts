 
import type { IBaseDocument } from "./base.types";
import type { IAddress } from "./shop.types";

 
export enum EUserRole {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    MANAGER = 'manager',
    MODERATOR = 'moderator',
    CUSTOMER = 'customer',
}
export enum EUserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
}

// Main User Interface
export interface IUser extends IBaseDocument {
    // Auth
    firebaseUid: string;
    email: string;
    emailVerified: boolean;

    // Profile
    profile: IUserProfile;

    // Preferences
    preferences: IUserPreferences;

    // Role & Permissions
    role: EUserRole;
    permissions: string[];
    status: EUserStatus;

    // Addresses
    addresses: IAddress[];

    // Shopping
    cart?: IUserCart;
    wishlist: string[]; // Product IDs

    // Stats
    stats: IUserStats;

    // Activity
    lastLogin: string;
    lastActive: string;
    loginCount: number;

    // Metadata
    meta: IUserMeta;
}

export interface IUserProfile {
    firstName: string;
    lastName: string;
    displayName: string;
    photoURL?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    bio?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tiktok?: string;
    };
}

export interface IUserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;
    notifications: IUserNotificationPreferences;
    privacy: IUserPrivacySettings;
    marketing: IUserMarketingPreferences;
}

export interface IUserNotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    abandonedCart: boolean;
}

export interface IUserPrivacySettings {
    showProfile: boolean;
    showEmail: boolean;
    showOrders: boolean;
    allowTracking: boolean;
}

export interface IUserMarketingPreferences {
    emailPromotions: boolean;
    smsPromotions: boolean;
    pushPromotions: boolean;
    allowPersonalization: boolean;
}

export interface IUserCart {
    items: Array<{
        productId: string;
        quantity: number;
        variant?: string;
        addedAt: string;
    }>;
    updatedAt: string;
}

export interface IUserStats {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteCategory?: string;
    memberSince: string;
    lastOrderAt?: string;
    reviewCount: number;
    wishlistCount: number;
}

export interface IUserMeta {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    campaign?: string;
    tags: string[];
    notes?: string;
}

// Auth Types
// export interface IAuthUser {
//     uid: string;
//     email: string | null;
//     emailVerified: boolean;
//     displayName: string | null;
//     photoURL: string | null;
//     role?: EUserRole;
//     isActive?: boolean;
// }

// export interface ISignUpData {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     displayName?: string;
//     phone?: string;
//     acceptTerms: boolean;
//     subscribeNewsletter?: boolean;
// }

// export interface ISignInData {
//     email: string;
//     password: string;
//     rememberMe?: boolean;
// }

// export interface IPasswordResetData {
//     email: string;
// }

// export interface IUpdatePasswordData {
//     currentPassword: string;
//     newPassword: string;
//     confirmPassword: string;
// }

// Auth Context
