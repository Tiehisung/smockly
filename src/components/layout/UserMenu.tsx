// src/components/layout/UserMenu.tsx
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../headlessUI/Dropdown";
import { useAppSelector } from "../../store/hooks";
import { authService } from "../../services/auth";

export function UserMenu() {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth/signin")}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <UserIcon className="w-5 h-5" />
        <span>Sign In</span>
      </button>
    );
  }

  const customerMenuItems = [
    {
      label: "My Shop",
      href: "/account",
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      label: "Orders",
      href: "/account/orders",
      icon: <ShoppingBagIcon className="w-4 h-4" />,
    },
    {
      label: "Wishlist",
      href: "/account/wishlist",
      icon: <HeartIcon className="w-4 h-4" />,
    },
    {
      label: "Addresses",
      href: "/account/addresses",
      icon: <MapPinIcon className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/account/settings",
      icon: <Cog6ToothIcon className="w-4 h-4" />,
    },
    {
      label: "Sign Out",
      onClick: () => authService.logout(),
      icon: <ArrowRightOnRectangleIcon className="w-4 h-4" />,
      danger: true,
    },
  ];

  const adminMenuItems = [
    {
      label: "Account",
      href: "/admin",
      icon: <UserIcon className="w-4 h-4" />,
    },

    {
      label: "Settings",
      href: "/account/settings",
      icon: <Cog6ToothIcon className="w-4 h-4" />,
    },
    {
      label: "Sign Out",
      onClick: () => authService.logout(),
      icon: <ArrowRightOnRectangleIcon className="w-4 h-4" />,
      danger: true,
    },
  ];

  const menuItems = user?.role?.includes("admin")
    ? adminMenuItems
    : customerMenuItems;

  return (
    <Dropdown
      trigger={
        <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white uppercase">
            {user.displayName?.[0] || user.email?.[0] || "U"}
          </div>
          <span className="hidden md:block">
            {user.displayName?.split(" ")?.[0] || user.email?.split("@")?.[0]}
          </span>
        </button>
      }
      items={menuItems}
      position="right"
      width="md"
    />
  );
}
