 
import type { IBaseDocument, IImage, IPrice } from "./base.types";

export enum EProductCategory {
    SMOCKS = 'smocks',
    ACCESSORIES = 'accessories',
    BUNDLES = 'bundles',
    CUSTOM = 'custom',
    FABRIC = 'fabric'
}

export enum EProductStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

export enum EProductSortBy {
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    NEWEST = 'newest',
    POPULAR = 'popular',
    RATING = 'rating',
    NAME_ASC = 'name_asc'
}

// Main Product Interface
export interface IProduct extends IBaseDocument {
    // Basic Info
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription: string;

    // Categorization
    category: EProductCategory;
    subCategory?: string;
    tags: string[];

    // Media
    images: IImage[];
    videoUrl?: string;

    // Pricing
    price: IPrice;
    compareAtPrice?: IPrice;
    cost?: IPrice; // For profit calculation

    // Inventory
    inventory: IProductInventory;

    // Variants
    hasVariants: boolean;
    variants?: IProductVariant[];

    // Attributes
    attributes: IProductAttributes;

    // SEO
    seo: IProductSEO;

    // Status
    status: EProductStatus;
    featured: boolean;
    bestseller: boolean;
    newArrival: boolean;
    onSale: boolean;

    // Ratings & Reviews
    ratings: IProductRatings;

    // Related
    relatedProducts?: string[]; // IDs
    upsellProducts?: string[];
    crossSellProducts?: string[];

    // Settings
    settings: IProductSettings;

    // Metadata
    meta: IProductMeta;
}

export interface IProductInventory {
    sku: string;
    barcode?: string;
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
    soldIndividually: boolean;
    weight?: number;
    weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in';
    };
}

export interface IProductVariant {
    _id?: string;
    sku: string;
    name: string;
    options: IProductVariantOption[];
    price?: IPrice; // Override base price
    compareAtPrice?: IPrice;
    inventory: IProductInventory;
    images?: IImage[];
    isDefault?: boolean;
}

export interface IProductVariantOption {
    name: string; // 'size', 'color', 'material', etc.
    value: string; // 'large', 'red', 'cotton', etc.
    attribute?: string; // Link to attribute
}

export interface IProductAttributes {
    sizes?: string[];
    colors?: IColor[];
    materials?: string[];
    styles?: string[];
    occasion?: string[];
    cultural?: string[];
    gender?: 'men' | 'women' | 'unisex' | 'kids';
    ageGroup?: 'adult' | 'children' | 'infant';
    handmade?: boolean;
    custom?: Record<string, any>;
}

export interface IColor {
    name: string;
    code: string; // Hex code
    image?: string; // Optional image for color swatch
}

export interface IProductSEO {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonical?: string;
}

export interface IProductRatings {
    average: number;
    count: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface IProductSettings {
    requiresShipping: boolean;
    isDigital: boolean;
    isTaxable: boolean;
    taxClass?: string;
    minimumOrderQuantity?: number;
    maximumOrderQuantity?: number;
}

export interface IProductMeta {
    views: number;
    purchases: number;
    revenue: number;
    lastViewed?: string;
    lastPurchased?: string;
}

// Filter Types
export interface IProductFilters {
    categories: EProductCategory[];
    subCategories: string[];
    sizes: string[];
    colors: string[];
    materials: string[];
    priceRange: [number, number];
    minRating: number;
    sortBy: EProductSortBy;
    inStock: boolean;
    onSale: boolean;
    tags: string[];
    search?: string;
    page: number;
    limit: number;
}

// Form Types
export interface IProductFormData {
    name: string;
    description: string;
    shortDescription: string;
    category: EProductCategory;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    sku: string;
    images: File[];
    sizes?: string[];
    colors?: string[];
    tags?: string[];
    featured?: boolean;
}