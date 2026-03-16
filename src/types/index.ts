export interface IApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    pagination?: IPagination
    error?: string;
    data?: T;
    errors?: IApiError[];
}

export interface IApiError {
    field?: string;
    message: string;
    code?: string;
}
export interface IPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number;
    previousPage: number;
}

export interface IPaginatedResponse<T> {
    success: boolean;
    data: {
        items: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface IQueryParams extends IBaseQueryParams {
    [k: string]: unknown
}
export interface IBaseQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string
    role?: string,
}

export interface ISelectOptionLV {
    value: string;
    label: string;
}

