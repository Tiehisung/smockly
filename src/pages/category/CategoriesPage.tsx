// src/pages/Categories.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductCard } from "../product/ProductCard";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { useGetProductsQuery } from "../../store/api/productsApi";
import type { EProductCategory } from "../../types/product.types";
 

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery({});

  // Fetch products for selected category
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery(
      {
        categories: selectedCategory
          ? [selectedCategory as EProductCategory]
          : [],
        page: 1,
        limit: 8,
      },
      { skip: !selectedCategory },
    );

  // Filter categories based on search
  const filteredCategories = categories?.data?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (categoriesLoading) return <LoadingSpinner page />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of authentic African smocks and accessories,
            carefully curated to bring you the best of traditional
            craftsmanship.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCategories?.map((category) => (
            <div
              key={category._id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Category Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-white/90 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {category.productCount || 0}
                  </span>
                  Products
                </div>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  View Collection
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Quick View Button */}
              <button
                onClick={() => setSelectedCategory(category.slug)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                Quick View
              </button>
            </div>
          ))}
        </div>

        {/* Featured Categories Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories?.data
              ?.filter((c) => c.featured)
              .slice(0, 2)
              .map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="group relative h-80 overflow-hidden rounded-xl"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600/90 to-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90">Shop Now →</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Category Modal for Quick View */}
        {selectedCategory && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setSelectedCategory(null)}
              />

              {/* Modal */}
              <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {
                        categories?.data?.find(
                          (c) => c.slug === selectedCategory,
                        )?.name
                      }
                    </h3>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Products Grid */}
                  {productsLoading ? (
                    <div className="py-12">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {productsData?.data?.slice(0, 4).map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>

                      {productsData?.data &&
                        (productsData?.data?.length || 0) > 0 && (
                          <div className="mt-6 text-center">
                            <Link
                              to={`/category/${selectedCategory}`}
                              onClick={() => setSelectedCategory(null)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View All{" "}
                              {
                                categories?.data?.find(
                                  (c) => c.slug === selectedCategory,
                                )?.name
                              }
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browse All Link */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse All Products
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
