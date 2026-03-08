import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../configs/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setUserProfile,
  setUserLoading,
  setUserError,
} from "../store/slices/userSlice";
import { addNotification } from "../store/slices/appSlice";
import { Check } from "lucide-react";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Get auth context
  const { user, loading: authLoading, } = useAuth();
  console.log(authLoading);

  // Get Redux state and dispatch
  const dispatch = useAppDispatch();
  const { isLoading: reduxLoading, error: reduxError } = useAppSelector(
    (state) => state.user,
  );

  // Combine loading states (either auth is loading or Redux is loading)
  const isLoading = authLoading || reduxLoading;

  // Use error from Redux or local error
  const error = reduxError;

  const handleSignUp = async () => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(""));

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update Redux with user data
      dispatch(
        setUserProfile({
          uid: userCredential.user.uid,
          email: userCredential.user.email || "",
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
        }),
      );

      // Add success notification
      dispatch(
        addNotification({
          message: "Account created successfully! 🎉",
          type: "success",
        }),
      );

      console.log("User created:", userCredential.user);
    } catch (error: any) {
      dispatch(setUserError(error.message));
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  const handleLogin = async () => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(""));

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update Redux with user data
      dispatch(
        setUserProfile({
          uid: userCredential.user.uid,
          email: userCredential.user.email || "",
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
        }),
      );

      // Add success notification
      dispatch(
        addNotification({
          message: "Logged in successfully! 👋",
          type: "success",
        }),
      );

      console.log("User logged in:", userCredential.user);
    } catch (error: any) {
      dispatch(setUserError(error.message));
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setUserLoading(true));
      await auth.signOut();
      // User will be cleared by onAuthStateChanged in AuthContext
      dispatch(
        addNotification({
          message: "Logged out successfully! 👋",
          type: "info",
        }),
      );
    } catch (error: any) {
      dispatch(setUserError(error.message));
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Welcome screen when user is logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully logged in
            </p>

            {/* User Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Email:
                  </span>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    User ID:
                  </span>
                  <p className="text-gray-900 font-medium text-sm break-all">
                    {user.uid}
                  </p>
                </div>
              </div>
            </div>

            {/* Test persistence message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                🔄 Your preferences will persist even after refresh!
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "Please sign in to your account"
              : "Sign up for a new account"}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isLogin ? (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            ) : (
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            )}
          </div>

          {/* Toggle between Login and Signup */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(setUserError("")); // Clear error from Redux
                setEmail(""); // Clear form
                setPassword("");
              }}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Password Hint */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Password must be at least 6 characters
          </p>
        </div>
      </div>
    </div>
  );
}
