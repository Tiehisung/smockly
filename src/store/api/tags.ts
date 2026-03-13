// src/store/api/tags.ts
export const TAG_TYPES = {
    // Auth & User
    AUTH: 'Auth',
    USER: 'User',
    USERS: 'Users',
    NOTIFICATIONS: 'Notifications',
    SETTINGS: 'Settings',

    // Products
    PRODUCTS: 'Products',
    PRODUCT: 'Product',
    FEATURED: 'Featured',
    BESTSELLERS: 'Bestsellers',
    NEW: 'New',

    // Categories
    CATEGORIES: 'Categories',
    CATEGORY: 'Category',

    // Cart
    CART: 'Cart',

    // Orders
    ORDERS: 'Orders',
    ORDER: 'Order',

    // Reviews
    REVIEWS: 'Reviews',
    REVIEW: 'Review',

    // Wishlist
    WISHLIST: 'Wishlist',

    // Coupons
    COUPONS: 'Coupons',
    COUPON: 'Coupon',

    // Admin
    INVENTORY: 'Inventory',
    DASHBOARD: 'Dashboard',

    ADDRESSES: 'Addresses',
    USERSTATS: 'UserStats',
} as const;

export type TagType = typeof TAG_TYPES[keyof typeof TAG_TYPES];