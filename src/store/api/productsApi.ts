// src/store/api/productsApi.ts


import type { IPaginatedResponse } from "../../types";
import type { IProduct, IProductFilters } from "../../types/product.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all products with filters
        getProducts: builder.query<
            IPaginatedResponse<IProduct>['data'],
            Partial<IProductFilters>
        >({
            query: (filters) => ({
                url: '/products',
                params: {
                    page: filters?.page || 1,
                    limit: filters?.limit || 12,
                    category: filters?.categories?.join(','),
                    sizes: filters?.sizes?.join(','),
                    colors: filters?.colors?.join(','),
                    minPrice: filters?.priceRange?.[0],
                    maxPrice: filters?.priceRange?.[1],
                    minRating: filters?.minRating,
                    sortBy: filters?.sortBy,
                    inStock: filters?.inStock,
                    onSale: filters?.onSale,
                    search: filters?.search,
                    tags: filters?.tags?.join(','),
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.PRODUCTS, id: _id })),
                        { type: TAG_TYPES.PRODUCTS, id: 'LIST' },
                    ]
                    : [{ type: TAG_TYPES.PRODUCTS, id: 'LIST' }],
        }),

        // Get single product by slug or ID
        getProductBySlug: builder.query<IProduct, string>({
            query: (slug) => `/products/${slug}`,
            providesTags: (result, _error, slug) => [
                { type: TAG_TYPES.PRODUCT, id: slug },
                { type: TAG_TYPES.PRODUCT, id: result?._id },
            ],
        }),

        // Get product by ID
        getProductById: builder.query<IProduct, string>({
            query: (id) => `/products/id/${id}`,
            providesTags: (_result, _error, id) => [{ type: TAG_TYPES.PRODUCT, id }],
        }),

        // Get featured products
        getFeaturedProducts: builder.query<IProduct[], number>({
            query: (limit = 8) => `/products/featured?limit=${limit}`,
            providesTags: [{ type: TAG_TYPES.FEATURED }],
        }),

        // Get bestsellers
        getBestsellers: builder.query<IProduct[], number>({
            query: (limit = 8) => `/products/bestsellers?limit=${limit}`,
            providesTags: [{ type: TAG_TYPES.BESTSELLERS }],
        }),

        // Get new arrivals
        getNewArrivals: builder.query<IProduct[], number>({
            query: (limit = 8) => `/products/new?limit=${limit}`,
            providesTags: [{ type: TAG_TYPES.NEW }],
        }),

        // Get products by category
        getProductsByCategory: builder.query<
            IPaginatedResponse<IProduct>['data'],
            { category: string; page?: number; limit?: number }
        >({
            query: ({ category, page = 1, limit = 12 }) => ({
                url: `/products/category/${category}`,
                params: { page, limit },
            }),
            providesTags: (_result, _error, { category }) => [
                { type: TAG_TYPES.PRODUCTS, id: `CATEGORY_${category}` },
            ],
        }),

        // Search products
        searchProducts: builder.query<
            IPaginatedResponse<IProduct>['data'],
            { query: string; page?: number; limit?: number }
        >({
            query: ({ query, page = 1, limit = 12 }) => ({
                url: '/products/search',
                params: { q: query, page, limit },
            }),
            providesTags: (_result, _error, { query }) => [
                { type: TAG_TYPES.PRODUCTS, id: `SEARCH_${query}` },
            ],
        }),

        // Get related products
        getRelatedProducts: builder.query<IProduct[], { productId: string; limit?: number }>({
            query: ({ productId, limit = 4 }) =>
                `/products/${productId}/related?limit=${limit}`,
            providesTags: (_result, _error, { productId }) => [
                { type: TAG_TYPES.PRODUCTS, id: `RELATED_${productId}` },
            ],
        }),

        // Check product availability
        checkAvailability: builder.query<
            { available: boolean; quantity: number },
            { productId: string; variant?: string; quantity: number }
        >({
            query: (data) => ({
                url: '/products/check-availability',
                method: 'POST',
                body: data,
            }),
        }),








    }),
});

export const {
    // Queries
    useGetProductsQuery,
    useGetProductBySlugQuery,
    useGetProductByIdQuery,
    useGetFeaturedProductsQuery,
    useGetBestsellersQuery,
    useGetNewArrivalsQuery,
    useGetProductsByCategoryQuery,
    useSearchProductsQuery,
    useGetRelatedProductsQuery,
    useCheckAvailabilityQuery,
    useLazyGetProductsQuery,
    useLazySearchProductsQuery,


} = productsApi;