import { checkAuth } from "@/lib";
import { useUserStore } from "@/stores/useUserStore";
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
    // TODO: replace with loading spinner
    return <div className="mx-auto my-auto">Loading...</div>;
  }

  return user.isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
