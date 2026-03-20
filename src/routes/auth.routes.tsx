import type { RouteObject } from "react-router-dom";
import { SignInPage } from "../pages/auth/Signin";
import { SignupPage } from "../pages/auth/Signup";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { AuthLayout } from "../pages/auth/AuthLayout";
import { VerifyEmailPage } from "../pages/auth/VerifyEmail";

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      path: "signin",
      element: <SignInPage />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },

    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "verify-email",
      element: <VerifyEmailPage />,
    },
  ],
};
