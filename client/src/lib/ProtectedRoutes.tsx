import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
