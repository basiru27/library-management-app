import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children, allowedRoles }) {
    const { token, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-violet-600">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user) {
        // Backend roles might be "ROLE_ADMIN" or "ADMIN". We handle both.
        const userRole = user.role.replace('ROLE_', '');
        const hasPermission = allowedRoles.some(role => role === userRole);

        if (!hasPermission) {
            // Redirect to dashboard or home if unauthorized for this specific route
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
