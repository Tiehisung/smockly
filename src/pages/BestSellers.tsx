// src/pages/Bestsellers.tsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "./product/ProductCard";
import { ProductSort } from "./product/ProductSort";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { FireIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useGetBestsellersQuery } from "../store/api/productsApi";
import { useGetCategoriesQuery } from "../store/api/categoriesApi";
import type { IProduct } from "../types/product.types";
import { Pagination } from "../components/Pagination";

export function Bestsellers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [bestsellers, setBestsellers] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalSold: 0,
    topCategory: "",
    averageRating: 0,
    priceRange: { min: 0, max: 0 },
  });

  const itemsPerPage = 12;
  const sortBy = searchParams.get("sort") || "popular";

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetBestsellersQuery(50);

  const { data: categoriesData } = useGetCategoriesQuery({});

  // Extract the actual data arrays from the API response
  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  // Load bestsellers and calculate stats
  useEffect(() => {
    if (products.length > 0) {
      // Calculate stats
      const totalSold = products.reduce(
        (sum, p) => sum + (p.meta?.purchases || 0),
        0,
      );

      const categoryCounts = products.reduce(
        (acc: Record<string, number>, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        },
        {},
      );

      const topCategorySlug = Object.keys(categoryCounts).sort(
        (a, b) => categoryCounts[b] - categoryCounts[a],
      )[0];

      const topCategory =
        categories.find((c) => c.slug === topCategorySlug)?.name ||
        topCategorySlug;

      const avgRating =
        products.reduce((sum, p) => sum + (p.ratings?.average || 0), 0) /
        (products.length || 1);

      const prices = products.map((p) => p.price.amount);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setStats({
        totalSold,
        topCategory,
        averageRating: Number(avgRating.toFixed(1)),
        priceRange: { min: minPrice, max: maxPrice },
      });

      setBestsellers(products);
      setFilteredProducts(products);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, categories]);

  // Apply category filter and sorting
  useEffect(() => {
    let filtered = [...bestsellers];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply price filter
    filtered = filtered.filter(
      (p) => p.price.amount >= priceRange[0] && p.price.amount <= priceRange[1],
    );

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, sortBy, priceRange, bestsellers]);

  // Update displayed products based on pagination
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(start, end));
  }, [filteredProducts, currentPage]);

  const sortProducts = (products: IProduct[], sortType: string) => {
    switch (sortType) {
      case "price_asc":
        return [...products].sort((a, b) => a.price.amount - b.price.amount);
      case "price_desc":
        return [...products].sort((a, b) => b.price.amount - a.price.amount);
      case "name_asc":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return [...products].sort(
          (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0),
        );
      case "popular":
      default:
        return [...products].sort(
          (a, b) => (b.meta?.purchases || 0) - (a.meta?.purchases || 0),
        );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange([stats.priceRange.min, stats.priceRange.max]);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.delete("sort");
    setSearchParams(params);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <FireIcon className="h-8 w-8 mr-2" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Customer Favorites
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bestsellers</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Our most popular products, loved by customers around the world.
              Shop the best of the best.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {!isLoadingProducts && bestsellers.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <ChartBarIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSold}+
                </p>
                <p className="text-sm text-gray-600">Units Sold</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.topCategory || "Various"}
                </p>
                <p className="text-sm text-gray-600">Top Category</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <svg
                  className="h-8 w-8 text-orange-600 mx-auto mb-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <svg
                  className="h-8 w-8 text-orange-600 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.priceRange.min} - ${stats.priceRange.max}
                </p>
                <p className="text-sm text-gray-600">Price Range</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
            >
              <span>Filters</span>
              {(selectedCategory !== "all" ||
                priceRange[0] > stats.priceRange.min ||
                priceRange[1] < stats.priceRange.max) && (
                <span className="ml-2 bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">
                  Active
                </span>
              )}
            </button>

            {/* Category Filter */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === "all"
                      ? "bg-orange-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => {
                  const count = bestsellers.filter(
                    (p) => p.category === category.slug,
                  ).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCategory === category.slug
                          ? "bg-orange-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <ProductSort />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg md:hidden">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === "all"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => {
                  const count = bestsellers.filter(
                    (p) => p.category === category.slug,
                  ).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={category._id}
                      onClick={() => {
                        handleCategoryChange(category.slug);
                        setShowFilters(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCategory === category.slug
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Price Range Filter for Mobile */}
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), priceRange[1])
                  }
                  min={stats.priceRange.min}
                  max={stats.priceRange.max}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], Number(e.target.value))
                  }
                  min={stats.priceRange.min}
                  max={stats.priceRange.max}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Sort (Desktop) */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{displayedProducts.length}</span> of{" "}
              <span className="font-medium">{filteredProducts.length}</span>{" "}
              bestsellers
            </p>

            {/* Price Range Filter (Desktop) */}
            {bestsellers.length > 0 && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
                <span className="text-sm text-gray-500">Price:</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), priceRange[1])
                  }
                  min={stats.priceRange.min}
                  max={stats.priceRange.max}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], Number(e.target.value))
                  }
                  min={stats.priceRange.min}
                  max={stats.priceRange.max}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            )}

            {(selectedCategory !== "all" ||
              priceRange[0] > stats.priceRange.min ||
              priceRange[1] < stats.priceRange.max) && (
              <button
                onClick={resetFilters}
                className="text-sm text-orange-600 hover:text-orange-800"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <LoadingSpinner />
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <FireIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bestsellers found
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory !== "all"
                ? `We don't have any bestsellers in ${
                    categories.find((c) => c.slug === selectedCategory)?.name ||
                    selectedCategory
                  } yet.`
                : "Check back soon for popular products!"}
            </p>
            <div className="space-x-4">
              {selectedCategory !== "all" && (
                <button
                  onClick={resetFilters}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                >
                  Clear filters
                </button>
              )}
              <Link
                to="/shop"
                className="inline-block border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Browse all products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <div key={product._id} className="relative">
                  {/* Popularity Badge for Top 3 */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-400"
                        }`}
                      >
                        <FireIcon className="w-3 h-3 mr-1" />#{index + 1}{" "}
                        Bestseller
                      </span>
                    </div>
                  )}
                  {/* Sold Count Badge */}
                  {(product.meta?.purchases || 0) > 50 && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.meta?.purchases}+ sold
                      </span>
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                pagination={{ page: currentPage, pages: totalPages }}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
