import type { IBaseDocument } from "./base.types";

export enum ECouponType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
    FREE_SHIPPING = "free_shipping",
}
export enum ECouponStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired",
}
export enum ECouponApplicableTo {
    ALL = "all",
    CATEGORIES = "categories",
    PRODUCTS = "products",
    USERS = "users",
}

export interface ICoupon extends IBaseDocument {
    // Basic Info
    code: string;
    name: string;
    description?: string;

    // Discount Configuration
    type: ECouponType;
    value: number; // Percentage or fixed amount
    maxDiscount?: number; // For percentage coupons, maximum discount amount

    // Validity
    startDate: string;
    endDate: string;
    status: ECouponStatus;

    // Usage Limits
    usageLimit?: number; // Total number of times coupon can be used
    usagePerUser?: number; // Times per user
    usedCount: number;

    // Order Requirements
    minOrderAmount?: number;
    maxOrderAmount?: number;

    // Applicability
    applicableTo: ECouponApplicableTo;
    applicableCategories?: string[]; // Category IDs
    applicableProducts?: string[]; // Product IDs
    excludedProducts?: string[]; // Product IDs

    // User Restrictions
    firstTimeOnly: boolean;
    newUsersOnly: boolean;
    applicableUsers?: string[]; // Specific user IDs
    applicableUserRoles?: string[]; // e.g., ['customer', 'vip']

    // Additional Settings
    isStackable: boolean; // Can be used with other coupons
    freeShipping?: boolean; // For free shipping type
    customerEligibility?: 'all' | 'registered' | 'guest';

    // Metadata
    createdBy: string;
    updatedBy?: string;
    timesUsed: number;
    totalDiscountGiven: number;

    // Display
    displayInList: boolean;
    highlight: boolean;
    badge?: string;
}

// For creating/updating coupons
export interface ICouponFormData {
    code: string;
    name: string;
    description?: string;
    type: ECouponType;
    value: number;
    maxDiscount?: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usagePerUser?: number;
    minOrderAmount?: number;
    maxOrderAmount?: number;
    applicableTo: ECouponApplicableTo;
    applicableCategories?: string[];
    applicableProducts?: string[];
    excludedProducts?: string[];
    firstTimeOnly: boolean;
    newUsersOnly: boolean;
    applicableUsers?: string[];
    isStackable: boolean;
    freeShipping?: boolean;
    displayInList: boolean;
    highlight: boolean;
    badge?: string;
}

// For validating coupons
export interface ICouponValidationRequest {
    code: string;
    subtotal: number;
    userId?: string;
    productIds?: string[];
    categoryIds?: string[];
    isFirstPurchase?: boolean;
}

export interface ICouponValidationResponse {
    valid: boolean;
    coupon?: ICoupon;
    discount: number;
    message?: string;
    errors?: string[];
}

// For coupon statistics
export interface ICouponStats {
    couponId: string;
    code: string;
    timesUsed: number;
    totalDiscount: number;
    averageOrderValue: number;
    topUsers: Array<{
        userId: string;
        email: string;
        timesUsed: number;
        totalDiscount: number;
    }>;
    usageByDay: Array<{
        date: string;
        count: number;
        discount: number;
    }>;
}

// For coupon lists in admin
export interface ICouponSummary {
    _id: string;
    code: string;
    name: string;
    type: ECouponType;
    value: number;
    status: ECouponStatus;
    usedCount: number;
    usageLimit?: number;
    startDate: string;
    endDate: string;
    createdAt: string;
}

// Sample coupon data
export const sampleCoupon = [
    {
        _id: '1',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off your first order',
        type: 'percentage',
        value: 10,
        maxDiscount: 50,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'active',
        usageLimit: 1000,
        usagePerUser: 1,
        usedCount: 0,
        minOrderAmount: 0,
        applicableTo: 'all',
        firstTimeOnly: true,
        newUsersOnly: true,
        isStackable: false,
        freeShipping: false,
        createdBy: 'admin',
        timesUsed: 0,
        totalDiscountGiven: 0,
        displayInList: true,
        highlight: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        _id: '2',
        code: 'SALE20',
        name: '20% Off Everything',
        description: 'Site-wide sale',
        type: 'percentage',
        value: 20,
        maxDiscount: 100,
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        status: 'active',
        usageLimit: 5000,
        usagePerUser: 1,
        usedCount: 0,
        minOrderAmount: 50,
        applicableTo: 'all',
        firstTimeOnly: false,
        newUsersOnly: false,
        isStackable: false,
        freeShipping: false,
        createdBy: 'admin',
        timesUsed: 0,
        totalDiscountGiven: 0,
        displayInList: true,
        highlight: true,
        badge: 'SALE',
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
    },
    {
        _id: '3',
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on orders over $50',
        type: 'free_shipping',
        value: 0,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'active',
        usagePerUser: 999,
        usedCount: 0,
        minOrderAmount: 50,
        applicableTo: 'all',
        firstTimeOnly: false,
        newUsersOnly: false,
        isStackable: true,
        freeShipping: true,
        createdBy: 'admin',
        timesUsed: 0,
        totalDiscountGiven: 0,
        displayInList: true,
        highlight: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        _id: '4',
        code: 'SMOCKS15',
        name: 'Smocks Special',
        description: '15% off all smocks',
        type: 'percentage',
        value: 15,
        maxDiscount: 75,
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-05-31T23:59:59Z',
        status: 'active',
        usageLimit: 2000,
        usagePerUser: 2,
        usedCount: 0,
        minOrderAmount: 0,
        applicableTo: 'categories',
        applicableCategories: ['smocks'],
        firstTimeOnly: false,
        newUsersOnly: false,
        isStackable: false,
        freeShipping: false,
        createdBy: 'admin',
        timesUsed: 0,
        totalDiscountGiven: 0,
        displayInList: true,
        highlight: true,
        badge: 'SMOCKS',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
    },
    {
        _id: '5',
        code: 'VIP25',
        name: 'VIP Discount',
        description: '25% off for VIP customers',
        type: 'percentage',
        value: 25,
        maxDiscount: 200,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'active',
        usageLimit: 500,
        usagePerUser: 999,
        usedCount: 0,
        minOrderAmount: 100,
        applicableTo: 'users',
        applicableUserRoles: ['vip'],
        firstTimeOnly: false,
        newUsersOnly: false,
        isStackable: true,
        freeShipping: false,
        createdBy: 'admin',
        timesUsed: 0,
        totalDiscountGiven: 0,
        displayInList: false,
        highlight: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
] as ICoupon[];

// Helper functions
export const isCouponValid = (coupon: ICoupon): boolean => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);

    return (
        coupon.status === 'active' &&
        now >= start &&
        now <= end &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    );
};

export const calculateDiscount = (
    coupon: ICoupon,
    subtotal: number
): number => {
    if (!isCouponValid(coupon)) return 0;

    if (coupon.type === 'percentage') {
        const discount = (subtotal * coupon.value) / 100;
        return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    }

    if (coupon.type === 'fixed') {
        return Math.min(coupon.value, subtotal);
    }

    if (coupon.type === 'free_shipping') {
        return 0; // Shipping cost handled separately
    }

    return 0;
};

export const formatCouponValue = (coupon: ICoupon): string => {
    switch (coupon.type) {
        case 'percentage':
            return `${coupon.value}% off`;
        case 'fixed':
            return `$${coupon.value} off`;
        case 'free_shipping':
            return 'Free Shipping';
        default:
            return '';
    }
};