// src/data/products/index.ts

import { productImages } from '../images/products';
import { generateSlug } from '..';
import type { IProduct } from '../../types/product.types';

// Helper to generate SKU
const generateSKU = (category: string, index: number): string => {
    const prefix = category.substring(0, 3).toUpperCase();
    const number = String(index).padStart(4, '0');
    return `${prefix}-${number}`;
};

// Smocks Products
export const smocksProducts  = [
    {
        _id: 'prod_smock_001',
        name: 'Classic Northern Smock',
        slug: generateSlug('Classic Northern Smock'),
        sku: generateSKU('smock', 1),
        description: 'Experience the rich heritage of Northern Ghana with our Classic Northern Smock. Handwoven by master artisans using traditional techniques passed down through generations. This exquisite piece features intricate patterns and vibrant colors that tell stories of our culture.',
        shortDescription: 'Handwoven traditional smock from Northern Ghana',
        category: 'smocks',
        subCategory: 'classic-smocks',
        tags: ['traditional', 'handwoven', 'classic', 'northern'],
        images: [
            {
                url: productImages.smock1.main,
                alt: 'Classic Northern Smock - Front View',
                isPrimary: true,
                order: 0,
            },
            ...productImages.smock1.gallery.map((url, index) => ({
                url,
                alt: `Classic Northern Smock - View ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 89.99,
            currency: 'USD',
            formatted: '$89.99',
        },
        compareAtPrice: {
            amount: 129.99,
            currency: 'USD',
            formatted: '$129.99',
        },
        inventory: {
            sku: generateSKU('smock', 1),
            quantity: 25,
            lowStockThreshold: 5,
            trackQuantity: true,
            allowBackorder: false,
            soldIndividually: false,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_smock_001_s',
                sku: generateSKU('smock', 1) + '-S',
                name: 'Classic Northern Smock - Small',
                options: [{ name: 'size', value: 'S' }],
                price: { amount: 89.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 1) + '-S',
                    quantity: 8,
                    lowStockThreshold: 2,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: false,
            },
            {
                _id: 'var_smock_001_m',
                sku: generateSKU('smock', 1) + '-M',
                name: 'Classic Northern Smock - Medium',
                options: [{ name: 'size', value: 'M' }],
                price: { amount: 89.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 1) + '-M',
                    quantity: 12,
                    lowStockThreshold: 3,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: true,
            },
            {
                _id: 'var_smock_001_l',
                sku: generateSKU('smock', 1) + '-L',
                name: 'Classic Northern Smock - Large',
                options: [{ name: 'size', value: 'L' }],
                price: { amount: 89.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 1) + '-L',
                    quantity: 5,
                    lowStockThreshold: 2,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: false,
            },
        ],
        attributes: {
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
                { name: 'Red', code: '#EF4444' },
                { name: 'Blue', code: '#3B82F6' },
                { name: 'Green', code: '#10B981' },
                { name: 'Gold', code: '#FBBF24' },
            ],
            materials: ['Cotton', 'Handwoven Fabric'],
            styles: ['Traditional', 'Classic'],
            occasion: ['Casual', 'Festival', 'Cultural Event'],
            cultural: ['Northern Ghana', 'Dagomba'],
            gender: 'unisex',
            handmade: true,
        },
        seo: {
            title: 'Classic Northern Smock | Traditional African Attire',
            description: 'Handwoven traditional smock from Northern Ghana. Authentic craftsmanship with vibrant colors and patterns.',
            keywords: ['northern smock', 'traditional smock', 'ghana smock', 'handwoven'],
        },
        ratings: {
            average: 4.8,
            count: 24,
            distribution: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 20 },
        },
        status: 'published',
        featured: true,
        bestseller: true,
        newArrival: false,
        onSale: true,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 10,
        },
        meta: {
            views: 1250,
            purchases: 45,
            revenue: 4045.55,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-02-20T00:00:00Z',
    },
    {
        _id: 'prod_smock_002',
        name: 'Premium Embroidered Smock',
        slug: generateSlug('Premium Embroidered Smock'),
        sku: generateSKU('smock', 2),
        description: 'Elevate your style with our Premium Embroidered Smock. This masterpiece features intricate hand embroidery that showcases the finest craftsmanship. Perfect for weddings, graduations, and special celebrations where you want to make a lasting impression.',
        shortDescription: 'Luxury smock with intricate hand embroidery',
        category: 'smocks',
        subCategory: 'premium-smocks',
        tags: ['premium', 'embroidered', 'luxury', 'wedding'],
        images: [
            {
                url: productImages.smock2.main,
                alt: 'Premium Embroidered Smock - Front View',
                isPrimary: true,
                order: 0,
            },
            ...productImages.smock2.gallery.map((url, index) => ({
                url,
                alt: `Premium Embroidered Smock - View ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 149.99,
            currency: 'USD',
            formatted: '$149.99',
        },
        compareAtPrice: {
            amount: 199.99,
            currency: 'USD',
            formatted: '$199.99',
        },
        inventory: {
            sku: generateSKU('smock', 2),
            quantity: 15,
            lowStockThreshold: 3,
            trackQuantity: true,
            allowBackorder: true,
            soldIndividually: false,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_smock_002_m',
                sku: generateSKU('smock', 2) + '-M',
                name: 'Premium Embroidered Smock - Medium',
                options: [{ name: 'size', value: 'M' }],
                price: { amount: 149.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 2) + '-M',
                    quantity: 5,
                    lowStockThreshold: 2,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: true,
            },
            {
                _id: 'var_smock_002_l',
                sku: generateSKU('smock', 2) + '-L',
                name: 'Premium Embroidered Smock - Large',
                options: [{ name: 'size', value: 'L' }],
                price: { amount: 149.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 2) + '-L',
                    quantity: 7,
                    lowStockThreshold: 2,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: false,
            },
            {
                _id: 'var_smock_002_xl',
                sku: generateSKU('smock', 2) + '-XL',
                name: 'Premium Embroidered Smock - X-Large',
                options: [{ name: 'size', value: 'XL' }],
                price: { amount: 159.99, currency: 'USD' }, // Surcharge for XL
                inventory: {
                    sku: generateSKU('smock', 2) + '-XL',
                    quantity: 3,
                    lowStockThreshold: 1,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: false,
            },
        ],
        attributes: {
            sizes: ['M', 'L', 'XL', 'XXL'],
            colors: [
                { name: 'Black', code: '#1F2937' },
                { name: 'Navy', code: '#1E3A8A' },
                { name: 'Burgundy', code: '#991B1B' },
                { name: 'Emerald', code: '#065F46' },
            ],
            materials: ['Cotton', 'Polyester Blend', 'Embroidery Thread'],
            styles: ['Premium', 'Embroidered', 'Luxury'],
            occasion: ['Wedding', 'Graduation', 'Formal Event'],
            cultural: ['Modern Fusion'],
            gender: 'men',
            handmade: true,
        },
        seo: {
            title: 'Premium Embroidered Smock | Luxury African Attire',
            description: 'Exquisite hand-embroidered smock for special occasions. Perfect for weddings and formal events.',
            keywords: ['embroidered smock', 'premium smock', 'wedding smock', 'luxury smock'],
        },
        ratings: {
            average: 4.9,
            count: 18,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 16 },
        },
        status: 'published',
        featured: true,
        bestseller: true,
        newArrival: true,
        onSale: true,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 5,
        },
        meta: {
            views: 980,
            purchases: 32,
            revenue: 4799.68,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-25T00:00:00Z',
    },
    {
        _id: 'prod_smock_003',
        name: 'Wedding Special Smock',
        slug: generateSlug('Wedding Special Smock'),
        sku: generateSKU('smock', 3),
        description: 'Make your special day unforgettable with our Wedding Special Smock. Designed exclusively for grooms and groomsmen, this smock combines traditional elegance with contemporary style. Features premium fabric and subtle embroidery that photographs beautifully.',
        shortDescription: 'Elegant smock for your perfect wedding day',
        category: 'smocks',
        subCategory: 'wedding-smocks',
        tags: ['wedding', 'groom', 'special occasion', 'elegant'],
        images: [
            {
                url: productImages.smock3.main,
                alt: 'Wedding Special Smock - Front View',
                isPrimary: true,
                order: 0,
            },
            ...productImages.smock3.gallery.map((url, index) => ({
                url,
                alt: `Wedding Special Smock - View ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 199.99,
            currency: 'USD',
            formatted: '$199.99',
        },
        compareAtPrice: {
            amount: 249.99,
            currency: 'USD',
            formatted: '$249.99',
        },
        inventory: {
            sku: generateSKU('smock', 3),
            quantity: 10,
            lowStockThreshold: 2,
            trackQuantity: true,
            allowBackorder: true,
            soldIndividually: false,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_smock_003_l',
                sku: generateSKU('smock', 3) + '-L',
                name: 'Wedding Special Smock - Large',
                options: [{ name: 'size', value: 'L' }],
                price: { amount: 199.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('smock', 3) + '-L',
                    quantity: 4,
                    lowStockThreshold: 1,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: true,
            },
        ],
        attributes: {
            sizes: ['L', 'XL', 'XXL'],
            colors: [
                { name: 'Ivory', code: '#F5F5F5' },
                { name: 'Champagne', code: '#F7E7CE' },
                { name: 'Navy', code: '#1E3A8A' },
            ],
            materials: ['Premium Cotton', 'Silk Blend', 'Embroidery'],
            styles: ['Wedding', 'Formal', 'Elegant'],
            occasion: ['Wedding', 'Rehearsal Dinner'],
            cultural: ['Modern'],
            gender: 'men',
            handmade: true,
        },
        seo: {
            title: 'Wedding Smock | Groom African Attire',
            description: 'Elegant wedding smock for grooms and groomsmen. Make your special day unforgettable.',
            keywords: ['wedding smock', 'groom smock', 'wedding attire'],
        },
        ratings: {
            average: 5.0,
            count: 12,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 12 },
        },
        status: 'published',
        featured: true,
        bestseller: false,
        newArrival: true,
        onSale: true,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 10,
        },
        meta: {
            views: 750,
            purchases: 18,
            revenue: 3599.82,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-28T00:00:00Z',
    },
] as IProduct[];

// Accessories Products
export const accessoriesProducts   = [
    {
        _id: 'prod_acc_001',
        name: 'Traditional Kufi Hat',
        slug: generateSlug('Traditional Kufi Hat'),
        sku: generateSKU('acc', 1),
        description: 'Complete your look with this beautifully handcrafted Traditional Kufi Hat. Made from premium fabrics with intricate embroidery, this hat adds the perfect finishing touch to any smock outfit.',
        shortDescription: 'Handcrafted traditional cap',
        category: 'accessories',
        subCategory: 'hats',
        tags: ['hat', 'kufi', 'cap', 'traditional'],
        images: [
            {
                url: productImages.hat1.main,
                alt: 'Traditional Kufi Hat',
                isPrimary: true,
                order: 0,
            },
            ...productImages.hat1.gallery.map((url, index) => ({
                url,
                alt: `Traditional Kufi Hat - View ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 29.99,
            currency: 'USD',
            formatted: '$29.99',
        },
        compareAtPrice: undefined,
        inventory: {
            sku: generateSKU('acc', 1),
            quantity: 50,
            lowStockThreshold: 10,
            trackQuantity: true,
            allowBackorder: false,
            soldIndividually: false,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_acc_001_s',
                sku: generateSKU('acc', 1) + '-S',
                name: 'Traditional Kufi Hat - Small',
                options: [{ name: 'size', value: 'S' }],
                price: { amount: 29.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('acc', 1) + '-S',
                    quantity: 15,
                    lowStockThreshold: 3,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: false,
            },
            {
                _id: 'var_acc_001_m',
                sku: generateSKU('acc', 1) + '-M',
                name: 'Traditional Kufi Hat - Medium',
                options: [{ name: 'size', value: 'M' }],
                price: { amount: 29.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('acc', 1) + '-M',
                    quantity: 20,
                    lowStockThreshold: 4,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: true,
            },
            {
                _id: 'var_acc_001_l',
                sku: generateSKU('acc', 1) + '-L',
                name: 'Traditional Kufi Hat - Large',
                options: [{ name: 'size', value: 'L' }],
                price: { amount: 29.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('acc', 1) + '-L',
                    quantity: 15,
                    lowStockThreshold: 3,
                    trackQuantity: true,
                    allowBackorder: false,
                    soldIndividually: false,
                },
                isDefault: false,
            },
        ],
        attributes: {
            sizes: ['S', 'M', 'L'],
            colors: [
                { name: 'Red', code: '#EF4444' },
                { name: 'Blue', code: '#3B82F6' },
                { name: 'Green', code: '#10B981' },
                { name: 'Black', code: '#1F2937' },
            ],
            materials: ['Cotton', 'Embroidery'],
            styles: ['Traditional', 'Casual'],
            gender: 'unisex',
            handmade: true,
        },
        seo: {
            title: 'Traditional Kufi Hat | African Cap',
            description: 'Handcrafted traditional African hat, perfect for completing your smock outfit.',
            keywords: ['kufi hat', 'african cap', 'traditional hat'],
        },
        ratings: {
            average: 4.7,
            count: 32,
            distribution: { 1: 0, 2: 1, 3: 2, 4: 8, 5: 21 },
        },
        status: 'published',
        featured: true,
        bestseller: true,
        newArrival: false,
        onSale: false,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 20,
        },
        meta: {
            views: 2100,
            purchases: 89,
            revenue: 2669.11,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-02-18T00:00:00Z',
    },
    {
        _id: 'prod_acc_002',
        name: 'Leather Messenger Bag',
        slug: generateSlug('Leather Messenger Bag'),
        sku: generateSKU('acc', 2),
        description: 'Carry your essentials in style with our handcrafted Leather Messenger Bag. Made from genuine leather with traditional embossing, this bag combines functionality with cultural flair.',
        shortDescription: 'Handmade leather bag with traditional patterns',
        category: 'accessories',
        subCategory: 'bags',
        tags: ['bag', 'leather', 'messenger', 'handmade'],
        images: [
            {
                url: productImages.bag1.main,
                alt: 'Leather Messenger Bag',
                isPrimary: true,
                order: 0,
            },
            ...productImages.bag1.gallery.map((url, index) => ({
                url,
                alt: `Leather Messenger Bag - View ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 89.99,
            currency: 'USD',
            formatted: '$89.99',
        },
        compareAtPrice: {
            amount: 119.99,
            currency: 'USD',
            formatted: '$119.99',
        },
        inventory: {
            sku: generateSKU('acc', 2),
            quantity: 20,
            lowStockThreshold: 5,
            trackQuantity: true,
            allowBackorder: false,
            soldIndividually: true,
        },
        hasVariants: false,
        attributes: {
            colors: [{ name: 'Brown', code: '#92400E' }],
            materials: ['Genuine Leather', 'Brass Hardware'],
            styles: ['Classic', 'Rustic'],
        },
        seo: {
            title: 'Leather Messenger Bag | African Style Bag',
            description: 'Handmade leather messenger bag with traditional embossing. Perfect for everyday use.',
            keywords: ['leather bag', 'messenger bag', 'african bag'],
        },
        ratings: {
            average: 4.9,
            count: 15,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 13 },
        },
        status: 'published',
        featured: true,
        bestseller: false,
        newArrival: true,
        onSale: true,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 5,
        },
        meta: {
            views: 850,
            purchases: 22,
            revenue: 1979.78,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-02-22T00:00:00Z',
    },
] as IProduct[];

// Fabrics Products
export const fabricsProducts  = [
    {
        _id: 'prod_fab_001',
        name: 'Premium Wax Print - Gold & Blue',
        slug: generateSlug('Premium Wax Print - Gold & Blue'),
        sku: generateSKU('fab', 1),
        description: 'Vibrant wax print fabric perfect for custom smocks and projects. Features traditional patterns in stunning gold and blue. Sold by the yard.',
        shortDescription: 'Vibrant wax print fabric - 6 yards',
        category: 'fabrics',
        subCategory: 'wax-print',
        tags: ['fabric', 'wax print', 'by the yard'],
        images: [
            {
                url: productImages.fabric1.main,
                alt: 'Wax Print Fabric - Gold & Blue',
                isPrimary: true,
                order: 0,
            },
            ...productImages.fabric1.gallery.map((url, index) => ({
                url,
                alt: `Wax Print Fabric - Detail ${index + 1}`,
                isPrimary: false,
                order: index + 1,
            })),
        ],
        price: {
            amount: 45.99,
            currency: 'USD',
            formatted: '$45.99',
        },
        compareAtPrice: undefined,
        inventory: {
            sku: generateSKU('fab', 1),
            quantity: 100,
            lowStockThreshold: 20,
            trackQuantity: true,
            allowBackorder: true,
            soldIndividually: false,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_fab_001_2yd',
                sku: generateSKU('fab', 1) + '-2YD',
                name: '2 Yards',
                options: [{ name: 'length', value: '2 yards' }],
                price: { amount: 45.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('fab', 1) + '-2YD',
                    quantity: 30,
                    lowStockThreshold: 5,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: true,
            },
            {
                _id: 'var_fab_001_4yd',
                sku: generateSKU('fab', 1) + '-4YD',
                name: '4 Yards',
                options: [{ name: 'length', value: '4 yards' }],
                price: { amount: 85.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('fab', 1) + '-4YD',
                    quantity: 25,
                    lowStockThreshold: 5,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: false,
            },
            {
                _id: 'var_fab_001_6yd',
                sku: generateSKU('fab', 1) + '-6YD',
                name: '6 Yards',
                options: [{ name: 'length', value: '6 yards' }],
                price: { amount: 125.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('fab', 1) + '-6YD',
                    quantity: 15,
                    lowStockThreshold: 3,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: false,
                },
                isDefault: false,
            },
        ],
        attributes: {
            colors: [
                { name: 'Gold', code: '#FBBF24' },
                { name: 'Blue', code: '#3B82F6' },
            ],
            materials: ['100% Cotton'],
            styles: ['Wax Print', 'Traditional'],
            length: ['2 yards', '4 yards', '6 yards'],
        },
        seo: {
            title: 'African Wax Print Fabric | Gold & Blue',
            description: 'Premium quality wax print fabric. Perfect for custom smocks and traditional projects.',
            keywords: ['wax print', 'african fabric', 'ankara', 'textile'],
        },
        ratings: {
            average: 4.8,
            count: 28,
            distribution: { 1: 0, 2: 0, 3: 1, 4: 4, 5: 23 },
        },
        status: 'published',
        featured: true,
        bestseller: true,
        newArrival: false,
        onSale: false,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 10,
        },
        meta: {
            views: 1850,
            purchases: 67,
            revenue: 3081.33,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
    },
] as unknown as IProduct[];

// Bundles Products
export const bundlesProducts  = [
    {
        _id: 'prod_bundle_001',
        name: 'His & Hers Wedding Bundle',
        slug: generateSlug('His & Hers Wedding Bundle'),
        sku: generateSKU('bndl', 1),
        description: 'Complete wedding package for the happy couple. Includes matching premium smocks for bride and groom, plus coordinating accessories. Save big on your special day!',
        shortDescription: 'Matching wedding smocks for couple',
        category: 'bundles',
        subCategory: 'couple-sets',
        tags: ['bundle', 'wedding', 'couple', 'matching'],
        images: [
            {
                url: productImages.smock2.main,
                alt: 'His & Hers Wedding Bundle',
                isPrimary: true,
                order: 0,
            },
        ],
        price: {
            amount: 329.99,
            currency: 'USD',
            formatted: '$329.99',
        },
        compareAtPrice: {
            amount: 449.98,
            currency: 'USD',
            formatted: '$449.98',
        },
        inventory: {
            sku: generateSKU('bndl', 1),
            quantity: 5,
            lowStockThreshold: 2,
            trackQuantity: true,
            allowBackorder: true,
            soldIndividually: true,
        },
        hasVariants: true,
        variants: [
            {
                _id: 'var_bndl_001_set1',
                sku: generateSKU('bndl', 1) + '-SET1',
                name: 'Bundle - Set 1',
                options: [
                    { name: 'his_size', value: 'L' },
                    { name: 'her_size', value: 'M' },
                ],
                price: { amount: 329.99, currency: 'USD' },
                inventory: {
                    sku: generateSKU('bndl', 1) + '-SET1',
                    quantity: 2,
                    lowStockThreshold: 1,
                    trackQuantity: true,
                    allowBackorder: true,
                    soldIndividually: true,
                },
                isDefault: true,
            },
        ],
        attributes: {
            sizes: ['His: L, Her: M', 'His: XL, Her: L'],
            colors: [
                { name: 'Ivory/Gold', code: '#F5F5F5' },
                { name: 'Navy/Silver', code: '#1E3A8A' },
            ],
            materials: ['Premium Cotton', 'Embroidery'],
            styles: ['Wedding Bundle'],
            occasion: ['Wedding'],
        },
        seo: {
            title: 'His & Hers Wedding Bundle | Matching Couple Smocks',
            description: 'Complete wedding package with matching smocks for bride and groom. Save on your special day!',
            keywords: ['wedding bundle', 'couple set', 'matching smocks'],
        },
        ratings: {
            average: 5.0,
            count: 8,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 8 },
        },
        status: 'published',
        featured: true,
        bestseller: true,
        newArrival: true,
        onSale: true,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 2,
        },
        meta: {
            views: 620,
            purchases: 12,
            revenue: 3959.88,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-02-24T00:00:00Z',
    },
] as IProduct[];

// Custom Products
export const customProducts  = [
    {
        _id: 'prod_custom_001',
        name: 'Custom Design Service',
        slug: generateSlug('Custom Design Service'),
        sku: generateSKU('cust', 1),
        description: 'Work with our master artisans to create your unique smock. Choose your fabric, style, measurements, and special details. A one-of-a-kind piece made just for you.',
        shortDescription: 'Create your own unique smock',
        category: 'custom',
        tags: ['custom', 'bespoke', 'made to measure'],
        images: [
            {
                url: productImages.smock3.main,
                alt: 'Custom Smock Design',
                isPrimary: true,
                order: 0,
            },
        ],
        price: {
            amount: 299.99,
            currency: 'USD',
            formatted: '$299.99',
        },
        compareAtPrice: undefined,
        inventory: {
            sku: generateSKU('cust', 1),
            quantity: 999,
            lowStockThreshold: 10,
            trackQuantity: false,
            allowBackorder: true,
            soldIndividually: true,
        },
        hasVariants: false,
        attributes: {
            styles: ['Traditional', 'Modern', 'Fusion'],
            materials: ['Any fabric'],
            handmade: true,
        },
        seo: {
            title: 'Custom Smock Design | Bespoke African Attire',
            description: 'Create your own unique smock. Work with our artisans to design a one-of-a-kind piece.',
            keywords: ['custom smock', 'bespoke', 'made to measure'],
        },
        ratings: {
            average: 4.9,
            count: 15,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 13 },
        },
        status: 'published',
        featured: true,
        bestseller: false,
        newArrival: false,
        onSale: false,
        settings: {
            requiresShipping: true,
            isDigital: false,
            isTaxable: true,
            taxClass: 'standard',
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 1,
        },
        meta: {
            views: 890,
            purchases: 24,
            revenue: 7199.76,
            lastViewed: new Date().toISOString(),
            lastPurchased: new Date().toISOString(),
        },
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-02-20T00:00:00Z',
    },
] as IProduct[];

// Combine all products
export const allProducts: IProduct[] = [
    ...smocksProducts,
    ...accessoriesProducts,
    ...fabricsProducts,
    ...bundlesProducts,
    ...customProducts,
];

// Featured products
export const featuredProducts = allProducts.filter(p => p.featured);

// Bestsellers
export const bestsellers = allProducts.filter(p => p.bestseller);

// New arrivals
export const newArrivals = allProducts.filter(p => p.newArrival);

// On sale
export const onSaleProducts = allProducts.filter(p => p.onSale);

// Product map for quick lookup by slug
export const productMap = new Map(
    allProducts.map(product => [product.slug, product])
);

// Products by category
export const productsByCategory = allProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
        acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
}, {} as Record<string, IProduct[]>);

// Products by subcategory
export const productsBySubCategory = allProducts.reduce((acc, product) => {
    if (product.subCategory) {
        if (!acc[product.subCategory]) {
            acc[product.subCategory] = [];
        }
        acc[product.subCategory].push(product);
    }
    return acc;
}, {} as Record<string, IProduct[]>);

// Related products (by category)
export const getRelatedProducts = (productId: string, limit: number = 4): IProduct[] => {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return [];

    const related = allProducts.filter(p =>
        p._id !== productId &&
        p.category === product.category
    );

    return related.slice(0, limit);
};