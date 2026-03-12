import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { EUserRole } from "../../types/user.types";

interface ProtectedRouteProps {
  redirectTo?: string;
  requireVerified?: boolean;
  fallback?: React.ReactNode;
  requiredRole?: EUserRole;
}

export function ProtectedRoute({
  redirectTo = "/auth/login",
  requireVerified,
  fallback = <LoadingSpinner />,
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

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
