// src/routes/admin.routes.ts
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { AdminLayout } from "../pages/admin/AdminLayout";
// import { EUserRole } from "../types/user.types";
import { AdminProducts } from "../pages/admin/products/ProductsPage";
import { AdminProductForm } from "../pages/admin/products/ProductForm";
import { AdminDashboard } from "../pages/admin/Dashboard";
import { AdminOrderDetails } from "../pages/admin/orders/AdminOrderDetails";
import { AdminOrders } from "../pages/admin/orders/AdminOrders";
import { AdminCategories } from "../pages/admin/categories/AdminCategories";
import { AdminCategoryForm } from "../pages/admin/categories/AdminCategoryForm";
import UsersPage from "../pages/admin/users/page";
import { EUserRole } from "../types/user.types";
// import { AdminProductForm } from "../pages/admin/AdminProductForm";
// import { AdminOrders } from "../pages/admin/AdminOrders";
// import { AdminOrderDetails } from "../pages/admin/AdminOrderDetails";
// import { AdminCustomers } from "../pages/admin/AdminCustomers";
// import { AdminCategories } from "../pages/admin/AdminCategories";
// import { AdminCoupons } from "../pages/admin/AdminCoupons";
// import { AdminInventory } from "../pages/admin/AdminInventory";
// import { AdminReports } from "../pages/admin/AdminReports";
// import { AdminSettings } from "../pages/admin/AdminSettings";
// import { AdminUsers } from "../pages/admin/AdminUsers";

export const adminRoutes: RouteObject = {
  path: "admin",
  element: <ProtectedRoute requiredRole={EUserRole.ADMIN} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "products",
          children: [
            {
              index: true,
              element: <AdminProducts />,
            },
            {
              path: "new",
              element: <AdminProductForm />,
            },
            {
              path: "edit/:productId",
              element: <AdminProductForm />,
            },
          ],
        },
        {
          path: "orders",
          children: [
            {
              index: true,
              element: <AdminOrders />,
            },
            {
              path: ":orderId",
              element: <AdminOrderDetails />,
            },
          ],
        },

        {
          path: "categories",
          children: [
            {
              index: true,
              element: <AdminCategories />,
            },
            {
              path: "new",
              element: <AdminCategoryForm />,
            },
            {
              path: "edit/:categoryId",
              element: <AdminCategoryForm />,
            },
          ],
        },
        //     {
        //       path: "customers",
        //       element: <AdminCustomers />,
        //     },
        {
          path: "users",
          element: <UsersPage />,
        },
        //     {
        //       path: "coupons",
        //       element: <AdminCoupons />,
        //     },
        //     {
        //       path: "inventory",
        //       element: <AdminInventory />,
        //     },
        //     {
        //       path: "reports",
        //       element: <AdminReports />,
        //     },
        //     {
        //       path: "settings",
        //       element: <AdminSettings />,
        //     },
      ],
    },
  ],
};
