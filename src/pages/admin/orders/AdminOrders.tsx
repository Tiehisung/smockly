// src/pages/admin/AdminOrders.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { formatDistanceToNow, format } from "date-fns";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Pagination } from "../../../components/Pagination";
import {
  useGetAdminOrdersQuery,
  useGetOrderStatsQuery,
  useExportOrdersMutation,
} from "../../../store/api/orders.adminApi";
import { useUpdateOrderStatusMutation } from "../../../store/api/ordersApi";
import { EOrderStatus, EPaymentStatus } from "../../../types/order.types";
import { formatAmount } from "../../../utils/amount";
import { SELECT } from "../../../components/input/Select";
import { enumToOptions } from "../../../lib/select";
import { ETime } from "../../../data/enum";

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

const paymentStatusColors = {
  [EPaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [EPaymentStatus.PROCESSING]: "bg-blue-100 text-blue-800",
  [EPaymentStatus.PAID]: "bg-green-100 text-green-800",
  [EPaymentStatus.FAILED]: "bg-red-100 text-red-800",
  [EPaymentStatus.REFUNDED]: "bg-gray-100 text-gray-800",
  [EPaymentStatus.PARTIALLY_REFUNDED]: "bg-orange-100 text-orange-800",
};

export function AdminOrders() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EOrderStatus | "">("");
  const [paymentFilter, setPaymentFilter] = useState<EPaymentStatus | "">("");
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    page,
    limit: 15,
    search: search || undefined,
    status: statusFilter || undefined,
    paymentStatus: paymentFilter || undefined,
    sortBy,
    order: sortOrder,
  });

  const { data: stats } = useGetOrderStatsQuery({ period: "month" });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [exportOrders] = useExportOrdersMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: EOrderStatus,
  ) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const blob = await exportOrders({
        format,
        filters: {
          status: statusFilter || undefined,
          paymentStatus: paymentFilter || undefined,
          search: search || undefined,
        },
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-export-${format}.${format === "csv" ? "csv" : "xlsx"}`;
      a.click();

      toast.success("Orders exported successfully");
    } catch (error) {
      toast.error("Failed to export orders");
    }
  };

  if (isLoading) return <LoadingSpinner page />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards - You'll need to implement getOrderStats to match your types */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.processingOrders}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.deliveredOrders}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order #, customer email, or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SELECT
                onChange={(e) =>
                  setStatusFilter(e.target.value as EOrderStatus)
                }
                options={enumToOptions(EOrderStatus)}
                placeholder="All Statuses"
                value={statusFilter}
              />

              <SELECT
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as EPaymentStatus)
                }
                options={enumToOptions(EPaymentStatus)}
                placeholder="All Payments"
              />

              <SELECT
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as ETime)}
                options={enumToOptions(ETime)}
                placeholder="All Time"
              />

              <div className="flex space-x-2">
                <SELECT
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ETime)}
                  options={[
                    { label: "Order Date", value: "createdAt" },
                    { label: "Total", value: "financials.total" },
                    { label: "Status", value: "status" },
                  ]}
                />

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.length} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer?.name ||
                        `${order.shipping?.firstName} ${order.shipping?.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customer?.email || order.shipping?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(
                        order.financials?.total?.amount || 0,
                        order.financials?.total?.currency,
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order._id,
                          e.target.value as EOrderStatus,
                        )
                      }
                      className={`text-xs font-medium rounded-full px-2 py-1 ${statusColors[order.status as EOrderStatus]}`}
                    >
                      {Object.values(EOrderStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        paymentStatusColors[
                          order.paymentStatus as EPaymentStatus
                        ]
                      }`}
                    >
                      {order.paymentStatus?.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
