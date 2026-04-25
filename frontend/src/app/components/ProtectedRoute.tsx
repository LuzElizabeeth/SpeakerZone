import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/conference.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const getHomePathByRole = (role?: UserRole) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'speaker':
      return '/speaker/dashboard';
    case 'attendee':
      return '/attendee/dashboard';
    default:
      return '/login';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;