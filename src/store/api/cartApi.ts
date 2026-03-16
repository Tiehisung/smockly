// src/store/api/cartApi.ts

import type { IApiResponse } from "../../types";
import type { IAddToCartPayload, ICart, ICartItem, IUpdateCartItemPayload } from "../../types/cart.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get cart (creates one if doesn't exist)
        getCart: builder.query<IApiResponse<ICart>, void>({
            query: () => '/cart',
            providesTags: [TAG_TYPES.CART],
        }),

        // Add item to cart
        addToCart: builder.mutation<IApiResponse<ICart>, IAddToCartPayload>({
            query: (item) => ({
                url: '/cart/items',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: [TAG_TYPES.CART] ,
        }),

        // Update cart item quantity
        updateCartItem: builder.mutation<IApiResponse<ICart>, IUpdateCartItemPayload>({
            query: ({ itemId, quantity }) => ({
                url: `/cart/items/${itemId}`,
                method: 'PUT',
                body: { quantity },
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Remove item from cart
        removeFromCart: builder.mutation<IApiResponse<ICart>, string>({
            query: (itemId) => ({
                url: `/cart/items/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Clear cart
        clearCart: builder.mutation<IApiResponse<ICart>, void>({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Apply coupon
        applyCoupon: builder.mutation<IApiResponse<ICart>, string>({
            query: (code) => ({
                url: '/cart/apply-coupon',
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Remove coupon
        removeCoupon: builder.mutation<IApiResponse<ICart>, void>({
            query: () => ({
                url: '/cart/remove-coupon',
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Set shipping method
        setShippingMethod: builder.mutation<IApiResponse<ICart>, string>({
            query: (methodId) => ({
                url: '/cart/shipping-method',
                method: 'POST',
                body: { methodId },
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Merge guest cart with user cart (after login)
        mergeCart: builder.mutation<IApiResponse<ICart>, ICartItem[]>({
            query: (guestCart) => ({
                url: '/cart/merge',
                method: 'POST',
                body: { items: guestCart },
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Save cart for later
        saveForLater: builder.mutation<IApiResponse<ICart>, string>({
            query: (itemId) => ({
                url: `/cart/items/${itemId}/save-for-later`,
                method: 'POST',
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),

        // Move to cart from saved
        moveToCart: builder.mutation<IApiResponse<ICart>, string>({
            query: (itemId) => ({
                url: `/wishlist/${itemId}/move-to-cart`,
                method: 'POST',
            }),
            invalidatesTags: [TAG_TYPES.CART],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation,
    useSetShippingMethodMutation,
    useMergeCartMutation,
    useSaveForLaterMutation,
    useMoveToCartMutation,
} = cartApi;