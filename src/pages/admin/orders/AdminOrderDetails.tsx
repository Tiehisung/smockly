// src/pages/admin/AdminOrderDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  History,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetAdminOrderByIdQuery,
  useAddOrderNoteMutation,
} from "../../../store/api/orders.adminApi";
import {
  useUpdateOrderStatusMutation,
  useAddTrackingNumberMutation,
} from "../../../store/api/ordersApi";
import { EOrderStatus, EPaymentStatus } from "../../../types/order.types";
import { formatIPrice } from "../../../utils/amount";

const statusColors = {
  [EOrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [EOrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
  [EOrderStatus.CONFIRMED]: "bg-indigo-100 text-indigo-800",
  [EOrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
  [EOrderStatus.OUT_FOR_DELIVERY]: "bg-orange-100 text-orange-800",
  [EOrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [EOrderStatus.CANCELLED]: "bg-red-100 text-red-800",
  [EOrderStatus.REFUNDED]: "bg-gray-100 text-gray-800",
  [EOrderStatus.FAILED]: "bg-red-100 text-red-800",
};

export function AdminOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [note, setNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  const { data: order, isLoading } = useGetAdminOrderByIdQuery(orderId!);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [addTracking] = useAddTrackingNumberMutation();
  const [addNote] = useAddOrderNoteMutation();

  if (isLoading) return <LoadingSpinner page />;
  if (!order) return <div>Order not found</div>;

  const handleStatusUpdate = async (newStatus: EOrderStatus) => {
    try {
      await updateStatus({ orderId: orderId!, status: newStatus }).unwrap();
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAddTracking = async () => {
    if (!trackingNumber || !carrier) {
      toast.error("Please enter tracking number and carrier");
      return;
    }
    try {
      await addTracking({
        orderId: orderId!,
        trackingNumber,
        carrier,
      }).unwrap();
      toast.success("Tracking information added");
      setShowTrackingForm(false);
      setTrackingNumber("");
      setCarrier("");
      setTrackingUrl("");
    } catch (error) {
      toast.error("Failed to add tracking");
    }
  };

  const handleAddNote = async () => {
    if (!note) return;
    try {
      await addNote({ orderId: orderId!, note }).unwrap();
      toast.success("Note added");
      setShowNoteForm(false);
      setNote("");
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  // Get the full name from shipping or customer
  const customerName =
    order.customer?.name ||
    `${order.shipping?.firstName || ""} ${order.shipping?.lastName || ""}`.trim() ||
    "N/A";

  const customerEmail = order.customer?.email || order.shipping?.email || "N/A";
  const customerPhone = order.customer?.phone || order.shipping?.phone || "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
          >
            {order.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
        <select
          value={order.status}
          onChange={(e) => handleStatusUpdate(e.target.value as EOrderStatus)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(EOrderStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium text-gray-900">
                {formatIPrice(order.financials?.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium text-gray-900 capitalize">
                {order.paymentStatus?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Items</p>
              <p className="font-medium text-gray-900">
                {order.items.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{customerName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a
                    href={`mailto:${customerEmail}`}
                    className="hover:text-blue-600"
                  >
                    {customerEmail}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a
                    href={`tel:${customerPhone}`}
                    className="hover:text-blue-600"
                  >
                    {customerPhone}
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <div>
                    <p>{order.shipping?.address?.addressLine1}</p>
                    {order.shipping?.address?.addressLine2 && (
                      <p>{order.shipping.address.addressLine2}</p>
                    )}
                    <p>
                      {order.shipping?.address?.city},{" "}
                      {order.shipping?.address?.state}{" "}
                      {order.shipping?.address?.postalCode}
                    </p>
                    <p>{order.shipping?.address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 py-2 border-b last:border-0"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {Object.entries(item.variant.options || {}).map(
                          ([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ),
                        )}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatIPrice(item.total)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatIPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatIPrice(order.financials?.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {formatIPrice(order.financials?.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  {formatIPrice(order.financials?.tax)}
                </span>
              </div>
              {order.financials?.discount?.amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatIPrice(order.financials.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">
                  {formatIPrice(order.financials?.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Order History */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Order History
              </h2>
              <div className="space-y-3">
                {order.history.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full ${
                        entry.status === order.status
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {entry.status.replace("_", " ").toUpperCase()}
                      </p>
                      {entry.note && (
                        <p className="text-gray-600">{entry.note}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        by {entry.changedBy} •{" "}
                        {format(
                          new Date(entry.timestamp),
                          "MMM d, yyyy h:mm a",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-mono text-sm">
                  {order.paymentReference || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="capitalize">
                  {order.paymentMethod?.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === EPaymentStatus.PAID
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === EPaymentStatus.PENDING
                        ? "bg-yellow-100 text-yellow-800"
                        : order.paymentStatus === EPaymentStatus.PROCESSING
                          ? "bg-blue-100 text-blue-800"
                          : order.paymentStatus === EPaymentStatus.REFUNDED
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus?.replace("_", " ").toUpperCase()}
                </span>
              </div>
              {order.paymentDetails?.paidAt && (
                <div>
                  <p className="text-sm text-gray-500">Paid At</p>
                  <p className="text-sm">
                    {format(
                      new Date(order.paymentDetails.paidAt),
                      "MMM d, yyyy h:mm a",
                    )}
                  </p>
                </div>
              )}
              {order.paymentDetails?.transactionId && (
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-xs font-mono">
                    {order.paymentDetails.transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span>Shipping</span>
              {!order.tracking && (
                <button
                  onClick={() => setShowTrackingForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Add Tracking
                </button>
              )}
            </h2>

            {order.tracking ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="text-sm font-medium">
                    {order.tracking.carrier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="text-sm font-mono">{order.tracking.number}</p>
                </div>
                {order.tracking.url && (
                  <a
                    href={order.tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    Track Package
                  </a>
                )}
                {order.tracking.events && order.tracking.events.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Tracking Events</p>
                    <div className="space-y-2">
                      {order.tracking.events.slice(0, 3).map((event, idx) => (
                        <div key={idx} className="text-xs">
                          <p className="font-medium">{event.status}</p>
                          <p className="text-gray-500">{event.location}</p>
                          <p className="text-gray-400">
                            {format(new Date(event.timestamp), "MMM d, h:mm a")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : showTrackingForm ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="Carrier (e.g., UPS, FedEx)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="Tracking URL (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddTracking}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowTrackingForm(false)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tracking information</p>
            )}

            {/* Shipping Method */}
            {order.shipping?.method && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Shipping Method</p>
                <p className="text-sm font-medium">
                  {order.shipping.method.name}
                </p>
                <p className="text-xs text-gray-500">
                  Estimated delivery: {order.shipping.method.estimatedDays[0]}-
                  {order.shipping.method.estimatedDays[1]} days
                </p>
                <p className="text-xs text-gray-500">
                  Cost: {formatIPrice(order.shipping.method.cost)}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span>Notes</span>
              <button
                onClick={() => setShowNoteForm(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Add Note
              </button>
            </h2>

            {showNoteForm ? (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNoteForm(false)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : order.notes ? (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {order.notes}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No notes</p>
            )}
          </div>

          {/* Tags */}
          {order.tags && order.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {order.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
