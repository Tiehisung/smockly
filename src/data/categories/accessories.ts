// src/data/categories/accessories.ts

import type { ICategory } from "../../types/category.types";

 

export const accessoriesCategory: ICategory = {
    _id: 'cat_accessories_001',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look with our beautiful accessories. From hats to bags, find the perfect finishing touch.',
    shortDescription: 'Beautiful accessories to complete your outfit',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    level: 1,
    ancestors: [],
    children: [],
    seo: {
        title: 'African Accessories | Hats, Bags, Jewelry & More',
        description: 'Shop our collection of African accessories including hats, bags, jewelry, and more.',
        keywords: ['african accessories', 'hats', 'bags', 'jewelry', 'traditional accessories'],
    },
    settings: {
        showProducts: true,
        showSubCategories: true,
        layout: 'grid',
        productsPerPage: 12,
        defaultSort: 'newest',
        filterable: true,
    },
    stats: {
        productCount: 32,
        subCategoryCount: 4,
        totalViews: 8900,
        totalClicks: 2340,
    },
    displayOrder: 2,
    featured: true,
    visible: true,
    meta: {
        tags: ['accessories', 'hats', 'bags', 'jewelry'],
        notes: 'Accessories category',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    productCount: 0
};

export const accessoriesSubCategories: ICategory[] = [
    {
        _id: 'cat_accessories_002',
        name: 'Hats & Headwear',
        slug: 'hats',
        description: 'Traditional African hats and headpieces',
        image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_accessories_001', name: 'Accessories', slug: 'accessories', level: 1 }],
        children: [],
        stats: { productCount: 12, subCategoryCount: 0, totalViews: 2100, totalClicks: 650 },
        displayOrder: 1,
        featured: true,
        visible: true,
        seo: {
            title: 'African Hats & Headwear | Traditional Headpieces',
            description: 'Discover our collection of traditional African hats and headwear.',
            keywords: ['african hats', 'headwear', 'traditional hats'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['hats', 'headwear'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
    {
        _id: 'cat_accessories_003',
        name: 'Bags & Purses',
        slug: 'bags',
        description: 'Handcrafted bags and purses',
        image: 'https://images.unsplash.com/photo-1591561954555-607968c9ab9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_accessories_001', name: 'Accessories', slug: 'accessories', level: 1 }],
        children: [],
        stats: { productCount: 10, subCategoryCount: 0, totalViews: 1900, totalClicks: 540 },
        displayOrder: 2,
        featured: true,
        visible: true,
        seo: {
            title: 'African Bags & Purses | Handcrafted Bags',
            description: 'Shop our handcrafted African bags and purses, perfect for any occasion.',
            keywords: ['african bags', 'purses', 'handbags'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['bags', 'purses', 'handbags'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
    {
        _id: 'cat_accessories_004',
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Traditional African jewelry',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_accessories_001', name: 'Accessories', slug: 'accessories', level: 1 }],
        children: [],
        stats: { productCount: 15, subCategoryCount: 0, totalViews: 2800, totalClicks: 820 },
        displayOrder: 3,
        featured: true,
        visible: true,
        seo: {
            title: 'African Jewelry | Traditional & Modern Designs',
            description: 'Beautiful African jewelry, from traditional to modern designs.',
            keywords: ['african jewelry', 'necklaces', 'bracelets', 'earrings'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['jewelry', 'necklaces', 'bracelets'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
];

accessoriesCategory.children = accessoriesSubCategories;