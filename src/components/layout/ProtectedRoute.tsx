import { Navigate, Outlet } from "react-router-dom";
import type { EUserRole } from "../../types/user.types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAppSelector } from "../../store/hooks";

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
  // const { user, isLoading } = useAuth();
  const { user, loading } = useAppSelector((s) => s.auth);

  // Show loading while checking auth
  if (loading) {
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
    return <Navigate to="/" replace />;
  }
  // useScrollToTop();

  // Render child routes if logged in
  return <Outlet />;
}
