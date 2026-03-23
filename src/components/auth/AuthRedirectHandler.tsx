// components/auth/AuthRedirectHandler.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../../services/auth.service";
import { setUser, setLoading } from "../../store/slices/auth.slice";

export const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasHandled = useRef(false);

  useEffect(() => {
    // Only handle redirect once
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleRedirect = async () => {
      console.log("🚀 AuthRedirectHandler: Checking for redirect result...");

      try {
        dispatch(setLoading(true));
        const { user, returnUrl } = await authService.handleRedirectResult();
        console.log("📤 Redirect result:", { user, returnUrl });

        if (user) {
          console.log("✅ User from redirect:", user.email);
          dispatch(setUser(user));
          navigate(returnUrl, { replace: true });
        } else {
          console.log("ℹ️ No redirect user found");
        }
      } catch (error) {
        console.error("❌ Redirect handling failed:", error);
        // Only navigate to signin if we're not already there
        if (window.location.pathname !== "/auth/signin") {
          navigate("/signin?error=redirect_failed", { replace: true });
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    handleRedirect();
  }, [dispatch, navigate]);

  return null;
};
