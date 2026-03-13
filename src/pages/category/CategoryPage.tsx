// src/pages/CategoryPage.tsx
import { useParams } from "react-router-dom";

import { useState } from "react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductCard } from "../../components/products/ProductCard";
import { Pagination } from "../../components/ui/Pagination";
import { useGetCategoryBySlugQuery } from "../../store/api/categoriesApi";
import { useGetProductsByCategoryQuery } from "../../store/api/productsApi";
import { allCategories } from "../../data/categories";
import { allProducts } from "../../data/products";
import useScrollToTop from "../../hooks/useScrollToTop";

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

  // Dummy
  const dummyCategory = allCategories.find((c) => c.slug === categorySlug);

  const normalCategory = category || dummyCategory;

  // Get products for this category
  const dummyProducts = allProducts.filter((p) => p.category === categorySlug);
  const normalProducts = productsData || {
    items: dummyProducts,
    pagination: {
      page: 1,
      limit: 4,
      total: 12,
      pages: 3,
    },
  };

  if (categoryLoading || productsLoading) return <LoadingSpinner />;

  // if (!category) {
  //   return (
  //     <div className="max-w-7xl mx-auto px-4 py-12 text-center">
  //       <h1 className="text-2xl font-bold text-gray-900 mb-4">
  //         Category Not Found
  //       </h1>
  //       <p className="text-gray-600">
  //         The category you're looking for doesn't exist.
  //       </p>
  //     </div>
  //   );
  // }
useScrollToTop();
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          {normalCategory?.image && (
            <div className="h-64 w-full overflow-hidden rounded-lg mb-6">
              <img
                src={normalCategory?.image}
                alt={normalCategory?.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {normalCategory?.name}
          </h1>
          {normalCategory?.description && (
            <p className="text-gray-600">{normalCategory?.description}</p>
          )}
        </div>

        {/* Products Grid */}
        {normalProducts?.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {normalProducts?.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {normalProducts?.pagination &&
              normalProducts.pagination.pages > 1 && (
                <Pagination
                  pagination={normalProducts.pagination}
                  onPageChange={setPage}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
}
