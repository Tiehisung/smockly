// src/components/home/FeaturedProducts.tsx
import { useGetFeaturedProductsQuery } from "../../store/api/productsApi";
import { ProductCard } from "../../pages/product/ProductCard";
import { LoadingSpinner } from "../common/LoadingSpinner";

export function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProductsQuery(8);

  const featProducts = products?.data?.slice(0, 4);

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
