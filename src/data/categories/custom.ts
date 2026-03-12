// src/data/categories/custom.ts

import type { ICategory } from "../../types/category.types";

 
export const customCategory: ICategory = {
    _id: 'cat_custom_001',
    name: 'Custom',
    slug: 'custom',
    description: 'Create your own unique smock. Choose your fabric, style, and measurements for a one-of-a-kind piece.',
    shortDescription: 'Design your own unique smock',
    image: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    level: 1,
    ancestors: [],
    children: [],
    seo: {
        title: 'Custom African Smocks | Design Your Own',
        description: 'Create your own custom African smock. Choose fabric, style, and measurements for a unique piece.',
        keywords: ['custom smocks', 'bespoke', 'made to measure', 'design your own'],
    },
    settings: {
        showProducts: true,
        showSubCategories: false,
        layout: 'grid',
        productsPerPage: 12,
        defaultSort: 'newest',
        filterable: false,
    },
    stats: {
        productCount: 0,
        subCategoryCount: 0,
        totalViews: 3400,
        totalClicks: 890,
    },
    displayOrder: 4,
    featured: true,
    visible: true,
    meta: {
        tags: ['custom', 'bespoke', 'made to measure'],
        notes: 'Custom orders category',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    productCount: 0
};