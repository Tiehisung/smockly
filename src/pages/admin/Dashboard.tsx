// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetLowStockProductsQuery,
} from "../../store/api/adminApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

import { formatDistanceToNow } from "date-fns";
import { formatAmount } from "../../utils/amount";

export function AdminDashboard() {
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "year"
  >("month");

  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery({
    period: dateRange,
  });
  const { data: recentOrders, isLoading: ordersLoading } =
    useGetRecentOrdersQuery({ limit: 5 });
  const { data: lowStockProducts, isLoading: lowStockLoading } =
    useGetLowStockProductsQuery({ threshold: 10 });

  const isLoading = statsLoading || ordersLoading || lowStockLoading;

  if (isLoading) {
    return <LoadingSpinner page />;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatAmount(stats?.revenue?.total || 0)}
          icon={DollarSign}
          trend={stats?.revenue?.growth}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={ShoppingBag}
          trend={stats?.orders?.growth}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats?.products?.total || 0}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Total Customers"
          value={stats?.customers?.total || 0}
          icon={Users}
          trend={stats?.customers?.growth}
          color="orange"
        />
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats?.orders?.today || 0}</p>
          <p className="text-sm opacity-90">Orders today</p>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-sm opacity-90">
              Revenue: {formatAmount(stats?.revenue?.today || 0)}
            </p>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">New</span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats?.customers?.new || 0}
          </p>
          <p className="text-sm opacity-90">New customers</p>
          <div className="mt-4 pt-4 border-t border-green-400">
            <p className="text-sm opacity-90">
              Active: {stats?.customers?.active || 0}
            </p>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Stock</span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats?.products?.lowStock || 0}
          </p>
          <p className="text-sm opacity-90">Low stock items</p>
          <div className="mt-4 pt-4 border-t border-purple-400">
            <p className="text-sm opacity-90">
              Out of stock: {stats?.products?.outOfStock || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders?.data?.map((order: any) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.name ||
                          `${order.shipping?.firstName} ${order.shipping?.lastName}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatAmount(order.total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment?.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.payment?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.payment?.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alert
              </h2>
              <Link
                to="/admin/inventory"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Manage
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {lowStockProducts?.data?.map((product: any) => (
              <div key={product._id} className="p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]?.url || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        product.inventory.quantity === 0
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {product.inventory.quantity} left
                    </p>
                    <p className="text-xs text-gray-500">
                      Threshold: {product.inventory.lowStockThreshold}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/products/new"
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center space-x-3"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Add Product</p>
            <p className="text-sm text-gray-500">Create new product</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center space-x-3"
        >
          <div className="p-2 bg-green-100 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">View Orders</p>
            <p className="text-sm text-gray-500">Manage orders</p>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center space-x-3"
        >
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Categories</p>
            <p className="text-sm text-gray-500">Manage categories</p>
          </div>
        </Link>

        <Link
          to="/admin/customers"
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center space-x-3"
        >
          <div className="p-2 bg-orange-100 rounded-lg">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Customers</p>
            <p className="text-sm text-gray-500">View customers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
