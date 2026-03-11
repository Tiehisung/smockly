import type { IPrice } from "./base.types";
import type { IProduct, IProductVariant } from "./product.types";
import type { IAddress,     } from "./shop.types";

export interface ICartItem {
    id: string; // Unique ID for cart item (productId + variant combo)
    productId: string;
    productSlug: string;
    name: string;
    image: string;
    price: IPrice;
    originalPrice?: IPrice;
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
    items: ICartItem[];
    subtotal: IPrice;
    discount: IPrice;
    shipping: IPrice;
    tax: IPrice;
    total: IPrice;
    itemCount: number;
    uniqueItemCount: number;
    appliedCoupon?: IAppliedCoupon;
    shippingAddress?: IAddress;
    billingAddress?: IAddress;
    shippingMethod?: IShippingMethod;
    notes?: string;
    expiresAt?: string;
    lastUpdated: string;
}

export interface IAppliedCoupon {
    code: string;
    discount: IPrice;
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
    product: IProduct;
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