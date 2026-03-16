// src/pages/account/Orders.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserOrdersQuery } from "../../store/api/ordersApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  ShoppingBagIcon,
  ChevronRightIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { formatAmount } from "../../utils/amount";
import { Pagination } from "../../components/Pagination";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  pending: ClockIcon,
  processing: ClockIcon,
  shipped: TruckIcon,
  delivered: CheckCircleIcon,
  cancelled: XCircleIcon,
  refunded: XCircleIcon,
};

export function Orders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data:userOrdersData, isLoading } = useGetUserOrdersQuery({
    page,
    limit: 10,
    status: statusFilter || undefined,
    search: search  
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <span className="text-sm text-gray-500">
          {userOrdersData?.pagination?.total || 0} total orders
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {userOrdersData?.data && userOrdersData?.data?.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {userOrdersData?.data?.map((order: any) => {
            const StatusIcon =
              statusIcons[order.status as keyof typeof statusIcons] ||
              ClockIcon;

            return (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        order.status === "delivered"
                          ? "bg-green-100"
                          : order.status === "cancelled"
                            ? "bg-red-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <StatusIcon
                        className={`w-6 h-6 ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "cancelled"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"} •{" "}
                        {formatAmount(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center space-x-3 ml-14 md:ml-0">
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Product Preview */}
                <div className="mt-4 flex items-center space-x-2 ml-14">
                  {order.items.slice(0, 3).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 mb-6">
            {search || statusFilter
              ? "Try adjusting your filters"
              : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Pagination */}
      {userOrdersData?.pagination && userOrdersData.pagination.pages > 1 && (
        <Pagination
          pagination={userOrdersData.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
