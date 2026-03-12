import type { IBaseDocument } from "./base.types";

 

 
export interface ICategory extends IBaseDocument {
    productCount: number;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;

    // Hierarchy
    parent?: string | ICategory;
    ancestors: ICategoryAncestor[];
    children?: ICategory[];
    level: number;

    // Media
    image?: string;
    icon?: string;
    banner?: string;

    // SEO
    seo: ICategorySEO;

    // Settings
    settings: ICategorySettings;

    // Display
    displayOrder: number;
    featured: boolean;
    visible: boolean;

    // Stats
    stats: ICategoryStats;

    // Metadata
    meta: ICategoryMeta;
}

export interface ICategoryAncestor {
    _id: string;
    name: string;
    slug: string;
    level: number;
}

export interface ICategorySEO {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
}

export interface ICategorySettings {
    showProducts: boolean;
    showSubCategories: boolean;
    layout: 'grid' | 'list' | 'compact';
    productsPerPage: number;
    defaultSort: string;
    filterable: boolean;
}

export interface ICategoryStats {
    productCount: number;
    subCategoryCount: number;
    totalViews: number;
    totalClicks: number;
}

export interface ICategoryMeta {
    tags: string[];
    notes?: string;
}