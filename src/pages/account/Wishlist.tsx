// src/pages/account/WishlistwishlistData?.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";

import { LoadingSpinner } from "../../components/common/LoadingSpinner";

import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ShareIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Drawer } from "../../components/headlessUI/Drawer";
import { ProductCard } from "../product/ProductCard";
import { Facebook, Twitter } from "lucide-react";

export function Wishlist() {
  const {
    wishlist,
    isLoading,
    itemCount,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
  } = useWishlist();

  const wishlistData = wishlist?.data || [];

  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Handle select all items
  const handleSelectAll = () => {
    if (selectedItems.length === wishlistData?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistData?.map((item) => item._id));
    }
  };

  // Handle select single item
  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // Handle add selected to cart
  const handleAddSelectedToCart = async () => {
    for (const productId of selectedItems) {
      const product = wishlistData?.find((p) => p._id === productId);
      if (product) {
        await addToCart({ productId, quantity: 1 });
      }
    }
    toast.success(`${selectedItems.length} items added to cart`);
    setSelectedItems([]);
  };

  // Handle remove selected
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    for (const productId of selectedItems) {
      await removeFromWishlist(productId);
    }
    toast.success(`${selectedItems.length} items removed from wishlist`);
    setSelectedItems([]);
  };

  // Handle move to cart
  const handleMoveToCart = async (productId: string) => {
    await moveToCart(productId);
  };

  // Handle share wishlist
  const handleShare = () => {
    setShareDrawerOpen(true);
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/wishlist/share/${"user-id"}`; // Replace with actual user ID
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
    setShareDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/account"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <ShareIcon className="w-4 h-4" /> Share
              </Button>
              {wishlistData?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" /> Clear All
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-500 mt-2">
            {itemCount} {itemCount === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* Bulk Actions */}
        {wishlistData?.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === wishlistData?.length}
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
                <Button size="sm" onClick={handleAddSelectedToCart}>
                  <ShoppingBagIcon className="w-4 h-4" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveSelected}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" /> Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlistData?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-6">
              <HeartIcon className="w-10 h-10 text-pink-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Save your favorite items and come back to them later. Start
              exploring our collection!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistData?.map((product) => (
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

                {/* Product Card */}
                <ProductCard product={product} />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMoveToCart(product._id)}
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <ShoppingBagIcon className="w-4 h-4" /> Move to Cart
                    </Button>
                    {deleteConfirm === product._id ? (
                      <div className="flex items-center space-x-1 bg-white rounded-lg p-1">
                        <button
                          onClick={() => {
                            removeFromWishlist(product._id);
                            setDeleteConfirm(null);
                          }}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDeleteConfirm(product._id)}
                        className="bg-white text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Drawer */}
      <Drawer
        isOpen={shareDrawerOpen}
        onClose={() => setShareDrawerOpen(false)}
        title="Share Wishlist"
        size="sm"
        position="right"
      >
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            Share your wishlist with friends and family so they know what you'd
            love to receive!
          </p>

          <div className="space-y-4 grid">
            <Button onClick={copyShareLink}>
              <ShareIcon className="w-5 h-5" /> Copy Link
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/wishlist/share/user-id`,
                );
                setShareDrawerOpen(false);
              }}
            >
              <Facebook />
              Share on Facebook
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=Check%20out%20my%20wishlist!&url=${window.location.origin}/wishlist/share/user-id`,
                );
                setShareDrawerOpen(false);
              }}
            >
              <Twitter /> Share on Twitter
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
