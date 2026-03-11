// src/routes/index.ts
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { RootLayout } from "../components/layout/Layout";
import { NotFound } from "../pages/NotFound";

// Import route groups
import { authRoutes } from "./auth.routes";
import { publicRoutes } from "./public.routes";
import { shopRoutes } from "./shop.routes";
import { checkoutRoutes, orderRoutes } from "./checkout.routes";
import { accountRoutes } from "./account.routes";
import { profileRoutes } from "./profile.routes";
import { adminRoutes } from "./admin.routes";

// Combine all routes into a single array
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      ...publicRoutes,
      ...shopRoutes,
      checkoutRoutes,
      orderRoutes,
      accountRoutes,
      ...profileRoutes,
    ],
  },
  authRoutes,
  adminRoutes,
];

// Create the router
export const router = createBrowserRouter(routes);