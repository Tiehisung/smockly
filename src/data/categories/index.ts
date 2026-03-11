// src/data/categories/index.ts
import { smocksCategory, smocksSubCategories } from './smocks';
import { accessoriesCategory, accessoriesSubCategories } from './accessories';
import { bundlesCategory, bundlesSubCategories } from './bundles';
import { fabricsCategory, fabricsSubCategories } from './fabrics';
import { customCategory } from './custom';

// All categories combined
export const allCategories = [
    smocksCategory,
    accessoriesCategory,
    bundlesCategory,
    customCategory,
    fabricsCategory,
    ...smocksSubCategories,
    ...accessoriesSubCategories,
    ...bundlesSubCategories,
    ...fabricsSubCategories,
];

// Main parent categories only
export const parentCategories = [
    smocksCategory,
    accessoriesCategory,
    bundlesCategory,
    customCategory,
    fabricsCategory,
];

// Featured categories
export const featuredCategories = parentCategories.filter(c => c.featured);

// Category map for quick lookup by slug
export const categoryMap = new Map(
    allCategories.map(category => [category.slug, category])
);

// Category tree (for navigation)
export const categoryTree = parentCategories.map(category => ({
    ...category,
    children: allCategories.filter(c =>
        c.ancestors.length === 1 &&
        c.ancestors[0]._id === category._id
    ),
}));

// Export individual categories
export {
    smocksCategory,
    smocksSubCategories,

    accessoriesCategory,
    accessoriesSubCategories,

    bundlesCategory,
    bundlesSubCategories,
    
    fabricsCategory,
    customCategory,

    fabricsSubCategories,
};