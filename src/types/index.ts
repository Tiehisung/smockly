export interface IApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
    pagination?: IPagination
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
export interface IQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string,
    [k: string]: unknown
}

export interface ISelectOptionLV {
    value: string;
    label: string;
}