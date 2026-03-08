import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "firebase/auth";
 

export function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if email is verified every 3 seconds
    const interval = setInterval(async () => {
      if (user && 'reload' in user) {
        await (user as User).reload();
        if (user.emailVerified) {
          navigate("/dashboard");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResendVerification = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      await sendEmailVerification(user as User);
      setMessage("Verification email sent! Check your inbox.");

      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  if (user.emailVerified) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="text-center font-medium text-gray-900">{user.email}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Please check your email and click the verification link to complete
            your registration.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={resendDisabled || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : resendDisabled
                ? `Resend available in ${countdown}s`
                : "Resend verification email"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            I'll verify later
          </button>
        </div>
      </div>
    </div>
  );
}
