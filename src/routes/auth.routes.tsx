import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { AuthLayout } from "../components/layout/AuthLayout";

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
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
};
