// components/AuthDebug.tsx
import { useAppSelector } from "../store/hooks";

export const Debugger: React.FC = () => {
  const { user, loading } = useAppSelector((s) => s.auth);

  console.log("🔍 Auth Debug:", {
    user: user?.email,
    uid: user?.uid,
    loading,
    hasUser: !!user,
  });

  return null;
};
