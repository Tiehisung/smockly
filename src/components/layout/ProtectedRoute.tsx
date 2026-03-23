import { Navigate, Outlet } from "react-router-dom";
import type { EUserRole } from "../../types/user.types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  redirectTo?: string;
  requireVerified?: boolean;
  fallback?: React.ReactNode;
  requiredRole?: EUserRole;
}

export function ProtectedRoute({
  redirectTo = "/auth/signin",
  requireVerified,
  fallback = <LoadingSpinner page />,
  requiredRole,
}: ProtectedRouteProps) {
 
   const { user, isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return fallback;
  }

  // Redirect if not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }
  // Redirect to verification page if email not verified
  if (requireVerified && !user.emailVerified) {
    return (
      <Navigate
        to="/auth/verify-email"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (requiredRole && !requiredRole.includes(user?.role as string)) {
    return <Navigate to="/" replace />;
  }
  // useScrollToTop();

  // Render child routes if logged in
  return <Outlet />;
}
