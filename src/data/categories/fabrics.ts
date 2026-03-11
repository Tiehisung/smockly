// src/data/categories/fabrics.ts

import type { ICategory } from "../../types/category.types";

export const fabricsCategory: ICategory = {
    _id: 'cat_fabrics_001',
    name: 'Fabrics',
    slug: 'fabrics',
    description: 'Premium African fabrics by the yard. Perfect for custom projects and DIY creations.',
    shortDescription: 'Premium fabrics by the yard',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    level: 1,
    ancestors: [],
    children: [],
    seo: {
        title: 'African Fabrics | Premium Quality by the Yard',
        description: 'Shop our collection of premium African fabrics. Perfect for custom projects and DIY creations.',
        keywords: ['african fabrics', 'wax print', 'kente', 'ankara', 'mud cloth'],
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
        productCount: 28,
        subCategoryCount: 4,
        totalViews: 7200,
        totalClicks: 2100,
    },
    displayOrder: 5,
    featured: true,
    visible: true,
    meta: {
        tags: ['fabrics', 'textiles', 'wax print', 'kente'],
        notes: 'Fabrics category',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    productCount: 0
};

export const fabricsSubCategories: ICategory[] = [
    {
        _id: 'cat_fabrics_002',
        name: 'Wax Print',
        slug: 'wax-print',
        description: 'Colorful wax print fabrics',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_fabrics_001', name: 'Fabrics', slug: 'fabrics', level: 1 }],
        children: [],
        stats: { productCount: 10, subCategoryCount: 0, totalViews: 2800, totalClicks: 820 },
        displayOrder: 1,
        featured: true,
        visible: true,
        seo: {
            title: 'Wax Print Fabrics | Colorful African Prints',
            description: 'Beautiful wax print fabrics in various colors and patterns.',
            keywords: ['wax print', 'dutch wax', 'african print'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['wax print', 'dutch wax'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
    {
        _id: 'cat_fabrics_003',
        name: 'Kente',
        slug: 'kente',
        description: 'Traditional Kente cloth',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        level: 2,
        ancestors: [{ _id: 'cat_fabrics_001', name: 'Fabrics', slug: 'fabrics', level: 1 }],
        children: [],
        stats: { productCount: 8, subCategoryCount: 0, totalViews: 2100, totalClicks: 640 },
        displayOrder: 2,
        featured: true,
        visible: true,
        seo: {
            title: 'Kente Cloth | Traditional Ghanaian Fabric',
            description: 'Authentic Kente cloth from Ghana. Rich in tradition and symbolism.',
            keywords: ['kente', 'ghana kente', 'traditional fabric'],
        },
        settings: {
            showProducts: true,
            showSubCategories: false,
            layout: 'grid',
            productsPerPage: 12,
            defaultSort: 'newest',
            filterable: true,
        },
        meta: { tags: ['kente', 'ghana'] },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        productCount: 0
    },
];

fabricsCategory.children = fabricsSubCategories;