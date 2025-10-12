import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminService, Admin } from "@/services/adminService";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token by getting admin profile
        const adminData = await adminService.getAdminProfile();
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Admin authentication check failed:", error);
        // Clear invalid tokens
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
