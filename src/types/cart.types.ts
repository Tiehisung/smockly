import type { IPrice } from "./base.types";
import type { IProductVariant } from "./product.types";
import type { IAddress, } from "./shop.types";

export interface ICartItem {
    _id: string;
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    variant?: ICartItemVariant;
    maxQuantity: number;
    isAvailable: boolean;
    addedAt: string;
}


export interface ICartItemVariant {
    sku: string;
    size?: string;
    color?: string;
    options: Record<string, string>;
}

export interface ICart {
    id?: string;
    firebaseUid: string;
    userId?:string
    items: ICartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
    uniqueItemCount: number;
    appliedCoupon?: IAppliedCoupon;
    shippingAddress?: IAddress;
    billingAddress?: IAddress;
    shippingMethod?: IShippingMethod;
    notes?: string;
    expiresAt?: string;  
    lastUpdated: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAppliedCoupon {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
}

export interface IShippingMethod {
    id: string;
    name: string;
    description: string;
    cost: IPrice;
    estimatedDays: [number, number];
    carrier: string;
}

export interface ICartTotals {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
}

// Cart Operations
export type IAddToCartPayload = {
    productId: string;
    quantity: number;
    variant?: IProductVariant;
};

export type IUpdateCartItemPayload = {
    itemId: string;
    quantity: number;
};

export type IRemoveFromCartPayload = {
    itemId: string;
};

// Cart State
export interface ICartState {
    cart: ICart;
    isLoading: boolean;
    error: string | null;
    isDrawerOpen: boolean;
}

// Cart API Responses
export interface ICartResponse {
    success: boolean;
    data: ICart;
    message?: string;
}

export interface IAddToCartResponse extends ICartResponse { }
export interface IUpdateCartResponse extends ICartResponse { }
export interface IRemoveFromCartResponse extends ICartResponse { }