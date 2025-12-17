import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, userData, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
