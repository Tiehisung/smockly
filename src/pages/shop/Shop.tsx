// src/pages/Shop.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../../store/api/productsApi";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { ProductCard } from "../../components/products/ProductCard";

import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { EProductCategory } from "../../types/product.types";
import { ProductFilters } from "../../components/products/ProductFilters";
import { ProductSort } from "../../components/products/ProductSort";
import { Pagination } from "../../components/ui/Pagination";
import { allCategories } from "../../data/categories";
import { allProducts } from "../../data/products";

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get filters from URL
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "smocks";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 1000;
  const sizes = searchParams.getAll("size");
  const colors = searchParams.getAll("color");
  const search = searchParams.get("search") || "";

  // Fetch categories for filter sidebar
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({});

  // Fetch products with filters
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery({
      page,
      limit: 12,
      categories: category ? [category as EProductCategory] : [],
      sizes,
      colors,
      priceRange: [minPrice, maxPrice],
      sortBy: sort as any,
      search,
    });

  // Dummy

  const normalCategories = categories || allCategories;

  // Get products for this category
  const dummyProducts = allProducts.filter((p) => p.category === category);
  const normalProducts = productsData || {
    items: dummyProducts,
    pagination: {
      page: 1,
      limit: 4,
      total: 12,
      pages: 3,
    },
  };

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
            categories={normalCategories || []}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            isLoading={isLoadingCategories}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <ProductSort />

            {/* Products */}
            {normalProducts?.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                {isLoadingProducts ? (
                  <LoadingSpinner />
                ) : (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {normalProducts?.items.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    {normalProducts?.pagination &&
                      normalProducts.pagination.pages > 1 && (
                        <Pagination
                          pagination={normalProducts.pagination}
                          onPageChange={(page) => {
                            searchParams.set("page", page.toString());
                            setSearchParams(searchParams);
                          }}
                        />
                      )}
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
