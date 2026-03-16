// src/routes/profile.routes.ts
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Profile } from "../pages/Profile";
import { Dashboard } from "../pages/Dashboard";
import { VerifyEmail } from "../pages/auth/VerifyEmail";

export const profileRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "profile",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
    ],
  },
];
