// src/data/categories/bundles.ts

import type { ICategory } from "../../types/category.types";

 

export const bundlesCategory: ICategory = {
    _id: 'cat_bundles_001',
    name: 'Bundles',
    slug: 'bundles',
    description: 'Save more with our curated bundles. Perfect for couples, families, or complete looks.',
    shortDescription: 'Curated collections at great value',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    level: 1,
    ancestors: [],
    children: [],
    seo: {
        title: 'African Smocks Bundles | Save on Sets',
        description: 'Shop our curated bundles and save on complete African smock sets for couples and families.',
        keywords: ['bundles', 'sets', 'family packs', 'couple sets'],
    },
    settings: {
        showProducts: true,
        showSubCategories: true,
        layout: 'grid',
        productsPerPage: 12,
        defaultSort: 'price_asc',
        filterable: true,
    },
    stats: {
        productCount: 18,
        subCategoryCount: 3,
        totalViews: 5600,
        totalClicks: 1870,
    },
    displayOrder: 3,
    featured: true,
    visible: true,
    meta: {
        tags: ['bundles', 'sets', 'value packs'],
        notes: 'Bundles and sets category',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    productCount: 0
};

export const bundlesSubCategories: ICategory[] = [
    {
        _id: 'cat_bundles_002',
        name: 'Couple Sets',
        slug: 'couple-sets',
        description: 'Matching sets for couples',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_bundles_001', name: 'Bundles', slug: 'bundles', level: 1 }],
        children: [],
        stats: { productCount: 8, subCategoryCount: 0, totalViews: 2100, totalClicks: 740 },
        displayOrder: 1,
        featured: true,
        visible: true,
        seo: {
            title: 'Couple Sets | Matching African Smocks',
            description: 'Matching African smock sets for couples. Perfect for weddings and special occasions.',
            keywords: ['couple sets', 'matching smocks', 'his and hers'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['couple', 'matching', 'his and hers'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
    {
        _id: 'cat_bundles_003',
        name: 'Family Packs',
        slug: 'family-packs',
        description: 'Complete looks for the whole family',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_bundles_001', name: 'Bundles', slug: 'bundles', level: 1 }],
        children: [],
        stats: { productCount: 6, subCategoryCount: 0, totalViews: 1800, totalClicks: 590 },
        displayOrder: 2,
        featured: true,
        visible: true,
        seo: {
            title: 'Family Packs | African Smocks for the Whole Family',
            description: 'Complete African smock sets for the entire family. Great value for family events.',
            keywords: ['family packs', 'family sets', 'matching family'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['family', 'kids', 'matching'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
];

bundlesCategory.children = bundlesSubCategories;