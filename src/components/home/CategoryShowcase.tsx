// src/components/home/CategoryShowcase.tsx
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { LoadingSpinner } from "../common/LoadingSpinner";

const categoryImages = {
  smocks:
    "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  accessories:
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  bundles:
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  custom:
    "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export function CategoryShowcase() {
  const { data: categories, isLoading } = useGetCategoriesQuery({
    featured: true,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  const displayCategories = categories?.slice(0, 4) || [
    { _id: "1", name: "Smocks", slug: "smocks" },
    { _id: "2", name: "Accessories", slug: "accessories" },
    { _id: "3", name: "Bundles", slug: "bundles" },
    { _id: "4", name: "Custom", slug: "custom" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="group relative h-80 overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={
                  categoryImages[category.slug as keyof typeof categoryImages]
                }
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/90">Shop Now →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
