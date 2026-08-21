import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStores";

const ProtectedRoute = () => {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    checkAuthStatus().finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000d24] text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
