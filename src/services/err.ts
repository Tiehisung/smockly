import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { IApiError } from "../types";

// Transform error responses to consistent format
export const transformErrorResponse = (
    response: FetchBaseQueryError
): IApiError => {
    if (response.status === 401) {
        return {
            message: 'Unauthorized. Please login again.',
            code: 'UNAUTHORIZED',
        };
    }
    if (response.status === 403) {
        return {
            message: 'You do not have permission to perform this action.',
            code: 'FORBIDDEN',
        };
    }
    if (response.status === 404) {
        return {
            message: 'Resource not found.',
            code: 'NOT_FOUND',
        };
    }
    if (response.status === 422) {
        const data = response.data as any;
        return {
            message: data?.message || 'Validation failed.',
            code: 'VALIDATION_ERROR',
            // errors: data?.errors,
        };
    }
    if (response.status === 429) {
        return {
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT',
        };
    }
    if (Number(response.status) >= 500) {
        return {
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR',
        };
    }

    return {
        message: (response.data as any)?.message || 'An unexpected error occurred.',
        code: (response.data as any)?.code || 'UNKNOWN_ERROR',
        // errors: (response.data as any)?.errors,
    };
};
