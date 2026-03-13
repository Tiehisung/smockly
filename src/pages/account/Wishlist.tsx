// src/pages/account/Wishlist.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { ProductCard } from "../../components/products/ProductCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

export function AccountWishlist() {
  const {
    wishlist,
    isLoading,
    itemCount,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
  } = useWishlist();

  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item) => item._id));
    }
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleAddSelectedToCart = async () => {
    for (const productId of selectedItems) {
      const product = wishlist.find((p) => p._id === productId);
      if (product) {
        await addToCart({ product, quantity: 1 });
      }
    }
    toast.success(`${selectedItems.length} items added to cart`);
  };

  const handleRemoveSelected = async () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      for (const productId of selectedItems) {
        await removeFromWishlist(productId);
      }
      setSelectedItems([]);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full mb-6">
          <HeartIcon className="w-12 h-12 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Save your favorite items and come back to them later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist ({itemCount})
        </h1>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {wishlist.length > 1 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.length === wishlist.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </label>
            {selectedItems.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedItems.length} item(s) selected
              </span>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleAddSelectedToCart}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center"
              >
                <ShoppingBagIcon className="w-4 h-4 mr-1" />
                Add to Cart
              </button>
              <button
                onClick={handleRemoveSelected}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="relative group">
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedItems.includes(product._id)}
                onChange={() => handleSelectItem(product._id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromWishlist(product._id)}
              className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              title="Remove from wishlist"
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </button>

            {/* Product Card */}
            <ProductCard product={product} />

            {/* Quick Actions */}
            <div className="absolute bottom-20 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity px-4">
              <button
                onClick={() => moveToCart(product._id)}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Wishlist */}
      <div className="mt-12 p-6 bg-linear-to-r from-pink-50 to-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Share Your Wishlist
        </h3>
        <p className="text-gray-600 mb-4">
          Let your friends and family know what you'd love to receive!
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/wishlist/share/${user?.uid}`,
              );
              toast.success("Link copied to clipboard!");
            }}
            className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Copy Link
          </button>
          <button
            onClick={() => {
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/wishlist/share/${user?.uid}`,
              );
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Share on Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
