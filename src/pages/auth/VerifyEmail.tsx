// pages/VerifyEmailPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export function VerifyEmailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no user or already verified
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.emailVerified) {
      navigate("/account");
    }
  }, [user, navigate]);

  // Send verification email on mount
  useEffect(() => {
    sendVerificationEmail();
  }, []);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0 && emailSent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, emailSent]);

  // Auto-check verification every 3 seconds
  useEffect(() => {
    if (!user || user.emailVerified) return;

    const interval = setInterval(async () => {
      try {
        const isVerified = await authService.isEmailVerified();
        if (isVerified) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.sendVerificationEmail();
      setEmailSent(true);
      setCountdown(60);
    } catch (error: any) {
      setError(error.message || "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0 || loading) return;
    await sendVerificationEmail();
  };

  const handleCheckVerification = async () => {
    try {
      setCheckingVerification(true);
      const isVerified = await authService.isEmailVerified();
      if (isVerified) {
        navigate("/");
      } else {
        setError("Email not verified yet. Please check your inbox.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const refreshedUser = await authService.reloadUser();
      if (refreshedUser?.emailVerified) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="mt-1 text-center text-md font-medium text-indigo-600">
            {user.email}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center space-y-4">
            {emailSent ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-600">
                  ✓ Verification email sent! Please check your inbox and click
                  the verification link.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-600">
                  Sending verification email...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCheckVerification}
                disabled={checkingVerification}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {checkingVerification
                  ? "Checking..."
                  : "I've verified my email"}
              </button>

              <button
                onClick={handleResendEmail}
                disabled={loading || countdown > 0}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading
                  ? "Sending..."
                  : countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend verification email"}
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Refresh status
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Didn't receive the email?</p>
              <p className="text-xs mt-1">
                • Check your spam folder
                <br />• Make sure {user.email} is correct
                <br />• Wait a few minutes and try again
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => authService.logout()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out and use a different account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
