import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render child routes if logged in
  return <Outlet />;
}
