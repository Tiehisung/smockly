import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";

import { About } from "../pages/About";
import { NotFound } from "../pages/NotFound";
import { VerifyEmail } from "../pages/auth/VerifyEmail";
import { TestBackend } from "../pages/TestBackend";
import { UsersPage } from "../pages/Users";
import { authRoutes } from "./auth.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "test-backend",
        element: <TestBackend />,
      },
      
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
      {
        path: "users",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <UsersPage />,
          },
        ],
      },
      authRoutes,
    ],
  },
]);
