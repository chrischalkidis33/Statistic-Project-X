import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function DefaultNavigate() {
  const { isAuth } = useAuth();

  return isAuth ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
