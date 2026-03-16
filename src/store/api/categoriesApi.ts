// src/store/api/categoriesApi.ts

import { baseApi } from "./baseApi";
import type { ICategory, ICategoryTreeNode } from "../../types/category.types";
import { TAG_TYPES } from "./tags";
import type { IApiResponse } from "../../types";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query<IApiResponse<ICategory[]>, { featured?: boolean; parent?: string }>({
            query: (params) => ({
                url: '/categories',
                params,
            }),
            providesTags: [TAG_TYPES.CATEGORIES],
        }),

        // Get category by slug
        getCategoryBySlug: builder.query<IApiResponse<ICategory>, string>({
            query: (slug) => `/categories/${slug}`,
            providesTags: (result, _error, slug) => [
                { type: TAG_TYPES.CATEGORY, id: slug },
                { type: TAG_TYPES.CATEGORY, id: result?.data?._id },
            ],
        }),

        // Get category tree (hierarchy)
        getCategoryTree: builder.query<IApiResponse<ICategoryTreeNode[]>, void>({
            query: () => '/categories/tree',
            providesTags: [{ type: TAG_TYPES.CATEGORIES, id: 'TREE' }],
        }),

        // Admin: Create category
        createCategory: builder.mutation<IApiResponse<ICategory>, FormData>({
            query: (categoryData) => ({
                url: '/categories',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: [
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Update category
        updateCategory: builder.mutation<IApiResponse<ICategory>, { _id: string; formData: FormData }>({
            query: ({ _id, formData }) => ({
                url: `/categories/${_id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: TAG_TYPES.CATEGORY, id: _id },
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Delete category
        deleteCategory: builder.mutation<IApiResponse<ICategory>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: TAG_TYPES.CATEGORIES, id: 'LIST' },
                { type: TAG_TYPES.CATEGORIES, id: 'TREE' },
            ],
        }),

        // Admin: Reorder categories
        reorderCategories: builder.mutation<IApiResponse, { id: string; order: number }[]>({
            query: (categories) => ({
                url: '/categories/reorder',
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