// src/data/categories/smocks.ts


import type { ICategory } from '../../types/category.types';

export const smocksCategory = {
    _id: 'cat_smocks_001',
    name: 'Smocks',
    slug: 'smocks',
    description: 'Authentic African smocks handcrafted by skilled artisans. Each piece tells a unique story of tradition and culture.',
    shortDescription: 'Traditional African smocks for every occasion',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    level: 1,
    ancestors: [],
    children: [],
    seo: {
        title: 'Authentic African Smocks | Traditional Handcrafted Smocks',
        description: 'Discover our collection of authentic African smocks. Handcrafted by skilled artisans using traditional techniques.',
        keywords: ['african smocks', 'traditional smocks', 'handcrafted smocks', 'cultural attire'],
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
        productCount: 45,
        subCategoryCount: 5,
        totalViews: 12500,
        totalClicks: 3450,
    },
    displayOrder: 1,
    featured: true,
    visible: true,
    meta: {
        tags: ['smocks', 'traditional', 'handmade', 'african'],
        notes: 'Main smocks category',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    productCount: 0
} as ICategory;

export const smocksSubCategories = [
    {
        _id: 'cat_smocks_002',
        name: 'Classic Smocks',
        slug: 'classic-smocks',
        description: 'Timeless traditional smocks for everyday wear',
        shortDescription: 'Classic designs for everyday elegance',
        image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_smocks_001', name: 'Smocks', slug: 'smocks', level: 1 }],
        children: [],
        seo: {
            title: 'Classic African Smocks | Traditional Everyday Wear',
            description: 'Explore our collection of classic African smocks perfect for everyday wear.',
            keywords: ['classic smocks', 'everyday smocks', 'traditional wear'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        stats: {
            productCount: 15,
            subCategoryCount: 0,
            totalViews: 4500,
            totalClicks: 1200,
        },
        displayOrder: 1,
        featured: true,
        visible: true,
        meta: { tags: ['classic', 'everyday'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z', productCount: 0
    },
    {
        _id: 'cat_smocks_003',
        name: 'Premium Smocks',
        slug: 'premium-smocks',
        description: 'Luxury smocks for special occasions',
        shortDescription: 'Exclusive designs for celebrations',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_smocks_001', name: 'Smocks', slug: 'smocks', level: 1 }],
        children: [],
        seo: {
            title: 'Premium African Smocks | Luxury Traditional Attire',
            description: 'Discover our premium collection of luxury African smocks for special occasions.',
            keywords: ['premium smocks', 'luxury smocks', 'special occasion'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        stats: {
            productCount: 12,
            subCategoryCount: 0,
            totalViews: 3800,
            totalClicks: 950,
        },
        displayOrder: 2,
        featured: true,
        visible: true,
        meta: { tags: ['premium', 'luxury', 'occasion'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z', productCount: 0
    },
    {
        _id: 'cat_smocks_004',
        name: 'Wedding Smocks',
        slug: 'wedding-smocks',
        description: 'Special smocks for your big day',
        shortDescription: 'Make your wedding unforgettable',
        image: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_smocks_001', name: 'Smocks', slug: 'smocks', level: 1 }],
        children: [],
        seo: {
            title: 'Wedding Smocks | Traditional African Wedding Attire',
            description: 'Find the perfect smock for your wedding day. Custom designs available.',
            keywords: ['wedding smocks', 'bridal smocks', 'groom smocks'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        stats: {
            productCount: 8,
            subCategoryCount: 0,
            totalViews: 2900,
            totalClicks: 850,
        },
        displayOrder: 3,
        featured: true,
        visible: true,
        meta: { tags: ['wedding', 'bridal', 'special'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z', productCount: 0
    },
] as ICategory[];

// Update smocksCategory with children
smocksCategory.children = smocksSubCategories;