import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
