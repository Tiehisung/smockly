export interface IUser {
    _id: string;
    firebaseUid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    website?: string;
    role: EUserRole
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    preferences: {
        theme: 'light' | 'dark';
        notifications: {
            email: boolean;
            push: boolean;
            marketing: boolean;
        };
        privacy: {
            showEmail: boolean;
            showProfile: boolean;
        };
    };
    stats: {
        postsCount: number;
        followersCount: number;
        followingCount: number;
    };
}

export enum EUserRole {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    GUEST = 'guest',
    CUSTOMER = 'customer',
}