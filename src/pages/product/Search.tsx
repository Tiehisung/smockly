// src/pages/SearchResults.tsx
import { useSearchParams } from "react-router-dom";

import { useState } from "react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductCard } from "./ProductCard";
import { Pagination } from "../../components/Pagination";
import { useSearchProductsQuery } from "../../store/api/productsApi";

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearchProductsQuery({
    query,
    page,
    limit: 12,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {data?.pagination.total === 0
              ? `No results found for "${query}"`
              : `Found ${data?.pagination.total} results for "${query}"`}
          </p>
        </div>

        {data?.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products match your search.</p>
            <p className="text-gray-500">
              Try different keywords or browse our categories.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {data?.pagination && data.pagination.pages > 1 && (
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
