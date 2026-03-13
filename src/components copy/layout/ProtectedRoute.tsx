import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { EUserRole } from "../../types/user.types";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface ProtectedRouteProps {
  redirectTo?: string;
  requireVerified?: boolean;
  fallback?: React.ReactNode;
  requiredRole?: EUserRole;
}

export function ProtectedRoute({
  redirectTo = "/auth/login",
  requireVerified,
  fallback = <LoadingSpinner page />,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return fallback;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  // Redirect to verification page if email not verified
  if (requireVerified && !user.emailVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  if (requiredRole && !requiredRole.includes(user?.role as string)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes if logged in
  return <Outlet />;
}
