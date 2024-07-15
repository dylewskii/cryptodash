import { checkAuth } from "@/lib";
import { useUserStore } from "@/stores/useUserStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({
  children,
}: ProtectedRoutesProps): JSX.Element => {
  const user = useUserStore((state) => state.user);
  const accessToken = useUserStore((state) => state.accessToken);
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth(accessToken, setAccessToken, setUser);
      setIsChecking(false);
    };
    verifyAuth();
  }, [accessToken, setAccessToken, setUser]);

  if (isChecking) {
    return (
      <div className="mx-auto my-auto">
        <Loader2 className="animate-spin"></Loader2>
      </div>
    );
  }

  return user.isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
