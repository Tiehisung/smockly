// src/components/products/ProductCard.tsx
import { Link } from "react-router-dom";
import type { IProduct } from "../../types/product.types";
import { WishlistButton } from "../account/WishlistButton";
import { AddToCartButton } from "../cart/AddToCartBtn";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice.amount - product.price.amount) /
          product.compareAtPrice.amount) *
          100,
      )
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Wishlist Button */}

      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product._id} variant="icon" size="md" />
      </div>

      {/* Sale Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          -{discount}%
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.amount}
            </span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.compareAtPrice.amount}
              </span>
            )}
          </div>
          {product.inventory.quantity <= 5 &&
            product.inventory.quantity > 0 && (
              <span className="text-xs text-orange-600">
                Only {product.inventory.quantity} left!
              </span>
            )}
        </div>

        {/* Add to Cart Button */}
        {/* <button
          onClick={() => addToCart({ productId: product._id, quantity: 1 })}
          disabled={product.inventory.quantity === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.inventory.quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </button> */}
        <AddToCartButton
          product={product as IProduct}
          className="grow w-full"
        />
      </div>
    </div>
  );
}
