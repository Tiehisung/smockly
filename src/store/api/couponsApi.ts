// src/store/api/couponsApi.ts

import type { IPaginatedResponse } from "../../types";
import type { ICoupon } from "../../types/coupon.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";
 
export const couponsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Validate coupon
        validateCoupon: builder.query<{ coupon: ICoupon, valid: boolean, message: string }, { code: string; subtotal?: number }>({
            query: ({ code, subtotal }) => ({
                url: '/coupons/validate',
                params: { code, subtotal },
            }),
        }),

        // Admin: Get all coupons
        getCoupons: builder.query<
            IPaginatedResponse<ICoupon>['data'],
            { page?: number; limit?: number; isActive?: boolean }
        >({
            query: (params) => ({
                url: '/admin/coupons',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.COUPONS, id: _id })),
                        { type: TAG_TYPES.COUPONS, id: 'LIST' },
                    ]
                    : [{ type: TAG_TYPES.COUPONS, id: 'LIST' }],
        }),

        // Admin: Get coupon by ID
        getCouponById: builder.query<ICoupon, string>({
            query: (id) => `/admin/coupons/${id}`,
            providesTags: (_result, _error, id) => [{ type: TAG_TYPES.COUPON, id }],
        }),

        // Admin: Create coupon
        createCoupon: builder.mutation<ICoupon, Partial<ICoupon>>({
            query: (couponData) => ({
                url: '/admin/coupons',
                method: 'POST',
                body: couponData,
            }),
            invalidatesTags: [{ type: TAG_TYPES.COUPONS, id: 'LIST' }],
        }),

        // Admin: Update coupon
        updateCoupon: builder.mutation<ICoupon, { id: string; data: Partial<ICoupon> }>({
            query: ({ id, data }) => ({
                url: `/admin/coupons/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: TAG_TYPES.COUPON, id },
                { type: TAG_TYPES.COUPONS, id: 'LIST' },
            ],
        }),

        // Admin: Delete coupon
        deleteCoupon: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/admin/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: TAG_TYPES.COUPONS, id: 'LIST' }],
        }),

        // Admin: Toggle coupon status
        toggleCouponStatus: builder.mutation<ICoupon, string>({
            query: (id) => ({
                url: `/admin/coupons/${id}/toggle`,
                method: 'PATCH',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: TAG_TYPES.COUPON, id },
                { type: TAG_TYPES.COUPONS, id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useValidateCouponQuery,
    useLazyValidateCouponQuery,
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponStatusMutation,
} = couponsApi;