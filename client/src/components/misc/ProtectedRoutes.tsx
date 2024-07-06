import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({
  children,
}: ProtectedRoutesProps): JSX.Element => {
  const { user, checkAuth } = useContext(UserContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verifyAuth();
  }, [checkAuth]);

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
