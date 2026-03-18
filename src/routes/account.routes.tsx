// src/routes/account.routes.ts
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { AccountLayout } from "../pages/account/Layout";
import { Wishlist } from "../pages/account/Wishlist";
import { AccountOverview } from "../pages/account/Overview";
import { CustomerProfile } from "../pages/account/Profile";
import { AccountAddresses } from "../pages/account/Addresses";
import { AccountOrderDetails } from "../pages/account/OrderDetails";
import { AccountOrders } from "../pages/account/Orders";
// import { AccountOverview } from "../pages/account/AccountOverview";
// import { AccountOrders } from "../pages/account/AccountOrders";
// import { AccountOrderDetails } from "../pages/account/AccountOrderDetails";
// import { AccountAddresses } from "../pages/account/AccountAddresses";
// import { AccountWishlist } from "../pages/account/AccountWishlist";
// import { AccountSettings } from "../pages/account/AccountSettings";

export const accountRoutes: RouteObject = {
  path: "account",
  element: <ProtectedRoute requireVerified={true} />,
  children: [
    {
      element: <AccountLayout />,
      children: [
        {
          index: true,
          element: <AccountOverview />,
        },
        {
          path: "orders",
          element: <AccountOrders />,
        },
        {
          path: "orders/:orderId",
          element: <AccountOrderDetails />,
        },
        {
          path: "addresses",
          element: <AccountAddresses />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "profile",
          element: <CustomerProfile />,
        },
      ],
    },
  ],
};
