// // src/pages/Shop.tsx
// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { LoadingSpinner } from "../../components/common/LoadingSpinner";
// import { ProductCard } from "../../components/products/ProductCard";
// import { ProductFilters } from "../../components/products/ProductFilters";
// import { ProductSort } from "../../components/products/ProductSort";
// import { Pagination } from "../../components/ui/Pagination";
// import { allCategories } from "../../data/categories";
// import { allProducts } from "../../data/products";

// export function ShopPage2() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   // Get filter values from URL
//   const page = Number(searchParams.get("page")) || 1;
//   const category = searchParams.get("category") || "";
//   const sortBy = searchParams.get("sort") || "newest";
//   const minPrice = Number(searchParams.get("minPrice")) || 0;
//   const maxPrice = Number(searchParams.get("maxPrice")) || 1000;
//   const selectedSizes = searchParams.getAll("size");
//   const selectedColors = searchParams.getAll("color");
//   const inStockOnly = searchParams.get("inStock") === "true";
//   const onSaleOnly = searchParams.get("onSale") === "true";
//   const searchQuery = searchParams.get("q") || "";

//   // Local state for filtered products
//   const [filteredProducts, setFilteredProducts] = useState(allProducts);
//   const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 12;

//   // Apply all filters whenever filter params change
//   useEffect(() => {
//     setLoading(true);

//     // Start with all products
//     let result = [...allProducts];

//     // Apply search filter
//     if (searchQuery) {
//       result = result.filter(
//         (p) =>
//           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.tags.some((tag) =>
//             tag.toLowerCase().includes(searchQuery.toLowerCase()),
//           ),
//       );
//     }

//     // Apply category filter
//     if (category) {
//       result = result.filter((p) => p.category === category);
//     }

//     // Apply price filter
//     result = result.filter(
//       (p) => p.price.amount >= minPrice && p.price.amount <= maxPrice,
//     );

//     // Apply size filter
//     if (selectedSizes.length > 0) {
//       result = result.filter((p) =>
//         p.attributes.sizes?.some((size) => selectedSizes.includes(size)),
//       );
//     }

//     // Apply color filter
//     if (selectedColors.length > 0) {
//       result = result.filter((p) =>
//         p.attributes.colors?.some((color) =>
//           selectedColors.includes(color.name),
//         ),
//       );
//     }

//     // Apply stock filter
//     if (inStockOnly) {
//       result = result.filter((p) => p.inventory.quantity > 0);
//     }

//     // Apply sale filter
//     if (onSaleOnly) {
//       result = result.filter((p) => p.onSale);
//     }

//     // Apply sorting
//     result = sortProducts(result, sortBy);

//     setFilteredProducts(result);
//     setTotalPages(Math.ceil(result.length / itemsPerPage));
//     setLoading(false);
//   }, [
//     category,
//     minPrice,
//     maxPrice,
//     selectedSizes,
//     selectedColors,
//     inStockOnly,
//     onSaleOnly,
//     searchQuery,
//     sortBy,
//   ]);

//   // Update displayed products based on page
//   useEffect(() => {
//     const start = (page - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     setDisplayedProducts(filteredProducts.slice(start, end));
//   }, [filteredProducts, page]);

//   const sortProducts = (products: any[], sortType: string) => {
//     switch (sortType) {
//       case "price_asc":
//         return [...products].sort((a, b) => a.price.amount - b.price.amount);
//       case "price_desc":
//         return [...products].sort((a, b) => b.price.amount - a.price.amount);
//       case "name_asc":
//         return [...products].sort((a, b) => a.name.localeCompare(b.name));
//       case "name_desc":
//         return [...products].sort((a, b) => b.name.localeCompare(a.name));
//       case "rating":
//         return [...products].sort(
//           (a, b) => b.ratings.average - a.ratings.average,
//         );
//       case "popular":
//         return [...products].sort((a, b) => b.meta.views - a.meta.views);
//       case "newest":
//       default:
//         return [...products].sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//         );
//     }
//   };

//   const clearFilters = () => {
//     setSearchParams({});
//   };

//   const activeFilterCount = [
//     category,
//     ...selectedSizes,
//     ...selectedColors,
//     inStockOnly,
//     onSaleOnly,
//     minPrice > 0,
//     maxPrice < 1000,
//     searchQuery,
//   ].filter(Boolean).length;

//   return (
//     <div className="bg-white">
//       {/* Header */}
//       <div className="bg-gray-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {searchQuery
//               ? `Search Results for "${searchQuery}"`
//               : "Shop All Products"}
//           </h1>
//           <p className="text-gray-600">
//             {filteredProducts.length} products found
//             {category &&
//               ` in ${allCategories.find((c) => c.slug === category)?.name || category}`}
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Mobile filter button */}
//         <div className="flex items-center justify-between mb-4 lg:hidden">
//           <button
//             onClick={() => setMobileFiltersOpen(true)}
//             className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
//           >
//             <span>Filters</span>
//             {activeFilterCount > 0 && (
//               <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
//                 {activeFilterCount}
//               </span>
//             )}
//           </button>

//           <ProductSort />
//         </div>

//         <div className="flex gap-8">
//           {/* Filters Sidebar */}
//           <ProductFilters
//             categories={allCategories}
//             mobileFiltersOpen={mobileFiltersOpen}
//             setMobileFiltersOpen={setMobileFiltersOpen}
//             activeFilterCount={activeFilterCount}
//             onClearFilters={clearFilters}
//           />

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Desktop sort and results count */}
//             <div className="hidden lg:flex justify-between items-center mb-6">
//               <p className="text-sm text-gray-500">
//                 Showing {displayedProducts.length} of {filteredProducts.length}{" "}
//                 products
//               </p>
//               <ProductSort />
//             </div>

//             {/* Products Grid */}
//             {loading ? (
//               <LoadingSpinner />
//             ) : displayedProducts.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
//                   <svg
//                     className="w-12 h-12 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M20 12H4"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-gray-500 mb-6">
//                   Try adjusting your filters or search terms.
//                 </p>
//                 <button
//                   onClick={clearFilters}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {displayedProducts.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <Pagination
                  
//                     pagination={{page,pages:totalPages}}
//                     onPageChange={(newPage) => {
//                       const params = new URLSearchParams(searchParams);
//                       params.set("page", newPage.toString());
//                       setSearchParams(params);
//                     }}
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
