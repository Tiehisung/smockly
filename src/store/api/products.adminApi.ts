// src/store/api/adminProductApi.ts
import type { IApiResponse, } from '../../types';
import type { IProduct } from '../../types/product.types';
import { baseApi } from './baseApi';


export interface AdminProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: 'draft' | 'published' | 'archived';
}

export const adminProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin get all products
        adminGetProducts: builder.query<IApiResponse<IProduct[]>, AdminProductFilters>({
            query: (params) => ({
                url: '/products/admin/all',
                params
            }),
            providesTags: ['Products']
        }),

        // Admin get product by ID
        adminGetProductById: builder.query<IApiResponse<IProduct>, string>({
            query: (id) => `/products/admin/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Products', id }]
        }),

        // Create product
        createProduct: builder.mutation<IApiResponse<IProduct>, FormData>({
            query: (productData) => ({
                url: '/products',
                method: 'POST',
                body: productData
            }),
            invalidatesTags: ['Products']
        }),

        // Update product
        updateProduct: builder.mutation<IApiResponse<IProduct>, { _id: string; data: FormData }>({
            query: ({ _id, data }) => ({
                url: `/products/${_id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Products', id: _id },
                'Products'
            ]
        }),

        // Delete product
        deleteProduct: builder.mutation<IApiResponse<IProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Products']
        }),

        // Duplicate product
        duplicateProduct: builder.mutation<IApiResponse<IProduct>, string>({
            query: (id) => ({
                url: `/products/${id}/duplicate`,
                method: 'POST'
            }),
            invalidatesTags: ['Products']
        }),

        // Bulk update products
        bulkUpdateProducts: builder.mutation<{ matchedCount: number; modifiedCount: number }, { ids: string[]; updates: Partial<IProduct> }>({
            query: (data) => ({
                url: '/products/bulk/update',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Products']
        }),

        // Bulk delete products
        bulkDeleteProducts: builder.mutation<{ deletedCount: number }, { ids: string[] }>({
            query: (data) => ({
                url: '/products/bulk/delete',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Products']
        }),

        // Update inventory
        updateInventory: builder.mutation<IApiResponse<IProduct>, { id: string; quantity: number; variantId?: string }>({
            query: ({ id, quantity, variantId }) => ({
                url: `/products/${id}/inventory`,
                method: 'PATCH',
                body: { quantity, variantId }
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Products', id }]
        })
    })
});

export const {
    useAdminGetProductsQuery,
    useAdminGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useDuplicateProductMutation,
    useBulkUpdateProductsMutation,
    useBulkDeleteProductsMutation,
    useUpdateInventoryMutation
} = adminProductApi;