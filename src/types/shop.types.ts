// Address Types
export interface IAddress {
    _id?: string; 
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
    type: 'shipping' | 'billing' | 'both';
}

export interface IShippingInfo {
    address: IAddress;
    method: 'standard' | 'express' | 'next_day';
    cost: number;
    trackingNumber?: string;
    estimatedDelivery: string;
}

export interface IBillingInfo {
    address: IAddress;
    sameAsShipping: boolean;
}

export interface IDiscount {
    code: string;
    amount: number;
    type: 'percentage' | 'fixed';
}
 