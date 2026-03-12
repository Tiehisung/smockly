// src/store/api/ordersApi.ts

import type { IPaginatedResponse } from "../../types";
import type { ICreateOrderPayload, IOrder } from "../../types/order.types";
import { baseApi } from "./baseApi";
import { TAG_TYPES } from "./tags";
 
export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get user orders
        getUserOrders: builder.query<
            IPaginatedResponse<IOrder>['data'],
            { page?: number; limit?: number; status?: string }
        >({
            query: (params) => ({
                url: '/orders',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.ORDERS, id: _id })),
                        { type: TAG_TYPES.ORDERS, id: 'LIST' },
                    ]
                    : [{ type: TAG_TYPES.ORDERS, id: 'LIST' }],
        }),

        // Get order by ID
        getOrderById: builder.query<IOrder, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: TAG_TYPES.ORDER, id }],
        }),

        // Get order by number
        getOrderByNumber: builder.query<IOrder, string>({
            query: (orderNumber) => `/orders/number/${orderNumber}`,
            providesTags: (_result, _error, orderNumber) => [
                { type: TAG_TYPES.ORDER, id: orderNumber },
            ],
        }),

        // Create order
        createOrder: builder.mutation<IOrder, ICreateOrderPayload>({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: [
                { type: TAG_TYPES.ORDERS, id: 'LIST' },
                { type: 'Cart' }, // Invalidate cart after order creation
            ],
        }),

        // Cancel order
        cancelOrder: builder.mutation<IOrder, { orderId: string; reason?: string }>({
            query: ({ orderId, reason }) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: TAG_TYPES.ORDER, id: orderId },
                { type: TAG_TYPES.ORDERS, id: 'LIST' },
            ],
        }),

        // Track order
        trackOrder: builder.query<{ tracking: IOrder['tracking'] }, string>({
            query: (orderNumber) => `/orders/${orderNumber}/track`,
        }),

        // Request return
        requestReturn: builder.mutation<
            IOrder,
            { orderId: string; items: string[]; reason: string }
        >({
            query: (data) => ({
                url: `/orders/${data.orderId}/return`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: TAG_TYPES.ORDER, id: orderId },
            ],
        }),

        // Get shipping methods
        getShippingMethods: builder.query<
            Array<{ id: string; name: string; cost: number; estimatedDays: [number, number] }>,
            { address?: any }
        >({
            query: (params) => ({
                url: '/orders/shipping-methods',
                params,
            }),
        }),

        // Admin: Get all orders
        getAllOrders: builder.query<
            IPaginatedResponse<IOrder>['data'],
            { page?: number; limit?: number; status?: string; search?: string }
        >({
            query: (params) => ({
                url: '/admin/orders',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ _id }) => ({ type: TAG_TYPES.ORDERS, id: _id })),
                        { type: TAG_TYPES.ORDERS, id: 'ADMIN_LIST' },
                    ]
                    : [{ type: TAG_TYPES.ORDERS, id: 'ADMIN_LIST' }],
        }),

        // Admin: Update order status
        updateOrderStatus: builder.mutation<
            IOrder,
            { orderId: string; status: string; note?: string }
        >({
            query: ({ orderId, status, note }) => ({
                url: `/admin/orders/${orderId}/status`,
                method: 'PATCH',
                body: { status, note },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: TAG_TYPES.ORDER, id: orderId },
                { type: TAG_TYPES.ORDERS, id: 'ADMIN_LIST' },
                { type: TAG_TYPES.ORDERS, id: 'LIST' },
            ],
        }),

        // Admin: Update payment status
        updatePaymentStatus: builder.mutation<
            IOrder,
            { orderId: string; paymentStatus: string; transactionId?: string }
        >({
            query: ({ orderId, paymentStatus, transactionId }) => ({
                url: `/admin/orders/${orderId}/payment`,
                method: 'PATCH',
                body: { paymentStatus, transactionId },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: TAG_TYPES.ORDER, id: orderId },
            ],
        }),

        // Admin: Add tracking number
        addTrackingNumber: builder.mutation<
            IOrder,
            { orderId: string; trackingNumber: string; carrier: string }
        >({
            query: ({ orderId, trackingNumber, carrier }) => ({
                url: `/admin/orders/${orderId}/tracking`,
                method: 'POST',
                body: { trackingNumber, carrier },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: TAG_TYPES.ORDER, id: orderId },
            ],
        }),
    }),
});

export const {
    useGetUserOrdersQuery,
    useGetOrderByIdQuery,
    useGetOrderByNumberQuery,
    useCreateOrderMutation,
    useCancelOrderMutation,
    useTrackOrderQuery,
    useRequestReturnMutation,
    useGetShippingMethodsQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useAddTrackingNumberMutation,
} = ordersApi;