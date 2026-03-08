import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { PublicRoute } from "../components/layout/PublicRoute";
import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";

import { About } from "../pages/About";
import { NotFound } from "../pages/NotFound";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { VerifyEmail } from "../pages/auth/VerifyEmail";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

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
        path: "auth",
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignupPage />,
          },
          
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
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
    ],
  },
]);
