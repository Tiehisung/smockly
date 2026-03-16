// src/hooks/useProducts.ts
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productsApi';
import type { IProductFilters } from '../types/product.types';


export const useProducts = (initialFilters?: Partial<IProductFilters>) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo<any>(() => ({
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 12,
        categories: searchParams.getAll('category'),
        sizes: searchParams.getAll('size'),
        colors: searchParams.getAll('color'),
        priceRange: [
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 1000,
        ],
        minRating: Number(searchParams.get('minRating')) || 0,
        sortBy: (searchParams.get('sort') as IProductFilters['sortBy']) || 'newest',
        inStock: searchParams.get('inStock') === 'true',
        onSale: searchParams.get('onSale') === 'true',
        search: searchParams.get('search') || '',
        ...initialFilters,
    }), [searchParams, initialFilters]) as IProductFilters;

    const { data, isLoading, error, refetch } = useGetProductsQuery(filters);

    const updateFilters = useCallback((newFilters: Partial<IProductFilters>) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                params.delete(key);
                value.forEach(v => params.append(key, v.toString()));
            } else if (value !== undefined && value !== '') {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        params.set('page', '1'); // Reset to page 1 on filter change
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    const clearFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    return {
        products: data?.data || [],
        pagination: data?.pagination,
        filters,
        isLoading,
        error,
        refetch,
        updateFilters,
        clearFilters,
    };
};