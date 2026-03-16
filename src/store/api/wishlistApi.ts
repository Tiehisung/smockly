// src/store/api/wishlistApi.ts


import type { IApiResponse } from "../../types";
import type { IProduct } from "../../types/product.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get wishlist
        getWishlist: builder.query<IApiResponse<IProduct[]> & { count: number }, void>({
            query: () => '/wishlist',
            providesTags: [TAG_TYPES.WISHLIST],
        }),

        // Add to wishlist
        addToWishlist: builder.mutation<{ message: string }, string>({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: [TAG_TYPES.WISHLIST],
            async onQueryStarted(_productId, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    wishlistApi.util.updateQueryData('getWishlist', undefined, (_draft) => {
                        // We'll add the product after the mutation succeeds
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // Remove from wishlist
        removeFromWishlist: builder.mutation<{ message: string }, string>({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.WISHLIST],
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
                        const index = draft?.data?.findIndex(p => p._id === productId);
                        if (index !== -1) draft?.data?.splice(index || 0, 1);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // Clear wishlist
        clearWishlist: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/wishlist',
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.WISHLIST],
        }),

        // Move to cart
        moveToCart: builder.mutation<{ message: string }, string>({
            query: (productId) => ({
                url: `/wishlist/${productId}/move-to-cart`,
                method: 'POST',
            }),
            invalidatesTags: [TAG_TYPES.WISHLIST, 'Cart'],
        }),

        // Check if in wishlist
        checkInWishlist: builder.query<boolean, string>({
            query: (productId) => `/wishlist/check/${productId}`,
            providesTags: (_result, _error, productId) => [
                { type: TAG_TYPES.WISHLIST, id: productId },
            ],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useClearWishlistMutation,
    useMoveToCartMutation,
    useCheckInWishlistQuery,
    useLazyGetWishlistQuery,
    useLazyCheckInWishlistQuery
} = wishlistApi;