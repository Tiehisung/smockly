// src/components/checkout/OrderReview.tsx
import { Link } from "react-router-dom";
import type { IShippingDetails } from "../../types/shipping.types";
import type { ICart } from "../../types/cart.types";
import {
  Pencil,
  Lock,
  CheckCircle,
  CreditCard,
  Smartphone,
  Landmark,
  Loader2,
} from "lucide-react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { ECurrencySymbols } from "../../utils/currency";
import { formatAmount } from "../../utils/amount";
 

interface OrderReviewProps {
  shippingDetails: IShippingDetails;
  cart: ICart;
  onBack: () => void;
  onPayWithPaystack: () => void;
  isProcessing: boolean;
  onPaymentSuccess?: () => void;
}

export function OrderReview({
  shippingDetails,
  cart,
  onBack,
  onPayWithPaystack,
  isProcessing,
}: OrderReviewProps) {
  const currency =  "GHS";
  const currencySymbol = ECurrencySymbols[currency] || "₵";

  // Payment method icons
  const paymentMethods = [
    { icon: CreditCard, name: "Cards" },
    { icon: Smartphone, name: "Mobile Money" },
    { icon: Landmark, name: "Bank Transfer" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Review Your Order
      </h2>

      {/* Shipping Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">Shipping Address</h3>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {shippingDetails.firstName} {shippingDetails.lastName}
          <br />
          {shippingDetails.address}
          <br />
          {shippingDetails.apartment && `${shippingDetails.apartment}<br />`}
          {shippingDetails.city}, {shippingDetails.state}{" "}
          {shippingDetails.zipCode}
          <br />
          {shippingDetails.country}
          <br />
          {shippingDetails.phone}
          <br />
          {shippingDetails.email}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-3">
          {cart?.items?.map((item) => (
            <div key={item?._id} className="flex items-center space-x-3">
              <img
                src={item?.image}
                alt={item?.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item?.name}
                </p>
                {item?.variant && (
                  <p className="text-xs text-gray-500">
                    {item?.variant.size && `Size: ${item?.variant.size} `}
                    {item?.variant.color && `Color: ${item?.variant.color}`}
                  </p>
                )}
                <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {currencySymbol}
                {(item?.price * item?.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatAmount(cart?.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {!cart?.shipping ? "Free" : formatAmount(cart.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatAmount(cart?.tax)}</span>
          </div>
          {!cart?.discount && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatAmount(cart?.discount)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-blue-600">{formatAmount(cart?.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Payment Section */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
        {/* Paystack Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-green-600">Paystack</span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {paymentMethods.map(({ icon: Icon, name }) => (
            <div key={name} className="text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                <Icon className="h-6 w-6 mx-auto text-green-600" />
              </div>
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mb-6">
          You'll be redirected to Paystack's secure payment page to complete
          your transaction.
        </p>

        {/* Security Badges */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="h-4 w-4 text-green-600 mr-2 shrink-0" />
            <span>256-bit SSL secure encryption</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2 shrink-0" />
            <span>PCI DSS Level 1 compliant</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-2 shrink-0" />
            <span>Buyer protection guaranteed</span>
          </div>
        </div>

        {/* Currency Support */}
        <div className="bg-white/50 rounded-lg p-3 mb-6">
          <p className="text-xs text-center text-gray-500">
            <span className="font-medium">Supported currencies:</span> GHS (₵) •
            NGN (₦) • USD ($) • ZAR (R)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Order
          </button>
          <button
            type="button"
            onClick={onPayWithPaystack}
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay {formatAmount(cart?.total)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terms Agreement */}
      <p className="text-xs text-center text-gray-500">
        By completing your purchase, you agree to our{" "}
        <Link
          to="/terms"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
