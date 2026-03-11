import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { GitHubIcon, GoogleIcon } from "../../assets/svg";
import TextDivider from "../Divider";
import type { IAuthUser } from "../../types/auth.types";
 

interface SocialLoginProps {
  onSuccess?: (user?: IAuthUser | null) => void;
  onError?: (error: string) => void;
}

export function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");
      const user = await authService.signInWithGoogle();

      authService.saveUserToDatabase(user as IAuthUser);
      authService.updateUserLastLogin(user?.uid as string);

      onSuccess?.(user); //optional
      navigate("/dashboard");
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading("github");
      const user = await authService.signInWithGithub();

      authService.saveUserToDatabase(user as IAuthUser);
      authService.updateUserLastLogin(user?.uid as string);

      onSuccess?.(user); //optional
      navigate("/dashboard");
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <TextDivider
        content={
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        }
        borderClassName="border-gray-400"
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!!loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading === "google" ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
          ) : (
            <>
              <GoogleIcon />
              Google
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={!!loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading === "github" ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
          ) : (
            <>
              <GitHubIcon />
              GitHub
            </>
          )}
        </button>
      </div>
    </div>
  );
}
