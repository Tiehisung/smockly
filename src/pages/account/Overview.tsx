// src/pages/account/AccountOverview.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGetUserOrdersQuery } from "../../store/api/ordersApi";
import { useGetWishlistQuery } from "../../store/api/wishlistApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  CreditCardIcon,
  ChevronRightIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { formatAmount } from "../../utils/amount";
import { useGetUserStatsQuery } from "../../store/api/user.api";

export function AccountOverview() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery();

  const { data: recentOrders, isLoading: ordersLoading } =
    useGetUserOrdersQuery({ limit: 3 });
  const { data: wishlist, isLoading: wishlistLoading } = useGetWishlistQuery();

  const isLoading = statsLoading || ordersLoading || wishlistLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const quickActions = [
    {
      title: "Profile Information",
      description: "Update your personal details",
      icon: UserIcon,
      href: "/account/profile",
      color: "blue",
    },
    {
      title: "Order History",
      description: "View your past orders",
      icon: ShoppingBagIcon,
      href: "/account/orders",
      color: "green",
    },
    {
      title: "Wishlist",
      description: `${wishlist?.count || 0} items saved`,
      icon: HeartIcon,
      href: "/account/wishlist",
      color: "red",
    },
    {
      title: "Addresses",
      description: "Manage your shipping addresses",
      icon: MapPinIcon,
      href: "/account/addresses",
      color: "purple",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "shipped":
        return <TruckIcon className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.displayName || user?.email}!
        </h1>
        <p className="text-blue-100">
          Member since{" "}
          {/* {new Date(user?.metadata?.createdAt || "").toLocaleDateString()} */}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {stats?.totalOrders || 0}
            </span>
          </div>
          <p className="text-gray-600">Total Orders</p>
          <Link
            to="/account/orders"
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
          >
            View all <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <HeartIcon className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">
              {wishlist?.count || 0}
            </span>
          </div>
          <p className="text-gray-600">Wishlist Items</p>
          <Link
            to="/account/wishlist"
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
          >
            View wishlist <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <CreditCardIcon className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(stats?.totalSpent || 0)}
            </span>
          </div>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div
                className={`inline-flex p-3 bg-${action.color}-100 rounded-lg mb-4`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders && (recentOrders?.data?.length || 0) > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              to="/account/orders"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              View all <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {recentOrders?.data?.map((order: any) => (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items • {formatAmount(order.total)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
