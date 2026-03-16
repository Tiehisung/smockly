// src/pages/NewArrivals.tsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "./product/ProductCard";
import { ProductSort } from "./product/ProductSort";
import { Pagination } from "../components/Pagination";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SparklesIcon } from "@heroicons/react/24/outline";
import type { IPagination } from "../types";
import { useGetCategoriesQuery } from "../store/api/categoriesApi";
import { useGetNewArrivalsQuery } from "../store/api/productsApi";

export function NewArrivals() {
  const [searchParams, setSearchParams] = useSearchParams();
 
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery({});

  const { data: newArrivalsData, isLoading: isLoadingProducts } =
    useGetNewArrivalsQuery(50);

  // Pagination state
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "newest";
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

  // Time filter options
  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  // Load new arrivals
  useEffect(() => {
    // Get new arrivals from dummy data
    let products = newArrivalsData?.data || [];

    // Apply time filter
    const now = new Date();
    if (timeFilter !== "all") {
      products = products.filter((p) => {
        const createdDate = new Date(p.createdAt);
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (timeFilter) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setNewArrivals(products);
    setFilteredProducts(products);
  }, [timeFilter, newArrivalsData]);

  // Apply category filter
  useEffect(() => {
    let filtered = [...newArrivals];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, newArrivals]);

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
      case "newest":
      default:
        return [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  if (categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 mr-2" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Fresh from the artisans
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              New Arrivals
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Discover our latest collection of handcrafted smocks and
              accessories. Fresh designs, new styles, and exclusive pieces.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>

                {}
                {categories?.data?.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategory === category.slug
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Added:</span>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-1.5"
              >
                {timeFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Sort */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{displayedProducts.length}</span> of{" "}
              <span className="font-medium">{paginationInfo.total || 0}</span>{" "}
              new arrivals
            </p>
            {timeFilter !== "all" && (
              <p className="text-xs text-gray-400 mt-1">
                Added in{" "}
                {timeFilters.find((f) => f.value === timeFilter)?.label}
              </p>
            )}
          </div>
          <ProductSort />
        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <LoadingSpinner />
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <SparklesIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No new arrivals found
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory !== "all"
                ? `We don't have any new ${categories?.data?.find((c) => c.slug === selectedCategory)?.name} at the moment.`
                : "Check back soon for new products!"}
            </p>
            <div className="space-x-4">
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View all categories
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
              {displayedProducts.map((product) => (
                <div key={product._id} className="relative">
                  {/* New Arrival Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      New
                    </span>
                  </div>
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
