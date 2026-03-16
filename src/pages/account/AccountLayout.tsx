// src/pages/account/AccountLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function AccountLayout() {
  const { user } = useAuth();

  const navigation = [
    { name: "Overview", to: "/account", end: true },
    { name: "Orders", to: "/account/orders" },
    { name: "Addresses", to: "/account/addresses" },
    { name: "Wishlist", to: "/account/wishlist" },
    { name: "Settings", to: "/account/settings" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.displayName || user?.email}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 shrink-0">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
