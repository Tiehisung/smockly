// src/components/home/Bestsellers.tsx
import { useGetBestsellersQuery } from "../../store/api/productsApi";
import { ProductCard } from "../../pages/product/ProductCard";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Link } from "react-router-dom";

export function Bestsellers() {
  const { data: productsData, isLoading } = useGetBestsellersQuery(4);

  const products = productsData?.data;

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bestsellers</h2>
          <Link
            to="/shop?sort=bestseller"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
