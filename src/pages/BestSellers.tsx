// src/pages/Bestsellers.tsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/products/ProductCard";
import { ProductSort } from "../components/products/ProductSort";
import { Pagination } from "../components/ui/Pagination";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { FireIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import type { IPagination } from "../types";
import { allCategories } from "../data/categories";
import { getBestsellers } from "../data/shop";
import { useGetBestsellersQuery } from "../store/api/productsApi";
import { CurrencyIcon, StarIcon } from "../assets/svg";
 

export function Bestsellers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "popular";
  const itemsPerPage = 12;

  // Pagination info
  const [paginationInfo, setPaginationInfo] = useState<Partial<IPagination>>({
    page: 1,
    pages: 1,
    total: 0,
    limit: itemsPerPage,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Stats for bestsellers
  const [stats, setStats] = useState({
    totalSold: 0,
    topCategory: "",
    averageRating: 0,
    priceRange: { min: 0, max: 0 },
  });

  const { data: products } = useGetBestsellersQuery(4);

  // Load bestsellers
  useEffect(() => {
    setLoading(true);

    const normalProducts = products || getBestsellers();
    // Calculate stats
    const totalSold = normalProducts.reduce(
      (sum, p) => sum + (p.meta?.purchases || 0),
      0,
    );
    const categoryCounts = normalProducts.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.keys(categoryCounts).sort(
      (a, b) => categoryCounts[b] - categoryCounts[a],
    )[0];

    const avgRating =
      normalProducts?.reduce((sum, p) => sum + p.ratings.average, 0) /
      normalProducts?.length;
    const prices = normalProducts.map((p) => p.price.amount);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setStats({
      totalSold,
      topCategory:
        allCategories.find((c) => c.slug === topCategory)?.name || topCategory,
      averageRating: Number(avgRating.toFixed(1)),
      priceRange: { min: minPrice, max: maxPrice },
    });

    setBestsellers(normalProducts);
    setFilteredProducts(normalProducts);
    setPriceRange([minPrice, maxPrice]);
    setLoading(false);
  }, []);

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
  }, [selectedCategory, sortBy, priceRange, bestsellers]);

  // Update pagination and displayed products
  useEffect(() => {
    const total = filteredProducts.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setPaginationInfo({
      page,
      pages,
      total,
      limit: itemsPerPage,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
    });

    setDisplayedProducts(filteredProducts.slice(start, end));
  }, [filteredProducts, page, itemsPerPage]);

  const sortProducts = (products: any[], sortType: string) => {
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
          (a, b) => b.ratings.average - a.ratings.average,
        );
      case "popular":
      default:
        return [...products].sort(
          (a, b) => (b.meta?.purchases || 0) - (a.meta?.purchases || 0),
        );
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
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
      {!loading && (
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
                  {stats.topCategory}
                </p>
                <p className="text-sm text-gray-600">Top Category</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <StarIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />

                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <CurrencyIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
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
                {allCategories.map((category) => {
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
                {allCategories.map((category) => {
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
              <span className="font-medium">{paginationInfo.total || 0}</span>{" "}
              bestsellers
            </p>

            {/* Price Range Filter (Desktop) */}
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
        {loading ? (
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
                ? `We don't have any bestsellers in ${allCategories.find((c) => c.slug === selectedCategory)?.name} yet.`
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
                  {product.meta?.purchases > 50 && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.meta.purchases}+ sold
                      </span>
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {paginationInfo.pages && paginationInfo.pages > 1 && (
              <Pagination
                onPageChange={handlePageChange}
                pagination={paginationInfo}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
