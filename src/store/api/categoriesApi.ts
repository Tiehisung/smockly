// src/store/api/categoriesApi.ts

import { baseApi } from "./baseApi";
import type { ICategory } from "../../types/category.types";
import { TAG_TYPES } from "./tags";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query<ICategory[], { featured?: boolean; parent?: string }>({
            query: (params) => ({
                url: '/categories',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: TAG_TYPES.CATEGORIES, id: _id })),
                        { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                    ]
                    : [{ type: TAG_TYPES.CATEGORIES, id: 'LIST' }],
        }),

        // Get category by slug
        getCategoryBySlug: builder.query<ICategory, string>({
            query: (slug) => `/categories/${slug}`,
            providesTags: (result, _error, slug) => [
                { type: TAG_TYPES.CATEGORY, id: slug },
                { type: TAG_TYPES.CATEGORY, id: result?._id },
            ],
        }),

        // Get category tree (hierarchy)
        getCategoryTree: builder.query<ICategory[], void>({
            query: () => '/categories/tree',
            providesTags: [{ type: TAG_TYPES.CATEGORIES, id: 'TREE' }],
        }),

        // Admin: Create category
        createCategory: builder.mutation<ICategory, FormData>({
            query: (categoryData) => ({
                url: '/admin/categories',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: [
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Update category
        updateCategory: builder.mutation<ICategory, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/admin/categories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: TAG_TYPES.CATEGORY, id },
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Delete category
        deleteCategory: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/admin/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Reorder categories
        reorderCategories: builder.mutation<{ success: boolean }, { id: string; order: number }[]>({
            query: (categories) => ({
                url: '/admin/categories/reorder',
                method: 'PATCH',
                body: { categories },
            }),
            invalidatesTags: [{ type: TAG_TYPES.CATEGORIES, id: 'TREE' }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryBySlugQuery,
    useGetCategoryTreeQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
} = categoriesApi;