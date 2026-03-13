// src/pages/admin/AdminLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  TagIcon,
  TicketIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", to: "/admin", icon: HomeIcon, end: true },
  { name: "Products", to: "/admin/products", icon: CubeIcon },
  { name: "Orders", to: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Customers", to: "/admin/customers", icon: UsersIcon },
  { name: "Categories", to: "/admin/categories", icon: TagIcon },
  { name: "Coupons", to: "/admin/coupons", icon: TicketIcon },
  { name: "Reports", to: "/admin/reports", icon: ChartBarIcon },
  { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? "visible" : "invisible"}`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600/75 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`relative flex w-64 max-w-xs flex-1 transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex flex-1 flex-col bg-white pt-5">
            <div className="flex shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col bg-white">
          <div className="flex h-16 shrink-0 items-center px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon
                  className="mr-3 h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
