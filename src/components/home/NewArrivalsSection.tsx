// src/components/home/NewArrivalsSection.tsx
import { Link } from "react-router-dom";
import { ProductCard } from "../../pages/product/ProductCard";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { getNewArrivals } from "../../data/shop";

export function NewArrivalsSection() {
  const newArrivals = getNewArrivals(4);

  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              Fresh Drops
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Be the first to shop our latest collection of handcrafted pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <div key={product._id} className="relative">
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  New
                </span>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/new-arrivals"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All New Arrivals
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
      </div>
    </section>
  );
}
