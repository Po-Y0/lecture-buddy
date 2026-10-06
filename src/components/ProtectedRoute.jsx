import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <p className="muted">กำลังโหลด...</p>;
  return user ? children : <Navigate to="/login" replace />;
}