 
import type { IBaseDocument, IPrice } from "./base.types";
import type { IAddress } from "./shop.types";

 

export enum EOrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    FAILED = "failed",
}

export enum EPaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
}

export enum EPaymentMethod {
    CARD = "card",
    PAYPAL = "paypal",
    MOBILE_MONEY = "mobile_money",
    BANK_TRANSFER = "bank_transfer",
    CASH_ON_DELIVERY = "cash_on_delivery",
}

export enum EShippingStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    IN_TRANSIT = "in_transit",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    FAILED = "failed",
}

export interface IOrder extends IBaseDocument {
    orderNumber: string;
    userId: string;

    // Items
    items: IOrderItem[];

    // Status
    status: EOrderStatus;
    paymentStatus: EPaymentStatus;
    shippingStatus: EShippingStatus;

    // Payment
    paymentMethod: EPaymentMethod;
    paymentDetails: IPaymentDetails;

    // Shipping
    shipping: IOrderShipping;

    // Financials
    financials: IOrderFinancials;

    // Customer
    customer: IOrderCustomer;

    // Tracking
    tracking?: IOrderTracking;

    // History
    history: IOrderHistoryEntry[];

    // Metadata
    notes?: string;
    tags?: string[];
    meta: IOrderMeta;
    
}

export interface IOrderItem {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: IPrice;
    total: IPrice;
    variant?: {
        sku: string;
        size?: string;
        color?: string;
        options: Record<string, string>;
    };
    image?: string;
    isDigital: boolean;
    isGift?: boolean;
    giftMessage?: string;
}

export interface IOrderShipping {
    address: IAddress;
    method: IOrderShippingMethod;
    trackingNumber?: string;
    carrier?: string;
    shippedAt?: string;
    deliveredAt?: string;
}

export interface IOrderShippingMethod {
    id: string;
    name: string;
    cost: IPrice;
    estimatedDays: [number, number];
}

export interface IPaymentDetails {
    transactionId?: string;
    paidAt?: string;
    refundedAt?: string;
    refundAmount?: number;
    paymentIntent?: string;
    paymentMethodDetails?: Record<string, any>;
}

export interface IOrderFinancials {
    subtotal: IPrice;
    discount: IPrice;
    shipping: IPrice;
    tax: IPrice;
    total: IPrice;
    amountPaid: IPrice;
    amountDue: IPrice;
    refunded: IPrice;
}

export interface IOrderCustomer {
    userId: string;
    email: string;
    name: string;
    phone: string;
    notes?: string;
}

export interface IOrderTracking {
    number: string;
    url?: string;
    carrier: string;
    events: ITrackingEvent[];
}

export interface ITrackingEvent {
    status: string;
    location: string;
    description: string;
    timestamp: string;
}

export interface IOrderHistoryEntry {
    status: EOrderStatus;
    note?: string;
    changedBy: string;
    timestamp: string;
}

export interface IOrderMeta {
    ip?: string;
    userAgent?: string;
    source?: 'web' | 'mobile' | 'admin';
    campaign?: string;
    referrer?: string;
}

// Order Form Types
export interface ICreateOrderPayload {
    items: Array<{
        productId: string;
        quantity: number;
        variant?: string;
    }>;
    shippingAddress: IAddress;
    billingAddress?: IAddress;
    paymentMethod: EPaymentMethod;
    shippingMethod: string;
    couponCode?: string;
    notes?: string;
}

 