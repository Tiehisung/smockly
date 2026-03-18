// src/pages/account/OrderDetails.tsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "../../store/api/ordersApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  ChevronLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { formatAmount } from "../../utils/amount";
import toast from "react-hot-toast";

const statusIcons = {
  pending: ClockIcon,
  processing: ClockIcon,
  shipped: TruckIcon,
  delivered: CheckCircleIcon,
  cancelled: XCircleIcon,
  refunded: XCircleIcon,
};

const statusMessages = {
  pending: "Your order has been received and is waiting to be processed.",
  processing: "Your order is being prepared for shipment.",
  shipped: "Your order has been shipped and is on its way!",
  delivered: "Your order has been delivered. Thank you for shopping with us!",
  cancelled: "This order has been cancelled.",
  refunded: "This order has been refunded.",
};

export function AccountOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: order, isLoading } = useGetOrderByIdQuery(orderId!);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The order you're looking for doesn't exist.
        </p>
        <Link
          to="/account/orders"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const StatusIcon =
    statusIcons[order.status as keyof typeof statusIcons] || ClockIcon;

  const handleCancelOrder = async () => {
    try {
      await cancelOrder({ orderId: order?._id }).unwrap();
      toast.success("Order cancelled successfully");
      setShowCancelConfirm(false);
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const canCancel = ["pending", "processing"].includes(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/account/orders")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-500">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {canCancel && !showCancelConfirm && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel Order
          </button>
        )}

        {showCancelConfirm && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Cancel this order?</span>
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Yes"}
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div
        className={`p-6 rounded-lg ${
          order.status === "delivered"
            ? "bg-green-50"
            : order.status === "cancelled"
              ? "bg-red-50"
              : "bg-blue-50"
        }`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-full ${
              order.status === "delivered"
                ? "bg-green-100"
                : order.status === "cancelled"
                  ? "bg-red-100"
                  : "bg-blue-100"
            }`}
          >
            <StatusIcon
              className={`w-6 h-6 ${
                order.status === "delivered"
                  ? "text-green-600"
                  : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold mb-1 ${
                order.status === "delivered"
                  ? "text-green-800"
                  : order.status === "cancelled"
                    ? "text-red-800"
                    : "text-blue-800"
              }`}
            >
              Order {order.status}
            </h3>
            <p
              className={`text-sm ${
                order.status === "delivered"
                  ? "text-green-600"
                  : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            >
              {statusMessages[order.status as keyof typeof statusMessages]}
            </p>
          </div>
          {order.trackingNumber && (
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
              <p className="font-mono text-sm">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-4 py-4 border-b last:border-0"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {item.name}
                </Link>
                {item.variant && (
                  <p className="text-sm text-gray-500">
                    {item.variant.size && `Size: ${item.variant.size}`}
                    {item.variant.color && `Color: ${item.variant.color}`}
                  </p>
                )}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatAmount(item.price)}
                </p>
                <p className="text-sm text-gray-500">each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">
              {formatAmount(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {order.shippingCost === 0
                ? "Free"
                : formatAmount(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatAmount(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatAmount(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-2 border-t mt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">{formatAmount(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              {order.shipping?.firstName} {order.shipping?.lastName}
            </p>
            <p>{order.shipping?.address}</p>
            {order.shipping?.address && <p>{order.shipping.address}</p>}
            <p>
              {order.shipping?.city}, {order.shipping?.state}{" "}
              {order.shipping?.zipCode}
            </p>
            <p>{order.shipping?.country}</p>
            <p className="mt-2">{order.shipping?.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCardIcon className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Payment Information</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-gray-900 capitalize">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            {order.paymentReference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono text-xs">
                  {order.paymentReference}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      {/* {order.timeline && order.timeline.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Order Timeline</h2>
          </div>
          <div className="space-y-4">
            {order.timeline.map((event: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    event.status === order.status
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {event.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(event.timestamp), "MMM d, yyyy h:mm a")}
                  </p>
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
