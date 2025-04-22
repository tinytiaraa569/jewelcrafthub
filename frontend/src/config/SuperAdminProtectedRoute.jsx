import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SuperAdminProtectedRoute = ({ children }) => {
    const { adminUser, authChecked, loading } = useSelector((state) => state.adminAuth);
  
  
    if (loading || !authChecked) {
      return <div>Loading...</div>;
    }
  
    if (!adminUser || adminUser.role !== "superadmin") {
      return <Navigate to="/admin-dashboard" />;
    }
  
    return children;
  };
  

export default SuperAdminProtectedRoute;
