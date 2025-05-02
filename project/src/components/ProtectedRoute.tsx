import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../store/auth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [user] = useAtom(userAtom);

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to appropriate dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // User has access
  return <>{children}</>;
};

export default ProtectedRoute;