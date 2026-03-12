
// Base interface for all documents
export interface IBaseDocument {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

// Money/Price type
export interface IPrice {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN';
    formatted?: string;
}

export interface IDiscount {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    maxDiscount?: number;
    minOrder?: number;
}

// Image type
export interface IImage {
    url: string;
    alt?: string;
    caption?: string;
    isPrimary?: boolean;
    order?: number;
}
