// src/store/api/reviewsApi.ts

import type { IPaginatedResponse } from "../../types";
import type { ICreateReviewData, IProductReviewStats, IReview, IReviewFilters } from "../../types/review.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";
 
export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get product reviews
        getProductReviews: builder.query<
            IPaginatedResponse<IReview>['data'],
            IReviewFilters
        >({
            query: ({ productId, ...params }) => ({
                url: `/products/${productId}/reviews`,
                params,
            }),
            providesTags: (_result, _error, { productId }) => [
                { type: TAG_TYPES.REVIEWS, id: productId },
            ],
        }),

        // Get review stats for product
        getProductReviewStats: builder.query<IProductReviewStats, string>({
            query: (productId) => `/products/${productId}/reviews/stats`,
            providesTags: (_result, _error, productId) => [
                { type: TAG_TYPES.REVIEWS, id: `${productId}_stats` },
            ],
        }),

        // Get user's reviews
        getUserReviews: builder.query<
            IPaginatedResponse<IReview>['data'],
            { page?: number; limit?: number }
        >({
            query: (params) => ({
                url: '/user/reviews',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.REVIEWS, id: _id })),
                        { type: TAG_TYPES.REVIEWS, id: 'USER' },
                    ]
                    : [{ type: TAG_TYPES.REVIEWS, id: 'USER' }],
        }),

        // Create review
        createReview: builder.mutation<IReview, ICreateReviewData>({
            query: (reviewData) => {
                const formData = new FormData();
                formData.append('productId', reviewData.productId);
                formData.append('rating', reviewData.rating.toString());
                formData.append('title', reviewData.title);
                formData.append('content', reviewData.content);

                if (reviewData.images) {
                    reviewData.images.forEach((image) => {
                        formData.append('images', image);
                    });
                }

                return {
                    url: '/reviews',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { productId }) => [
                { type: TAG_TYPES.REVIEWS, id: productId },
                { type: TAG_TYPES.REVIEWS, id: `${productId}_stats` },
                { type: 'Product', id: productId },
            ],
        }),

        // Update review
        updateReview: builder.mutation<
            IReview,
            { reviewId: string; data: Partial<ICreateReviewData> }
        >({
            query: ({ reviewId, data }) => {
                const formData = new FormData();
                if (data.rating) formData.append('rating', data.rating.toString());
                if (data.title) formData.append('title', data.title);
                if (data.content) formData.append('content', data.content);
                if (data.images) {
                    data.images.forEach((image) => {
                        formData.append('images', image);
                    });
                }

                return {
                    url: `/reviews/${reviewId}`,
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: (result, _error, { reviewId }) => [
                { type: TAG_TYPES.REVIEW, id: reviewId },
                { type: TAG_TYPES.REVIEWS, id: result?.productId },
                { type: TAG_TYPES.REVIEWS, id: `${result?.productId}_stats` },
            ],
        }),

        // Delete review
        deleteReview: builder.mutation<{ message: string }, string>({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.REVIEWS],
        }),

        // Mark review as helpful
        markHelpful: builder.mutation<{ helpful: number }, string>({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}/helpful`,
                method: 'POST',
            }),
            // async onQueryStarted(_reviewId, { dispatch, queryFulfilled }) {
            //     // Optimistic update
            //     const patchResult = dispatch(
            //         reviewsApi.util.updateQueryData('getProductReviews', { productId: '', }, (_draft) => {
            //             // This will be handled by the specific query
            //         })
            //     );
            //     try {
            //         await queryFulfilled;
            //     } catch {
            //         patchResult.undo();
            //     }
            // },
        }),

        // Report review
        reportReview: builder.mutation<{ message: string }, { reviewId: string; reason: string }>({
            query: ({ reviewId, reason }) => ({
                url: `/reviews/${reviewId}/report`,
                method: 'POST',
                body: { reason },
            }),
        }),

        // Admin: Get all reviews
        getAllReviews: builder.query<
            IPaginatedResponse<IReview>['data'],
            { page?: number; limit?: number; status?: string }
        >({
            query: (params) => ({
                url: '/admin/reviews',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.REVIEWS, id: _id })),
                        { type: TAG_TYPES.REVIEWS, id: 'ADMIN' },
                    ]
                    : [{ type: TAG_TYPES.REVIEWS, id: 'ADMIN' }],
        }),

        // Admin: Moderate review
        moderateReview: builder.mutation<
            IReview,
            { reviewId: string; status: 'approved' | 'rejected'; reason?: string }
        >({
            query: ({ reviewId, status, reason }) => ({
                url: `/admin/reviews/${reviewId}/moderate`,
                method: 'PATCH',
                body: { status, reason },
            }),
            invalidatesTags: [TAG_TYPES.REVIEWS],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useGetProductReviewStatsQuery,
    useGetUserReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useMarkHelpfulMutation,
    useReportReviewMutation,
    useGetAllReviewsQuery,
    useModerateReviewMutation,
} = reviewsApi;