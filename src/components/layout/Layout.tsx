import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// import { useAppSelector, useAppDispatch } from "../../store/hooks";
// import { toggleSidebar } from "../../store/slices/appSlice";

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  //   const dispatch = useAppDispatch();
  //   const { sidebarOpen } = useAppSelector((state) => state.app);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="text-xl font-bold text-gray-800">
                MyApp
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === "/"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === "/dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === "/about"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Users
                </Link>
                {/* Add this in your navigation links */}
                {/* {user?.role === "admin" && (
                  <Link
                    to="/users"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      location.pathname.startsWith("/users")
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Users
                  </Link>
                )} */}
                <Link
                  to="/about"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === "/about"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  About
                </Link>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Hi, {user.displayName || user.email}
                  </span>
                  <Link
                    to="/profile"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet /> {/* This is where page content will render */}
        {user && (
          <button
            className="text-red-600 my-5 border px-1 cursor-pointer"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </main>
    </div>
  );
}
