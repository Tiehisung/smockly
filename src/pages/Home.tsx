import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to MyApp
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        {user
          ? `You're logged in as ${user.email}`
          : "Please login to access your dashboard"}
      </p>
      {!user && (
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
