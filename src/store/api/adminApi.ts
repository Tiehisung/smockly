// src/store/api/adminApi.ts

import { baseApi } from "./baseApi";



export interface IDashboardStats {
    revenue: {
        today: number;
        week: number;
        month: number;
        year: number;
        total: number;
    };
    orders: {
        today: number;
        pending: number;
        processing: number;
        completed: number;
        cancelled: number;
    };
    products: {
        total: number;
        lowStock: number;
        outOfStock: number;
        featured: number;
    };
    customers: {
        total: number;
        new: number;
        active: number;
    };
    topProducts: Array<{
        _id: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
    recentOrders: Array<{
        _id: string;
        orderNumber: string;
        customer: string;
        total: number;
        status: string;
        createdAt: string;
    }>;
}

export interface ISalesReport {
    labels: string[];
    data: number[];
    total: number;
    growth: number;
}

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get dashboard stats
        getDashboardStats: builder.query<IDashboardStats, { period?: 'day' | 'week' | 'month' }>({
            query: (params) => ({
                url: '/admin/dashboard/stats',
                params,
            }),
            providesTags: ['Dashboard'],
        }),

        // Get sales report
        getSalesReport: builder.query<
            ISalesReport,
            { startDate: string; endDate: string; interval: 'day' | 'week' | 'month' }
        >({
            query: (params) => ({
                url: '/admin/reports/sales',
                params,
            }),
        }),

        // Get inventory report
        getInventoryReport: builder.query<any, void>({
            query: () => '/admin/reports/inventory',
        }),

        // Get customer report
        getCustomerReport: builder.query<any, { period?: 'week' | 'month' | 'year' }>({
            query: (params) => ({
                url: '/admin/reports/customers',
                params,
            }),
        }),

        // Export data
        exportData: builder.mutation<Blob, { type: 'orders' | 'products' | 'customers'; format: 'csv' | 'excel' }>({
            query: (data) => ({
                url: '/admin/export',
                method: 'POST',
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetSalesReportQuery,
    useGetInventoryReportQuery,
    useGetCustomerReportQuery,
    useExportDataMutation,
} = adminApi;