import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {jwtDecode} from "jwt-decode";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (auth?.accessToken) {
        const decoded = jwtDecode(auth.accessToken);
        setIsAuthenticated(!!decoded);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [auth]);

  if (isLoading) {
    return <p>Loading...</p>; // You can replace this with a better loading indicator
  }

  return (
    isAuthenticated
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;