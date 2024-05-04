import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export default function ProtectedRoutes({
  children,
}: ProtectedRoutesProps): JSX.Element {
  const { user } = useContext(UserContext);

  return user.userId ? <>{children}</> : <Navigate to="/login" replace />;
}
