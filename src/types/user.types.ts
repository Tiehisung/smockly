
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
    BLOCKED = 'blocked',
}

// Main User Interface
export interface IUser extends IBaseDocument {
    firebaseUid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    phone?: string;
    role: EUserRole
    status: EUserStatus;
    lastLogin: Date;

    stats: {
        totalOrders: number;
        totalSpent: number;
        memberSince: Date;
    };
    addresses: Array<IAddress>;
    wishlist: Array<string>;

    preferences: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        currency: string;
        notifications: IUserNotificationPreferences;
        privacy: IUserPrivacySettings;
        marketing: IUserMarketingPreferences;
        newsletter: boolean;
    }
}

export interface IUserProfile {
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

export interface IUserNotificationPreferences {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    orderUpdates?: boolean;
    promotions?: boolean;
    newsletter?: boolean;
    abandonedCart?: boolean;
    marketing?: boolean;
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
    updatedAt: string
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

 
