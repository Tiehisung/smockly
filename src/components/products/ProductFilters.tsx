// src/components/products/ProductFilters.tsx

import { useSearchParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ICategory } from "../../types/category.types";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface ProductFiltersProps {
  categories: ICategory[];
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  isLoading?: boolean;
}

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const colors = [
  { name: "Red", code: "#EF4444" },
  { name: "Blue", code: "#3B82F6" },
  { name: "Green", code: "#10B981" },
  { name: "Yellow", code: "#F59E0B" },
  { name: "Purple", code: "#8B5CF6" },
  { name: "Pink", code: "#EC4899" },
  { name: "Black", code: "#1F2937" },
  { name: "White", code: "#F9FAFB" },
  { name: "Brown", code: "#92400E" },
  { name: "Gold", code: "#FBBF24" },
];

export function ProductFilters({
  categories,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  isLoading,
}: ProductFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedSizes = searchParams.getAll("size");
  const selectedColors = searchParams.getAll("color");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategory === categorySlug) {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams);
    const sizes = params.getAll("size");

    if (sizes.includes(size)) {
      params.delete("size");
      sizes.filter((s) => s !== size).forEach((s) => params.append("size", s));
    } else {
      params.append("size", size);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleColorChange = (color: string) => {
    const params = new URLSearchParams(searchParams);
    const colors = params.getAll("color");

    if (colors.includes(color)) {
      params.delete("color");
      colors
        .filter((c) => c !== color)
        .forEach((c) => params.append("color", c));
    } else {
      params.append("color", color);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams);
    if (min) {
      params.set("minPrice", min);
    } else {
      params.delete("minPrice");
    }
    if (max) {
      params.set("maxPrice", max);
    } else {
      params.delete("maxPrice");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleStockChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSaleChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("onSale", "true");
    } else {
      params.delete("onSale");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    setSearchParams(params);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`block w-full text-left px-2 py-1 rounded ${
                  selectedCategory === category.slug
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handlePriceChange(e.target.value, maxPrice)}
            className="w-24 px-2 py-1 border border-gray-300 rounded"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handlePriceChange(minPrice, e.target.value)}
            className="w-24 px-2 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 border rounded text-sm ${
                selectedSizes.includes(size)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColors.includes(color.name)
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => handleStockChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => handleSaleChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-600">On Sale</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 px-4">
                  <FilterContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <FilterContent />
      </div>
    </>
  );
}
