// components/SocialSignInButtons.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FacebookIcon, GoogleIcon } from "../../assets/svg";

interface SocialSignInButtonsProps {
  onError?: (error: Error) => void;
}

export const SocialSignInButtons: React.FC<SocialSignInButtonsProps> = ({
  onError,
}) => {
  const { signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "facebook" | null
  >(null);

  const handleGoogleSignIn = async () => {
    if (loading || loadingProvider) return;
    setLoadingProvider("google");
    try {
      await signInWithGoogle();
    } catch (error: any) {

      console.log(error)
      onError?.(error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleFacebookSignIn = async () => {
    if (loading || loadingProvider) return;
    setLoadingProvider("facebook");
    try {
      await signInWithFacebook();
    } catch (error: any) {
      onError?.(error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading || loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {loadingProvider === "google"
          ? "Signing in..."
          : "Continue with Google"}
      </button>

      <button
        onClick={handleFacebookSignIn}
        disabled={loading || loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1877f2] hover:bg-[#0c63d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FacebookIcon />
        {loadingProvider === "facebook"
          ? "Signing in..."
          : "Continue with Facebook"}
      </button>
    </div>
  );
};
