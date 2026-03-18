import { Link } from "react-router-dom";

// src/components/home/HeroSection.tsx
export function HeroSection() {
  
  return (
    <div className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Authentic African Smocks
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Handcrafted with love, tradition, and style. Explore our collection
            of premium smocks for every occasion.
          </p>
          <div className="space-x-4 space-y-2">
            <Link
              to="/shop"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
            >
              Shop Now
            </Link>
            <Link
              to="/categories"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 inline-block"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
