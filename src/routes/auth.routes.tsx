import type { RouteObject } from "react-router-dom";
import { PublicRoute } from "../components/layout/PublicRoute";
import { LoginPage } from "../pages/auth/Login";
import { SignupPage } from "../pages/auth/Signup";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

export const authRoutes: RouteObject = {
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
};
