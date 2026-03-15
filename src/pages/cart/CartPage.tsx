// src/pages/cartData?.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../hooks/useCart";
import { formatAmount } from "../../utils/amount";

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const cartData = cart?.data;

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      await applyCoupon(couponCode);
      setCouponCode("");
    } catch (error) {
      setCouponError("Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData?.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData?.items.map((item) => item._id) || []);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleRemoveSelected = () => {
    if (window.confirm(`Remove ${selectedItems.length} item(s) from cart?`)) {
      selectedItems.forEach((id) => removeItem(id));
      setSelectedItems([]);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth/login", { state: { from: "/cart" } });
    } else {
      navigate("/checkout");
    }
  };

  if (!cart || cartData?.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Featured Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Smocks", "Accessories", "Bundles", "Custom"].map(
                (category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase()}`}
                    className="group relative h-48 overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white">
                        {category}
                      </h3>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h1>
          <Link
            to="/shop"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Bulk Actions */}
            {(cartData?.items?.length || 0) > 1 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartData?.items.length}
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
                  <button
                    onClick={handleRemoveSelected}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove Selected
                  </button>
                )}
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {cartData?.items.map((item) => (
                <div
                  key={item._id}
                  className="p-6 flex flex-col sm:flex-row gap-6"
                >
                  {/* Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="shrink-0">
                    <Link to={`/product/${item.slug}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.variant.size && (
                              <span>Size: {item.variant.size} </span>
                            )}
                            {item.variant.color && (
                              <span>Color: {item.variant.color}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <label className="text-sm text-gray-500">Qty:</label>
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[...Array(item.maxQuantity)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatAmount(item.price * item.quantity)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatAmount(item.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            {(cartData?.items.length || 0) > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear your cart?",
                      )
                    ) {
                      clearCart();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!cartData?.appliedCoupon}
                  />
                  {cartData?.appliedCoupon ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="mt-1 text-sm text-red-600">{couponError}</p>
                )}
                {cartData?.appliedCoupon && (
                  <p className="mt-2 text-sm text-green-600">
                    Coupon {cartData?.appliedCoupon.code} applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatAmount(cartData?.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {cartData?.shipping === 0
                      ? "Free"
                      : formatAmount(cartData?.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium text-gray-900">
                    {formatAmount(cartData?.tax)}
                  </span>
                </div>
                {(cartData?.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatAmount(cartData?.discount)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-blue-600">
                  {formatAmount(cartData?.total)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Payment Methods */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img src="/visa.svg" alt="Visa" className="h-8" />
                <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
                <img src="/paypal.svg" alt="PayPal" className="h-8" />
                <img src="/apple-pay.svg" alt="Apple Pay" className="h-8" />
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-500" />
                  Secure checkout
                </div>
                <div className="flex items-center">
                  <TruckIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Free shipping on orders over $100
                </div>
                <div className="flex items-center">
                  <ArrowPathIcon className="w-4 h-4 mr-2 text-purple-500" />
                  30-day easy returns
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* You'll need to fetch and display related products here */}
            {/* This can be implemented with useGetRelatedProductsQuery */}
          </div>
        </div>
      </div>
    </div>
  );
}
