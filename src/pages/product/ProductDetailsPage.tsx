// src/pages/ProductDetails.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductGallery } from "../../components/products/ProductGallery";
import { ProductTabs } from "../../components/products/ProductTabs";
import { ProductVariants } from "../../components/products/ProductVariants";
import { QuantitySelector } from "../../components/products/QuantitySelector";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useGetProductBySlugQuery } from "../../store/api/productsApi";
import type { IProductVariant } from "../../types/product.types";
import { allProducts } from "../../data/products";
import { StarIcon } from "../../assets/svg";

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const { data: product, isLoading } = useGetProductBySlugQuery(slug!);

  const normalProduct = product || allProducts.find((p) => p.slug == slug);

  useEffect(() => {
    // Reset quantity when product changes
    setQuantity(1);
    setSelectedVariant(null);
  }, [product]);

  if (isLoading) return <LoadingSpinner />;

  if (!normalProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(normalProduct._id);
  const isOutOfStock = normalProduct.inventory.quantity === 0;
  const maxQuantity = Math.min(normalProduct.inventory.quantity, 10);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/category/${normalProduct.category}`}
            className="hover:text-blue-600"
          >
            {normalProduct.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{normalProduct.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <ProductGallery
            images={normalProduct.images}
            name={normalProduct.name}
          />

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex items-center space-x-2 mb-4">
              {normalProduct.bestseller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              {normalProduct.newArrival && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {normalProduct.onSale && (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Sale
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {normalProduct.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(normalProduct.ratings.average)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                 
              </div>
              <span className="text-sm text-gray-500">
                {normalProduct.ratings.count} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${normalProduct.price.amount}
                </span>
                {normalProduct.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${normalProduct.compareAtPrice.amount}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Save $
                      {(
                        normalProduct.compareAtPrice.amount -
                        normalProduct.price.amount
                      ).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mb-6">
              {normalProduct.shortDescription}
            </p>

            {/* Variants */}
            <ProductVariants
              variants={normalProduct.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of Stock</span>
              ) : normalProduct.inventory.quantity <= 5 ? (
                <span className="text-orange-600 font-medium">
                  Only {normalProduct.inventory.quantity} left in stock!
                </span>
              ) : (
                <span className="text-green-600 font-medium">In Stock</span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-8">
              <QuantitySelector
                quantity={quantity}
                maxQuantity={maxQuantity}
                onChange={setQuantity}
              />

              <button
                onClick={() =>
                  addToCart({
                    product: normalProduct,
                    quantity,
                    variant: normalProduct.variants?.find(
                      (v) => v._id === selectedVariant,
                    ) as unknown as IProductVariant,
                  })
                }
                disabled={isOutOfStock}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </button>

              <button
                onClick={() => toggleWishlist(normalProduct._id)}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {inWishlist ? (
                  <HeartIconSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">SKU:</span>
                <span className="text-gray-900">{normalProduct.sku}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Category:</span>
                <Link
                  to={`/category/${normalProduct.category}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {normalProduct.category}
                </Link>
              </div>
              {normalProduct.tags && normalProduct.tags.length > 0 && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-24">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {normalProduct.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/shop?tag=${tag}`}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs (Description, Reviews, Shipping) */}
        <ProductTabs product={normalProduct} />

        {/* Related Products */}
        {normalProduct.relatedProducts &&
          normalProduct.relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* You'll need to fetch related products data */}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
