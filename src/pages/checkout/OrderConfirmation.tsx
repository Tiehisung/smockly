// src/pages/OrderConfirmation.tsx
import { useLocation, Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";

export function OrderConfirmation() {
  const location = useLocation();
  const { user } = useAuth();
  const { reference, orderId } = location.state || {};

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Order #{orderId || reference?.slice(-8)}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <p className="text-gray-700 mb-4">
              We've sent a confirmation email to{" "}
              <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-gray-700">
              You can track your order status in your account dashboard.
            </p>
            {reference && (
              <p className="text-sm text-gray-500 mt-4">
                Transaction reference:{" "}
                <span className="font-mono">{reference}</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Link
              to="/account/orders"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Order Status
            </Link>
            <Link
              to="/shop"
              className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
