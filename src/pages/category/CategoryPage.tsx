// src/pages/CategoryPage.tsx
import { useParams } from "react-router-dom";

import { useState } from "react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductCard } from "../product/ProductCard";
import { Pagination } from "../../components/Pagination";
import { useGetCategoryBySlugQuery } from "../../store/api/categoriesApi";
import { useGetProductsByCategoryQuery } from "../../store/api/productsApi";

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [page, setPage] = useState(1);

  const { data: category, isLoading: categoryLoading } =
    useGetCategoryBySlugQuery(categorySlug!);
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsByCategoryQuery({
      category: categorySlug!,
      page,
      limit: 12,
    });

  if (categoryLoading || productsLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          {category?.data?.image && (
            <div className="h-64 w-full overflow-hidden rounded-lg mb-6">
              <img
                src={category?.data?.image}
                alt={category?.data?.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category?.data?.name}
          </h1>
          {category?.data?.description && (
            <p className="text-gray-600">{category?.data?.description}</p>
          )}
        </div>

        {/* Products Grid */}
        {productsData?.data?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData?.data?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {productsData?.pagination && productsData?.pagination.pages > 1 && (
              <Pagination
                pagination={productsData.pagination}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
