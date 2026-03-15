// src/pages/Shop.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../../store/api/productsApi";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { ProductCard } from "../product/ProductCard";

import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { EProductCategory } from "../../types/product.types";
import { ProductFilters } from "../product/ProductFilters";
import { ProductSort } from "../product/ProductSort";
import { Pagination } from "../../components/Pagination";

import useScrollToTop from "../../hooks/useScrollToTop";
import { OverlayLoader } from "../../components/loader/OverlayLoader";

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get filters from URL
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 1000;
  const sizes = searchParams.getAll("size");
  const colors = searchParams.getAll("color");
  const search = searchParams.get("search") || "";

  // Fetch categories for filter sidebar
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({});
  const category = searchParams.get("category");

  // Fetch products with filters
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching,
  } = useGetProductsQuery({
    page,
    limit: 12,
    categories: category ? [category as EProductCategory] : [],
    sizes,
    colors,
    priceRange: [minPrice, maxPrice],
    sortBy: sort as any,
    search,
  });

  useScrollToTop();

  // if (error) return <div>Error loading products</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden bg-gray-200 p-2 rounded"
          >
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            categories={categories?.data || []}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            isLoading={isLoadingCategories}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <ProductSort />

            {/* Products */}
            {productsData?.data?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                {isLoadingProducts ? (
                  <LoadingSpinner />
                ) : (
                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productsData?.data?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    {productsData?.pagination &&
                      productsData.pagination.pages > 1 && (
                        <Pagination
                          pagination={productsData.pagination}
                          onPageChange={(page) => {
                            searchParams.set("page", page.toString());
                            setSearchParams(searchParams);
                          }}
                        />
                      )}
                    <OverlayLoader
                      isLoading={isFetching && !isLoadingProducts}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
