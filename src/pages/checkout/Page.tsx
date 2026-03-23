// src/pages/Checkout.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Lock,
  CheckCircle,
  Truck,
  RefreshCw,
  Clock,
} from "lucide-react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useCart } from "../../hooks/useCart";
import { CheckoutSteps } from "../../components/checkout/CheckoutSteps";
import { OrderReview } from "../../components/checkout/OrderReview";
import { CartSummary } from "../../components/checkout/CartSummary";
import type { IShippingDetails } from "../../types/shipping.types";
import type { ICart } from "../../types/cart.types";
import toast from "react-hot-toast";
import { useInitializePaystackPaymentMutation } from "../../store/api/ordersApi";
import { ShippingForm } from "../../components/checkout/ShippinForm";
import { useAuth } from "../../hooks/useAuth";

export type CheckoutStep = "shipping" | "review" | "confirmation";

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();

  const cartData=cart?.data

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingDetails, setShippingDetails] =
    useState<IShippingDetails | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [initializePayment, { isLoading: isProcessing }] =
    useInitializePaystackPaymentMutation();

  // Get total from cart
  const total = cartData?.total || 0;

  // Redirect if cart is empty
  useEffect(() => {
    if (!isProcessing && cartData?.items.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cart, navigate, orderComplete, isProcessing]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isProcessing) {
      navigate("/auth/login", { state: { from: "/checkout" } });
    }
  }, [user, navigate, isProcessing]);

  const handleShippingSubmit = (data: IShippingDetails) => {
    setShippingDetails(data);
    setCurrentStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayWithPaystack = async () => {
    if (!shippingDetails?.email && !user?.email) {
      toast.error("Email address is required for payment");
      return;
    }

    try {
      //  Fixed: Properly format shipping address for metadata
      const response = await initializePayment({
        email: shippingDetails?.email || (user?.email as string),
        amount: total,
        metadata: {
          orderId: `ORD-${Date.now()}`,
          customerId: user?.uid,
          items: cartData?.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }).unwrap();

      // Redirect to Paystack
      window.location.href = response.authorization_url;
    } catch (error: any) {
      console.error("Paystack initialization failed:", error);
      toast.error(error?.data?.message || "Failed to initialize payment");
    }
  };

  const handleBack = () => {
    setCurrentStep("shipping");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Simulate order completion after successful payment
  const handlePaymentSuccess = () => {
    const mockOrderNumber = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setOrderNumber(mockOrderNumber);
    setOrderComplete(true);
    setCurrentStep("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  if (cartData?.items?.length === 0 && !orderComplete) {
    return null; // Will redirect
  }

  if (orderComplete) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Order!
            </h1>

            <p className="text-lg text-gray-600 mb-6">Order #{orderNumber}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <p className="text-gray-700 mb-4">
                We've sent a confirmation email to{" "}
                <span className="font-semibold">{user.email}</span>
              </p>
              <p className="text-gray-700">
                You can track your order status in your account dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/account/orders"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors items-center justify-center"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Checkout Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentStep === "shipping" && (
                <ShippingForm
                  initialData={shippingDetails}
                  onSubmit={handleShippingSubmit}
                  user={user}
                />
              )}

              {currentStep === "review" && (
                <OrderReview
                  shippingDetails={shippingDetails!}
                  cart={cartData as ICart}
                  onBack={handleBack}
                  onPayWithPaystack={handlePayWithPaystack}
                  isProcessing={isProcessing}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span>Secure checkout powered by Paystack</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <CartSummary cart={cartData as ICart} />

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Satisfaction guaranteed</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RefreshCw className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Delivery in 3-5 business days</span>
                </div>
              </div>

              {/* Need Help? */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Need help?</p>
                <Link
                  to="/contact"
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  Contact Support
                  <Lock className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
