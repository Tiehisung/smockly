// src/store/api/adminOrdersApi.ts
import { baseApi } from './baseApi';
import type { IOrder } from '../../types/order.types';
import { TAG_TYPES } from './tags';
import type { IApiResponse, } from '../../types';

export interface IAdminOrdersFilters {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export const adminOrdersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all orders with filters
        getAdminOrders: builder.query<IApiResponse<IOrder[]>, IAdminOrdersFilters>({
            query: (params) => ({
                url: '/orders/admin',
                params
            }),
            providesTags: ['Orders']
        }),

        // Get single order by ID
        getAdminOrderById: builder.query<IOrder, string>({
            query: (id) => `/orders/admin/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }]
        }),

        // Update order status
        updateOrderStatus: builder.mutation<IOrder, { orderId: string; status: string; note?: string }>({
            query: ({ orderId, status, note }) => ({
                url: `/orders/admin/${orderId}/status`,
                method: 'PATCH',
                body: { status, note }
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: 'Orders', id: orderId },
                'Orders'
            ]
        }),

        // Add tracking number
        addTrackingNumber: builder.mutation<IOrder, { orderId: string; trackingNumber: string; carrier: string }>({
            query: ({ orderId, trackingNumber, carrier }) => ({
                url: `/orders/admin/${orderId}/tracking`,
                method: 'POST',
                body: { trackingNumber, carrier }
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: 'Orders', id: orderId }
            ]
        }),

        // Update payment status
        updatePaymentStatus: builder.mutation<IOrder, { orderId: string; paymentStatus: string }>({
            query: ({ orderId, paymentStatus }) => ({
                url: `/orders/admin/${orderId}/payment`,
                method: 'PATCH',
                body: { paymentStatus }
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: 'Orders', id: orderId }
            ]
        }),

        // Add order note
        addOrderNote: builder.mutation<IOrder, { orderId: string; note: string; isPublic?: boolean }>({
            query: ({ orderId, note, isPublic }) => ({
                url: `/orders/admin/${orderId}/notes`,
                method: 'POST',
                body: { note, isPublic }
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: 'Orders', id: orderId }
            ]
        }),

        // Delete order (admin only - use with caution)
        deleteOrder: builder.mutation<void, string>({
            query: (orderId) => ({
                url: `/orders/admin/${orderId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Orders']
        }),

        // Export orders
        exportOrders: builder.mutation<Blob, { format: 'csv' | 'excel'; filters?: IAdminOrdersFilters }>({
            query: (data) => ({
                url: '/orders/admin/export',
                method: 'POST',
                body: data,
                responseHandler: (response) => response.blob()
            })
        }),

        // Get order statistics
        getOrderStats: builder.query<any, { period?: 'day' | 'week' | 'month' | 'year' }>({
            query: (params) => ({
                url: '/orders/admin/stats',
                params
            }),
            providesTags: [TAG_TYPES.ORDERSTATS]
        })
    })
});

export const {
    useGetAdminOrdersQuery,
    useGetAdminOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useAddTrackingNumberMutation,
    useUpdatePaymentStatusMutation,
    useAddOrderNoteMutation,
    useDeleteOrderMutation,
    useExportOrdersMutation,
    useGetOrderStatsQuery
} = adminOrdersApi;